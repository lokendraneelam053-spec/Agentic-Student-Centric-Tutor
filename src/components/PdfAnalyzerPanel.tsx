import React, { useRef, useState } from 'react';
import { useTutor } from '../context/TutorContext';
import {
  FileText,
  Upload,
  Sparkles,
  Trash2,
  FileCheck2,
  ListFilter,
  CheckCircle2,
  Calculator,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const PdfAnalyzerPanel: React.FC = () => {
  const {
    uploadedDocument,
    isAnalyzingPdf,
    handleUploadPdfFile,
    handleLoadSamplePdf,
    handleAnalyzePdf,
    handleRemoveDocument,
    handleSendMessage,
    profile,
  } = useTutor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'summary' | 'formulas' | 'concepts' | 'practice'>('summary');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadPdfFile(e.target.files[0]);
    }
  };

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">PDF Document Intelligence</h3>
            <p className="text-[11px] text-slate-500">Analyze syllabus, lecture notes & textbooks</p>
          </div>
        </div>

        {uploadedDocument && (
          <button
            onClick={handleRemoveDocument}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            title="Remove document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".pdf,.txt,.md"
        className="hidden"
      />

      {/* Empty State: Upload or Load Sample */}
      {!uploadedDocument ? (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-5 text-center transition cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 group"
          >
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 mx-auto mb-2 transition" />
            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">
              Upload PDF or Lecture Notes
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports .pdf textbooks, slides, and syllabus documents
            </p>
            <button
              type="button"
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs group-hover:border-indigo-300"
            >
              Browse Files
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-indigo-950 block">Quick Academic Sample</span>
                <span className="text-[11px] text-indigo-700">Load verified {profile.topic} notes</span>
              </div>
            </div>
            <button
              onClick={handleLoadSamplePdf}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
            >
              Load Sample PDF
            </button>
          </div>
        </div>
      ) : (
        /* Document Loaded View */
        <div className="space-y-4">
          {/* Active File Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-white truncate block" title={uploadedDocument.name}>
                  {uploadedDocument.name}
                </span>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>{(uploadedDocument.size / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Active in AI Tutor Chat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Agent Tools */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              onClick={() => handleAnalyzePdf('summarize')}
              disabled={isAnalyzingPdf}
              className="p-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-[11px] font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              📋 Summarize
            </button>
            <button
              onClick={() => handleAnalyzePdf('questions')}
              disabled={isAnalyzingPdf}
              className="p-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-[11px] font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              📝 Practice Qs
            </button>
            <button
              onClick={() => handleAnalyzePdf('cheat_sheet')}
              disabled={isAnalyzingPdf}
              className="p-2 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-[11px] font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              📐 Formulas
            </button>
          </div>

          {/* Gemini Analyzing State Indicator */}
          {isAnalyzingPdf && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-xs text-indigo-900 flex items-center space-x-2.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <div>
                <span className="font-bold block">Gemini 3 Document Intelligence</span>
                <span className="text-[11px] text-indigo-700">Extracting academic concepts, formulas & practice items...</span>
              </div>
            </div>
          )}

          {/* Analysis View Tabs */}
          {uploadedDocument.analysis && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-1 border-b border-slate-100 pb-1 text-xs">
                <button
                  onClick={() => setActiveAnalysisTab('summary')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                    activeAnalysisTab === 'summary' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveAnalysisTab('formulas')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                    activeAnalysisTab === 'formulas' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Formulas ({uploadedDocument.analysis.keyFormulas?.length || 0})
                </button>
                <button
                  onClick={() => setActiveAnalysisTab('concepts')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                    activeAnalysisTab === 'concepts' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Concepts ({uploadedDocument.analysis.keyConcepts?.length || 0})
                </button>
                <button
                  onClick={() => setActiveAnalysisTab('practice')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                    activeAnalysisTab === 'practice' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Problems
                </button>
              </div>

              {/* Tab 1: Summary */}
              {activeAnalysisTab === 'summary' && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-56 overflow-y-auto">
                  <p className="font-bold text-slate-900 mb-1">{uploadedDocument.analysis.title}</p>
                  <p>{uploadedDocument.analysis.summary}</p>
                </div>
              )}

              {/* Tab 2: Formulas */}
              {activeAnalysisTab === 'formulas' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {uploadedDocument.analysis.keyFormulas?.map((formula, fIdx) => (
                    <div key={fIdx} className="p-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
                      <span className="font-bold text-cyan-300 text-[11px] block">{formula.name}</span>
                      <div className="py-1 px-2 my-1 bg-slate-950 rounded text-emerald-400 font-mono text-[11px]">
                        {formula.formula}
                      </div>
                      <p className="text-[10px] text-slate-300 font-sans">{formula.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Key Concepts */}
              {activeAnalysisTab === 'concepts' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {uploadedDocument.analysis.keyConcepts?.map((concept, cIdx) => (
                    <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-indigo-900 block">{concept.term}</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{concept.definition}</p>
                      {concept.importance && (
                        <p className="text-[10px] text-slate-500 mt-1 italic">Note: {concept.importance}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Practice Problems */}
              {activeAnalysisTab === 'practice' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {uploadedDocument.analysis.practiceQuestions?.map((pq, pIdx) => {
                    const isOpen = expandedQuestions[pIdx];
                    return (
                      <div key={pIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-800 text-[11px]">Q{pIdx + 1}: {pq.question}</span>
                          <button
                            onClick={() => toggleQuestion(pIdx)}
                            className="text-indigo-600 font-semibold text-[10px] shrink-0 underline cursor-pointer"
                          >
                            {isOpen ? 'Hide' : 'Solution'}
                          </button>
                        </div>
                        {isOpen && (
                          <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 text-[11px] pl-2 border-l-2 border-indigo-400">
                            <strong>Worked Solution: </strong>
                            <span>{pq.answer}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ask Question About PDF Button */}
              <button
                type="button"
                onClick={() => handleSendMessage(`Can you explain the main formulas and theorems given in ${uploadedDocument.name}?`)}
                className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Ask AI Tutor About This Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
