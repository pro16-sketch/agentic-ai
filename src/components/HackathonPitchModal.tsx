import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  BarChart2, 
  Cpu, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface HackathonPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioKey: string) => void;
  onOpenCopilot: () => void;
}

export const HackathonPitchModal: React.FC<HackathonPitchModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onOpenCopilot
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "The $500B Operational Blind Spot",
      subtitle: "Why Traditional Business Intelligence Fails Modern Enterprise",
      icon: TrendingDown,
      badge: "The Problem",
      badgeColor: "bg-rose-950/80 text-rose-300 border-rose-800",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p className="text-sm text-slate-200">
            Every year, global retail and hardware companies leak over <strong className="text-rose-400 font-bold">$500 Billion</strong> in cash due to three silent killers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">1. Late Defect Isolation</span>
              <p className="text-[11px] text-slate-400">Firmware regressions spike return rates 7x, but executives only see it 30 days later in accounting reviews.</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">2. Supplier Blind Spots</span>
              <p className="text-[11px] text-slate-400">Component lead times expand from 5 to 14 days with zero warning, triggering crippling stockouts.</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">3. Decision Paralysis</span>
              <p className="text-[11px] text-slate-400">Teams debate for weeks between full recalls vs patch air-freight, losing market share every hour.</p>
            </div>
          </div>
          <div className="bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl text-rose-200 text-xs">
            <strong>Traditional Dashboards are Tombstones:</strong> They show you where money died yesterday, but they cannot formulate hypotheses, run database diagnostics, or execute recovery.
          </div>
        </div>
      )
    },
    {
      title: "Enter ARGUS: Autonomous Operations Agent",
      subtitle: "Powered by LangGraph Agentic Loop: Plan → Act → Observe → Adapt",
      icon: Cpu,
      badge: "The Solution",
      badgeColor: "bg-blue-950/80 text-blue-300 border-blue-800",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p className="text-sm text-slate-200">
            ARGUS is not a passive dashboard. It is an <strong className="text-blue-400 font-bold">autonomous cognitive agent</strong> built on <strong className="text-indigo-400 font-bold">LangGraph</strong> to execute a continuous, stateful agentic loop:
          </p>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-rose-950 text-rose-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-rose-800">1</span>
              <div>
                <strong className="text-white text-xs">PLAN (Telemetry & Hypothesis):</strong> Senses statistical anomalies in real time (Z-score +4.8σ) and decomposes the crisis into competing causal hypotheses.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-indigo-800">2</span>
              <div>
                <strong className="text-white text-xs">ACT (LangChain Tool Invocations):</strong> Autonomously invokes structured tools: PostgreSQL SQL queries, Python/Pandas analytics, external APIs, and document diagnostics.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-amber-800">3</span>
              <div>
                <strong className="text-white text-xs">OBSERVE (Evidence Synthesis):</strong> Analyzes tool execution outputs, validates root cause (92% confidence BLE stack leak), and eliminates false hypotheses.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-800">4</span>
              <div>
                <strong className="text-white text-xs">ADAPT (Strategy & Human Gate):</strong> Dynamically calculates financial ROI for 3 strategic options (Balanced, Conservative, Aggressive) and requests 1-click executive authorization.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Live Demo: 4 Black Swan Scenarios",
      subtitle: "Click Any Scenario Below to Watch ARGUS Reason Live",
      icon: Zap,
      badge: "Live Scenarios",
      badgeColor: "bg-amber-950/80 text-amber-300 border-amber-800",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Test ARGUS by injecting real-world operational crises and watch the agent isolate root causes and formulate strategic ROI models:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onSelectScenario('firmware_leak');
                onClose();
              }}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-blue-400">Firmware BLE Memory Leak</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">14.8% Returns</span>
              </div>
              <p className="text-[11px] text-slate-400">Aura Sound Pro headphones suffer Bluetooth dropouts. $38,400 monthly profit loss.</p>
              <div className="mt-2 text-[10px] text-blue-400 font-semibold flex items-center space-x-1">
                <span>Run Scenario →</span>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectScenario('supplier_bottleneck');
                onClose();
              }}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-400">Supplier Port Bottleneck</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">7.6d Stockout</span>
              </div>
              <p className="text-[11px] text-slate-400">Global Microelectronics expands lead times to 14 days on Nexus Watch Ultra 2.</p>
              <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center space-x-1">
                <span>Run Scenario →</span>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectScenario('viral_defect');
                onClose();
              }}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-400">Viral TikTok Defect Surge</span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">+340% Returns</span>
              </div>
              <p className="text-[11px] text-slate-400">Vortex Mechanical Keyboard batch switch chatter defect goes viral on social media.</p>
              <div className="mt-2 text-[10px] text-indigo-400 font-semibold flex items-center space-x-1">
                <span>Run Scenario →</span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCopilot();
              }}
              className="text-left p-3 rounded-xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 hover:from-blue-900/60 hover:to-indigo-900/60 border border-blue-800/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-blue-300">Ask ARGUS (Gemini 3.8)</span>
                <span className="text-[10px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded border border-blue-700/60">Live AI Copilot</span>
              </div>
              <p className="text-[11px] text-slate-400">Ask any free-form question about supply chains, margins, or strategies.</p>
              <div className="mt-2 text-[10px] text-blue-300 font-semibold flex items-center space-x-1">
                <span>Open Copilot →</span>
              </div>
            </button>
          </div>
        </div>
      )
    },
    {
      title: "ARGUS Architecture & Production Tech Stack",
      subtitle: "Stateful Agentic Graph Built for Real Enterprise Operations",
      icon: Trophy,
      badge: "Tech Stack & Architecture",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
      content: (
        <div className="space-y-3.5 text-xs leading-relaxed text-slate-300">
          {/* Compact Presentation Badge */}
          <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3 text-center shadow-inner">
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider mb-1">
              Compact Presentation Summary
            </div>
            <div className="font-mono text-[11px] sm:text-xs text-white font-semibold break-words">
              React + Tailwind | Python + FastAPI | LangGraph + LangChain | Gemini/OpenAI | SQL + Pandas | APIs + Web Search | Docker
            </div>
          </div>

          {/* LangGraph Agentic Loop Callout */}
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Core Agentic Engine: LangGraph State Machine</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              LangGraph is the foundational framework powering ARGUS's autonomous loop: <strong className="text-white">Plan → Act → Observe → Adapt</strong>. It maintains persistent graph state across multi-step root-cause diagnostics, dynamic hypothesis scoring, and executive approval checkpoints.
            </p>
          </div>

          {/* Detailed Stack Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">🖥️ Frontend & UI</strong>
              <p className="text-slate-400 font-mono text-[10px]">React.js • Tailwind CSS • Recharts</p>
              <p className="text-slate-400">Dense, modern dark operational console with live DAG reasoning visualization.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">⚡ Backend & Agentic Engine</strong>
              <p className="text-slate-400 font-mono text-[10px]">Python • FastAPI • LangGraph • LangChain</p>
              <p className="text-slate-400">High-performance async server managing agent state graphs and tool orchestration.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">🧠 AI & Cognitive LLM</strong>
              <p className="text-slate-400 font-mono text-[10px]">Gemini API / OpenAI API</p>
              <p className="text-slate-400">Prompt-based reasoning + structured tool calling with schema validation.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">📊 Data & Analytics Tools</strong>
              <p className="text-slate-400 font-mono text-[10px]">PostgreSQL / MySQL • Pandas • Python Tools</p>
              <p className="text-slate-400">In-memory telemetry processing, Z-score anomaly calculations, and margin variance.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">🛠️ Invokable Agent Tools</strong>
              <p className="text-slate-400 font-mono text-[10px]">SQL queries • Python analysis • APIs • Web search • File/Docs</p>
              <p className="text-slate-400">LangChain-bound sandbox tools for autonomous investigation execution.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <strong className="text-white text-xs block">🚀 Deployment & Infrastructure</strong>
              <p className="text-slate-400 font-mono text-[10px]">Docker • Render / AWS</p>
              <p className="text-slate-400">Containerized microservices architecture with scalable cloud deployment.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlideData = slides[activeSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pitch Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white font-mono">ARGUS — Hackathon Pitch Mode</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/80 rounded-full font-bold">
                  60-Second Judge Tour
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous AI Operations & Business Intelligence Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 space-x-2 overflow-x-auto">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                activeSlide === idx
                  ? 'border-blue-500 text-blue-400 bg-slate-900 shadow-inner'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{idx + 1}. {s.badge}</span>
            </button>
          ))}
        </div>

        {/* Slide Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentSlideData.badgeColor}`}>
                {currentSlideData.badge}
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5">{currentSlideData.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentSlideData.subtitle}</p>
            </div>
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 items-center justify-center text-slate-300 shrink-0">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="pt-2">
            {currentSlideData.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-1.5 rounded-full transition-all ${
                  activeSlide === idx ? 'w-6 bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {activeSlide > 0 && (
              <button
                onClick={() => setActiveSlide(prev => prev - 1)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Previous
              </button>
            )}

            {activeSlide < slides.length - 1 ? (
              <button
                onClick={() => setActiveSlide(prev => prev + 1)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/30"
              >
                <span>Next Slide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/30"
              >
                <span>Explore Live Agent</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
