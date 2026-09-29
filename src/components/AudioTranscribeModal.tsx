import React, { useState, useRef, useEffect } from 'react';
import { useTutor } from '../context/TutorContext';
import { fetchAudioTranscription } from '../services/api';
import { saveTranscriptionToFirestore } from '../services/firebase';
import {
  Mic,
  Square,
  Sparkles,
  Copy,
  Send,
  Save,
  Check,
  AlertCircle,
  X,
  Volume2,
  FileText,
  Clock,
} from 'lucide-react';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const { profile, firebaseUser, addAgentActivity } = useTutor();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMsg(null);
    setTranscribedText('');
    setAudioUrl(null);
    setAudioBase64(null);
    setSavedToDb(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          setAudioBase64(base64Data);

          // Automatically transcribe with gemini-3.5-transcribe
          await handleTranscribeAudio(base64Data, mimeType);
        };
        reader.readAsDataURL(audioBlob);

        // Stop media tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error accessing microphone for transcription:', err);
      setErrorMsg(err.message || 'Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribeAudio = async (base64String: string, mime: string) => {
    setIsTranscribing(true);
    setErrorMsg(null);

    try {
      const result = await fetchAudioTranscription({
        audioBase64: base64String,
        mimeType: mime,
        prompt: `Transcribe this academic audio query for a student studying ${profile.subject}: ${profile.topic}.`,
      });

      const text = result.transcription || 'No speech detected';
      setTranscribedText(text);

      addAgentActivity(
        'Audio Transcribed with gemini-3.5-transcribe',
        `Transcribed ${recordingSeconds}s audio: "${text.slice(0, 60)}..."`,
        'tutoring'
      );

      // Auto save to Firestore if authenticated
      if (firebaseUser?.uid) {
        saveTranscriptionToFirestore(firebaseUser.uid, {
          id: `trans-${Date.now()}`,
          text,
          durationSeconds: recordingSeconds,
          topic: profile.topic,
        });
        setSavedToDb(true);
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMsg(err.message || 'Failed to transcribe audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToTutor = () => {
    if (!transcribedText) return;
    if (onSendToChat) {
      onSendToChat(transcribedText);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Audio Transcription</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Microphone Speech-to-Text
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Powered by <strong className="text-indigo-300">gemini-3.5-transcribe</strong>. Speak your question, lecture excerpt, or formula.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Record Control Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
            {isRecording ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 animate-ping absolute inset-0" />
                  <button
                    onClick={stopRecording}
                    className="relative w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition cursor-pointer"
                  >
                    <Square className="w-8 h-8 fill-current" />
                  </button>
                </div>
                <div>
                  <span className="font-mono text-xl font-bold text-rose-600">
                    {Math.floor(recordingSeconds / 60)}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Recording audio... Click stop when finished
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={startRecording}
                  disabled={isTranscribing}
                  className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  <Mic className="w-8 h-8" />
                </button>
                <div>
                  <p className="font-bold text-sm text-slate-800">
                    Click to Record Question or Note
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Microphone input will be transcribed with gemini-3.5-transcribe
                  </p>
                </div>
              </div>
            )}

            {/* Audio playback preview */}
            {audioUrl && !isRecording && (
              <div className="mt-4 w-full">
                <audio controls src={audioUrl} className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Transcribing Loading Indicator */}
          {isTranscribing && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center space-x-3 text-xs text-indigo-900 animate-pulse">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
              <div>
                <span className="font-bold block">Transcribing Audio...</span>
                <span className="text-[11px] text-indigo-700">Model gemini-3.5-transcribe is decoding spoken language into text</span>
              </div>
            </div>
          )}

          {/* Transcription Result Area */}
          {transcribedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-700 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Transcription Result:</span>
                </span>
                {savedToDb && (
                  <span className="text-emerald-600 text-[11px] font-semibold flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Saved to Firestore
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 leading-relaxed font-normal whitespace-pre-wrap select-all">
                {transcribedText}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSendToTutor}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor This Question</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
