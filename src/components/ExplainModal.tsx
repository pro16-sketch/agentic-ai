import React from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  Search, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWalkthrough?: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  onStartWalkthrough
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">How ARGUS Works</h2>
              <p className="text-xs text-slate-400 mt-0.5">Autonomous AI Incident Resolution for E-Commerce & Retail Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Plain English Concept */}
          <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
            <strong className="text-blue-300 font-semibold block mb-1">What problem does this solve?</strong>
            When products start getting returned en masse or inventory runs out, retail executives usually don't find out until end-of-month financial reports — after losing tens of thousands of dollars.
            <br className="mb-2" />
            <strong>ARGUS</strong> is an autonomous AI agent that continuously monitors sales telemetry. When something goes wrong, it automatically diagnoses the root cause, tests hypotheses against real logs, calculates ROI for multiple solutions, and presents a 1-click executive decision.
          </div>

          {/* 4 Step Process Cards: LangGraph Agentic Loop */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                LangGraph Agentic Loop: Plan → Act → Observe → Adapt
              </span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-2 py-0.5 rounded">
                Stateful Agent Graph
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-md bg-rose-950 border border-rose-800 flex items-center justify-center text-xs font-mono text-rose-300">1</span>
                  <span>Plan: Detect Anomaly</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ARGUS flags that <em>Aura Sound Pro Headphones</em> return rate jumped from 2.1% to 14.8% after firmware v2.4, risking $38,400/month in profit. Formulates initial hypotheses in graph state.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xs font-mono text-indigo-300">2</span>
                  <span>Act: Tool Execution</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The agent calls LangChain tools (PostgreSQL SQL queries, Python/Pandas telemetry analytics, API lookups) to test hypotheses and verify return text clusters.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-md bg-amber-950 border border-amber-800 flex items-center justify-center text-xs font-mono text-amber-300">3</span>
                  <span>Observe: Root Cause Synthesis</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Confirms BLE buffer memory leak (92% confidence). ARGUS models 3 solutions (Balanced Hotfix, Full Recall, Price Drop) with calculated costs and ROI multipliers.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                  <span className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs font-mono text-emerald-300">4</span>
                  <span>Adapt: Human Approval & Execution</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You review and approve the recommended hotfix with 1 click. The agent executes the plan, restocks parts via expedited logistics, and resolves the anomaly!
                </p>
              </div>
            </div>
          </div>

          {/* Production Tech Stack Architecture Card */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Production Tech Stack Architecture</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Enterprise Ready</span>
            </div>

            {/* Compact presentation badge */}
            <div className="p-2.5 bg-slate-900 border border-blue-500/30 rounded-lg text-center shadow-inner">
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase mb-0.5">Compact Presentation Stack</div>
              <div className="font-mono text-xs text-white font-semibold break-words">
                React + Tailwind | Python + FastAPI | LangGraph + LangChain | Gemini/OpenAI | SQL + Pandas | APIs + Web Search | Docker
              </div>
            </div>

            {/* Quick architecture bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-blue-300 block text-[11px] mb-0.5">Frontend & State UI:</strong>
                React.js • Tailwind CSS • Recharts interactive dashboards
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-indigo-300 block text-[11px] mb-0.5">Backend & Agent Workflow:</strong>
                Python • FastAPI • LangGraph • LangChain
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-amber-300 block text-[11px] mb-0.5">Cognitive AI & Tool Invocations:</strong>
                Gemini/OpenAI • SQL queries • Python/Pandas analysis • APIs • Web search • File/Docs
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-emerald-300 block text-[11px] mb-0.5">Data & Cloud Deployment:</strong>
                PostgreSQL/MySQL • Pandas analytics • Docker • Render / AWS
              </div>
            </div>
          </div>

          {/* Key Principle */}
          <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <strong className="text-emerald-300">Human-in-the-Loop Safety:</strong> The AI never takes drastic business actions without executive authorization.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready to try it?</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Got it
            </button>
            {onStartWalkthrough && (
              <button
                onClick={() => {
                  onClose();
                  onStartWalkthrough();
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/30"
              >
                <span>Take the 1-Minute Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
