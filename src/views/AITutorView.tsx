import React, { useState, useRef, useEffect } from 'react';
import { useTutor } from '../context/TutorContext';
import { PdfAnalyzerPanel } from '../components/PdfAnalyzerPanel';
import {
  Send,
  Sparkles,
  Lightbulb,
  HelpCircle,
  FileCheck2,
  BookOpen,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  Cpu,
  BrainCircuit,
  Info,
  Layers,
  ArrowRight,
  FileText,
  Paperclip,
  CheckCircle2,
  Mic,
  Radio,
} from 'lucide-react';

export const AITutorView: React.FC = () => {
  const {
    profile,
    plan,
    currentStepIndex,
    setCurrentStepIndex,
    activeStep,
    chatMessages,
    handleSendMessage,
    isTutorTyping,
    handleGenerateAssessment,
    isGeneratingAssessment,
    handleCompleteCurrentStep,
    uploadedDocument,
    handleUploadPdfFile,
    handleLoadSamplePdf,
    isAnalyzingPdf,
    setIsLiveVoiceOpen,
    setIsTranscribeModalOpen,
  } = useTutor();

  const [inputMessage, setInputMessage] = useState('');
  const [activeHints, setActiveHints] = useState<Record<string, boolean>>({});
  const [rightPanelTab, setRightPanelTab] = useState<'schedule' | 'pdf'>(uploadedDocument ? 'pdf' : 'schedule');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadPdfFile(e.target.files[0]);
      setRightPanelTab('pdf');
      e.target.value = '';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTutorTyping]);

  useEffect(() => {
    if (uploadedDocument) {
      setRightPanelTab('pdf');
    }
  }, [uploadedDocument]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTutorTyping) return;
    const msg = inputMessage;
    setInputMessage('');
    handleSendMessage(msg);
  };

  const handleSuggestedClick = (text: string) => {
    if (isTutorTyping) return;
    handleSendMessage(text);
  };

  const toggleHint = (hintKey: string) => {
    setActiveHints(prev => ({ ...prev, [hintKey]: !prev[hintKey] }));
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6 pb-4">
      {/* Left / Center: Interactive Tutoring Chatroom */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {/* Tutor Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm sm:text-base text-white">AI Academic Tutor</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {profile.knowledgeLevel} Mode
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-300 animate-pulse" />
                  Gemini 3 Intelligence
                </span>
                {uploadedDocument && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Subject: <span className="text-slate-200 font-medium">{profile.subject}</span> • <span className="text-indigo-300">{profile.topic}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
              title="Real-time voice conversation with gemini-3.8-live"
            >
              <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="hidden sm:inline">Live Voice Tutor</span>
              <span className="sm:hidden">Live</span>
            </button>

            <button
              onClick={() => {
                if (!uploadedDocument) {
                  fileInputRef.current?.click();
                } else {
                  setRightPanelTab(rightPanelTab === 'pdf' ? 'schedule' : 'pdf');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                rightPanelTab === 'pdf'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isAnalyzingPdf ? 'Analyzing PDF...' : uploadedDocument ? 'PDF Active' : 'Upload / Analyze PDF'}</span>
            </button>

            <button
              onClick={() => handleGenerateAssessment()}
              disabled={isGeneratingAssessment}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4" />
              <span className="hidden sm:inline">Diagnostic Assessment</span>
              <span className="sm:hidden">Assess</span>
            </button>
          </div>
        </div>

        {/* Current Step Sub-bar */}
        {activeStep && (
          <div className="px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-indigo-900">Active Curriculum Phase:</span>
              <span className="font-semibold text-indigo-700">{activeStep.title}</span>
              <span className="text-indigo-400">•</span>
              <span className="text-slate-600 italic hidden md:inline">{activeStep.learningObjective}</span>
            </div>
            <button
              onClick={handleCompleteCurrentStep}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Complete Phase →
            </button>
          </div>
        )}

        {/* Document Ingestion Bar if Document is Active */}
        {uploadedDocument && (
          <div className="px-6 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] text-slate-400">PDF Context Grounding:</span>
              <span className="font-bold text-white text-[11px] truncate max-w-xs">{uploadedDocument.name}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono shrink-0">Answers grounded in document</span>
          </div>
        )}

        {/* Chat History Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {chatMessages.map((msg, index) => {
            const isTutor = msg.role === 'tutor';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                    isTutor
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                        isTutor ? 'text-indigo-600' : 'text-indigo-200'
                      }`}
                    >
                      <span>{isTutor ? 'Academic Tutor' : profile.name}</span>
                      {msg.pdfReference && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 font-normal normal-case">
                          <FileText className="w-2.5 h-2.5 mr-1" />
                          {msg.pdfReference.fileName}
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isTutor ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                    {msg.content}
                  </div>

                  {/* Concept Card / Formula Snippet if provided */}
                  {msg.conceptCard && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 font-mono text-xs">
                      <div className="flex items-center space-x-2 text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{msg.conceptCard.title}</span>
                      </div>
                      {msg.conceptCard.formula && (
                        <div className="py-2 px-3 my-2 bg-slate-950 rounded-lg text-emerald-400 font-bold text-center tracking-wide text-xs sm:text-sm border border-slate-800">
                          {msg.conceptCard.formula}
                        </div>
                      )}
                      <p className="text-slate-300 font-sans text-xs">
                        {msg.conceptCard.explanation}
                      </p>
                    </div>
                  )}

                  {/* Socratic Hints */}
                  {msg.hints && msg.hints.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.hints.map((hint, hIdx) => {
                        const hintKey = `${msg.id}-hint-${hIdx}`;
                        const isRevealed = activeHints[hintKey];

                        return (
                          <div
                            key={hintKey}
                            className="rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs text-amber-900"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center space-x-1.5 text-amber-800">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                <span>Guided Insight / Hint #{hIdx + 1}</span>
                              </span>
                              <button
                                onClick={() => toggleHint(hintKey)}
                                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                              >
                                {isRevealed ? 'Hide' : 'Reveal'}
                              </button>
                            </div>
                            {isRevealed && (
                              <p className="mt-2 text-slate-700 leading-relaxed pl-5 border-l-2 border-amber-400">
                                {hint}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* High-level Agent Action Tag */}
                  {msg.agentAction && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[10px] text-slate-400">
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      <span>Agent Action: {msg.agentAction}</span>
                    </div>
                  )}
                </div>

                {/* Suggested Student Responses / Quick Prompts */}
                {isTutor && msg.suggestedStudentResponses && msg.suggestedStudentResponses.length > 0 && index === chatMessages.length - 1 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 self-center mr-1">
                      Suggested Follow-Up:
                    </span>
                    {msg.suggestedStudentResponses.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSuggestedClick(suggestion)}
                        disabled={isTutorTyping}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs text-slate-700 hover:text-indigo-800 font-medium transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTutorTyping && (
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white border border-slate-200 max-w-xs shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-600">
                  {uploadedDocument ? 'Analyzing document & formulating answer' : 'Formulating academic answer'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form with Document Attachment Support */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          {/* Hidden File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileInputChange}
            accept=".pdf,.txt,.md"
            className="hidden"
          />

          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                if (!uploadedDocument) {
                  fileInputRef.current?.click();
                } else {
                  setRightPanelTab('pdf');
                }
              }}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-center ${
                uploadedDocument
                  ? 'border-cyan-300 bg-cyan-50 text-cyan-700 shadow-2xs'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-500 hover:text-indigo-600'
              }`}
              title={uploadedDocument ? `Document active: ${uploadedDocument.name}. Click to view analysis` : 'Upload and analyze PDF / Lecture Notes'}
            >
              <FileText className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={
                uploadedDocument
                  ? `Ask a specific question about ${uploadedDocument.name} or ${profile.topic}...`
                  : `Ask any academic question, derivation, or formula for ${profile.topic}...`
              }
              disabled={isTutorTyping}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-100 font-normal"
            />

            <button
              type="button"
              onClick={() => setIsTranscribeModalOpen(true)}
              className="p-3 rounded-2xl border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-500 hover:text-emerald-600 transition cursor-pointer flex items-center justify-center"
              title="Record and transcribe speech using gemini-3.5-transcribe"
            >
              <Mic className="w-5 h-5 text-emerald-500" />
            </button>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTutorTyping}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-sm shadow-indigo-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Helper Chips */}
          <div className="mt-2.5 flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick prompts:</span>
            {uploadedDocument ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage(`Can you explain the main formulas and theorems given in ${uploadedDocument.name}?`)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-[11px] font-medium shrink-0 cursor-pointer"
                >
                  📄 Explain Attached PDF Formulas
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(`What are the key derivations and assumptions stated in ${uploadedDocument.name}?`)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-[11px] font-medium shrink-0 cursor-pointer"
                >
                  🔍 PDF Derivations
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => handleSendMessage('Can you explain this with an intuitive physical analogy?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium shrink-0 cursor-pointer"
            >
              💡 Intuitive Analogy
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Can you walk me through a worked numerical calculation step-by-step?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium shrink-0 cursor-pointer"
            >
              📐 Worked Calculation
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('What is the governing formula and what does each variable stand for?')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium shrink-0 cursor-pointer"
            >
              🔍 Formula Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Toggle between PDF Analyzer and Curriculum Steps */}
      <div className="w-full lg:w-84 flex flex-col space-y-4 shrink-0 overflow-y-auto">
        {/* Toggle Bar */}
        <div className="p-1 rounded-2xl bg-slate-200/80 border border-slate-300 flex items-center text-xs font-bold">
          <button
            onClick={() => setRightPanelTab('schedule')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              rightPanelTab === 'schedule'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Learning Plan</span>
          </button>
          <button
            onClick={() => setRightPanelTab('pdf')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
              rightPanelTab === 'pdf'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Analyzer</span>
            {uploadedDocument && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
          </button>
        </div>

        {rightPanelTab === 'pdf' ? (
          <PdfAnalyzerPanel />
        ) : (
          /* Active Learning Steps */
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Active Curriculum Steps</span>
            </div>

            {plan ? (
              <div className="space-y-2">
                {plan.steps.map((st, i) => {
                  const isSelected = i === currentStepIndex;
                  const isCompleted = st.status === 'completed';

                  return (
                    <button
                      key={st.id}
                      onClick={() => setCurrentStepIndex(i)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/50 text-slate-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold line-clamp-1">{st.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{st.durationMinutes} min</span>
                      </div>
                      {isCompleted ? (
                        <span className="text-emerald-600 font-bold text-xs">✓</span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">#{i + 1}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3">No active steps loaded.</p>
            )}
          </div>
        )}

        {/* Pedagogical Principle Callout */}
        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-md border border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Direct Answering Standard</span>
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-100">Responsive Question Answering</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            The tutor delivers direct, mathematically sound answers to your specific questions, formulas, or uploaded notes, followed by conceptual insights and practical examples.
          </p>
        </div>
      </div>
    </div>
  );
};
