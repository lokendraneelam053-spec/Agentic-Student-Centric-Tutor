import React, { useState, useEffect, useRef } from 'react';
import { useTutor } from '../context/TutorContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Radio,
  Sparkles,
  Cpu,
  X,
  MessageSquare,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { saveVoiceSessionToFirestore } from '../services/firebase';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const { profile, firebaseUser, addAgentActivity } = useTutor();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [isUserSpeaking, setIsUserSpeaking] = useState(false); // User mic input detected
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [conversationTurns, setConversationTurns] = useState<
    Array<{ role: 'user' | 'model'; text: string; timestamp: string }>
  >([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);
  const sessionStartTimeRef = useRef<number>(Date.now());

  isMutedRef.current = isMuted;

  // Convert Float32Array to 16-bit PCM ArrayBuffer then Base64
  const floatTo16BitPCMBase64 = (input: Float32Array): string => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Convert Base64 16-bit PCM (24kHz) to AudioBuffer and play gaplessly
  const play24kHzAudioChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) return;
    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const dataView = new DataView(bytes.buffer);
      const numSamples = Math.floor(bytes.length / 2);
      const float32 = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      activeSourcesRef.current.push(source);
      setIsSpeaking(true);

      source.onended = () => {
        const idx = activeSourcesRef.current.indexOf(source);
        if (idx !== -1) {
          activeSourcesRef.current.splice(idx, 1);
        }
        if (activeSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Error decoding/playing Live API audio chunk:', e);
    }
  };

  const stopActiveAudio = () => {
    activeSourcesRef.current.forEach(src => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsSpeaking(false);
  };

  const startLiveSession = async () => {
    setErrorMsg(null);
    setIsConnecting(true);
    sessionStartTimeRef.current = Date.now();

    try {
      // 1. Prepare Audio Contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioCtxRef.current = new AudioCtx({ sampleRate: 16000 });
      outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // 3. Connect WebSocket to /api/live-voice
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-voice`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Live Voice WebSocket connection opened.');
        setIsConnecting(false);
        setIsConnected(true);
        addAgentActivity(
          'Live Voice Session Started',
          `Voice conversation active with gemini-3.8-live for ${profile.topic}.`,
          'tutoring'
        );

        // Send initial student context to model
        ws.send(
          JSON.stringify({
            text: `Hello! I am ${profile.name}. I am studying ${profile.subject}: ${profile.topic} at the ${profile.knowledgeLevel} level for ${profile.goal}. Please introduce yourself briefly and ask how you can help me understand this topic.`,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            setErrorMsg(data.error);
          }
          if (data.interrupted) {
            stopActiveAudio();
          }
          if (data.audio) {
            play24kHzAudioChunk(data.audio);
          }
          if (data.text) {
            setConversationTurns(prev => [
              ...prev,
              {
                role: 'model',
                text: data.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setErrorMsg('Could not establish real-time connection with Live API.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed.');
        setIsConnected(false);
        setIsConnecting(false);
      };

      // 4. Hook microphone input processor
      const sourceNode = inputAudioCtxRef.current.createMediaStreamSource(stream);
      // ScriptProcessorNode buffers 4096 samples at 16kHz
      const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate simple RMS for visual indicator
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setIsUserSpeaking(rms > 0.02);

        const base64Audio = floatTo16BitPCMBase64(inputData);
        ws.send(JSON.stringify({ audio: base64Audio }));
      };

      sourceNode.connect(processor);
      processor.connect(inputAudioCtxRef.current.destination);
    } catch (err: any) {
      console.error('Failed to start Live Voice session:', err);
      setErrorMsg(err.message || 'Microphone access denied or audio initialization failed.');
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const endLiveSession = () => {
    stopActiveAudio();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close().catch(() => {});
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsUserSpeaking(false);

    // Persist session if we had interaction
    const durationSeconds = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
    if (durationSeconds > 5 && firebaseUser?.uid) {
      saveVoiceSessionToFirestore(firebaseUser.uid, {
        id: `voice-${Date.now()}`,
        turns: conversationTurns,
        durationSeconds,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      endLiveSession();
    }

    return () => {
      endLiveSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Radio className={`w-5 h-5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">Live Voice Tutoring</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {profile.topic} • Real-time Live API audio stream
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Audio Visualizer Arena */}
        <div className="p-8 flex flex-col items-center justify-center text-center bg-radial from-indigo-950/40 via-slate-900 to-slate-950">
          {/* Animated Pulsing Voice Avatar */}
          <div className="relative mb-6">
            {/* Outer dynamic ripples */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping duration-1000 scale-150 pointer-events-none" />
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse duration-700 scale-125 pointer-events-none" />
              </>
            )}

            {isUserSpeaking && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping duration-700 scale-125 pointer-events-none" />
            )}

            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 ring-4 ring-indigo-400/50 shadow-indigo-500/40 scale-105'
                  : isUserSpeaking
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 ring-4 ring-emerald-400/50 shadow-emerald-500/40'
                  : isConnected
                  ? 'bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600'
                  : 'bg-slate-800 border-2 border-slate-700'
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-bounce" />
              ) : isUserSpeaking ? (
                <Mic className="w-12 h-12 text-white animate-pulse" />
              ) : (
                <Radio className="w-10 h-10 text-slate-400" />
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-slate-800 border border-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? (isSpeaking ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400') : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-200">
              {isConnecting
                ? 'Connecting to gemini-3.8-live...'
                : isSpeaking
                ? 'AI Tutor Speaking...'
                : isUserSpeaking
                ? 'Listening to you...'
                : isConnected
                ? 'Connected — Speak freely anytime'
                : 'Session Disconnected'}
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-sm">
            Speak into your microphone. Model responds in real-time with spoken audio. You can interrupt naturally whenever you want!
          </p>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Feed */}
        {conversationTurns.length > 0 && (
          <div className="px-6 py-3 border-t border-b border-slate-800 bg-slate-950/60 max-h-36 overflow-y-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Live Transcript:
            </span>
            {conversationTurns.slice(-4).map((turn, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className={turn.role === 'model' ? 'font-bold text-indigo-400' : 'font-bold text-emerald-400'}>
                  {turn.role === 'model' ? 'Tutor: ' : 'You: '}
                </span>
                <span className="text-slate-300">{turn.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Control Buttons Bar */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-around">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center space-x-2 ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-xs font-semibold">{isMuted ? 'Unmute' : 'Mute Mic'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopActiveAudio}
              className="px-4 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5"
            >
              <VolumeX className="w-4 h-4" />
              <span>Interrupt</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/30 cursor-pointer flex items-center space-x-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
