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
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">1. Late Defect Isolation</span>
              <p className="text-[11px] text-slate-400">Firmware regressions spike return rates 7x, but executives only see it 30 days later in accounting reviews.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">2. Supplier Blind Spots</span>
              <p className="text-[11px] text-slate-400">Component lead times expand from 5 to 14 days with zero warning, triggering crippling stockouts.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <span className="text-xs font-bold text-white block">3. Decision Paralysis</span>
              <p className="text-[11px] text-slate-400">Teams debate for weeks between full recalls vs patch air-freight, losing market share every hour.</p>
            </div>
          </div>
          <div className="bg-slate-950/90 border border-rose-900/40 p-3 rounded-xl text-rose-200 text-xs">
            <strong>Traditional Dashboards are Tombstones:</strong> They show you where money died yesterday, but they cannot formulate hypotheses, run database diagnostics, or execute recovery.
          </div>
        </div>
      )
    },
    {
      title: "Enter ARGUS: The Autonomous AI Chief Operations Officer",
      subtitle: "The Closed-Loop Perception ➔ Reasoning ➔ Action ➔ Safety Architecture",
      icon: Cpu,
      badge: "The Solution",
      badgeColor: "bg-blue-950/80 text-blue-300 border-blue-800",
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p className="text-sm text-slate-200">
            ARGUS is not a passive dashboard. It is an <strong className="text-blue-400 font-bold">autonomous cognitive agent</strong> that operates on a 5-phase closed loop:
          </p>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-mono text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white text-xs">Real-Time Telemetry Sensing:</strong> Continual statistical monitoring of return rate z-scores, inventory burn velocity, and gross margin drift.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white text-xs">Hypothesis Generation:</strong> Forms concurrent causal hypotheses (e.g. firmware audio bug vs supplier port delay vs shipping damage) with dynamic confidence scoring.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white text-xs">Multi-Tool Sandbox Execution:</strong> Autonomously queries return log text clusters, executes margin variance calculus, and runs supply chain lead-time simulations.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="text-white text-xs">Financial Strategy Synthesis:</strong> Models 3 strategic options (Balanced, Conservative Recall, Aggressive Liquidation) with projected cost, revenue recovery, and ROI multipliers.
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0">5</span>
              <div>
                <strong className="text-white text-xs">Human-in-the-Loop Safe Execution:</strong> Executive authorization gate prevents rogue AI decisions. 1-click execution updates firmware, air-freights stock, and logs to immutable audit trail.
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
              className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-blue-400">Firmware BLE Memory Leak</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">14.8% Returns</span>
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
              className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-amber-400">Supplier Port Bottleneck</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">7.6d Stockout</span>
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
              className="text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-400">Viral TikTok Defect Surge</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">+340% Returns</span>
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
              className="text-left p-3 rounded-xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 hover:from-blue-900/60 hover:to-indigo-900/60 border border-blue-700/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-blue-300">Ask ARGUS (Gemini 3.8)</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded border border-blue-400/40">Live AI Copilot</span>
              </div>
              <p className="text-[11px] text-slate-300">Ask any free-form question about supply chains, margins, or strategies.</p>
              <div className="mt-2 text-[10px] text-blue-300 font-semibold flex items-center space-x-1">
                <span>Open Copilot →</span>
              </div>
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Why ARGUS Wins: Technical & Design Craft",
      subtitle: "Production-Grade Full-Stack Architecture Built to Scale",
      icon: Trophy,
      badge: "Hackathon Highlights",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
              <strong className="text-white text-xs block">✨ Real Gemini 3.8 Flash Integration</strong>
              <p className="text-[11px] text-slate-400">Server-side cognitive agent analyzing enterprise tables, computing risk parameters, and drafting executive communications.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
              <strong className="text-white text-xs block">🔊 Executive Audio SITREP</strong>
              <p className="text-[11px] text-slate-400">Integrated text-to-speech audio player allowing leadership to listen to live spoken operational briefings.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
              <strong className="text-white text-xs block">📊 Dynamic What-If Simulation Sandbox</strong>
              <p className="text-[11px] text-slate-400">Sliders for price changes, return recovery, expedite freight, and batch size with live sensitivity charts.</p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
              <strong className="text-white text-xs block">🛡️ Zero-Risk Human Authorization</strong>
              <p className="text-[11px] text-slate-400">Strict executive gate preventing hallucinations or unauthorized capital deployment, backed by full immutable audit logs.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlideData = slides[activeSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pitch Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white font-mono">ARGUS — Hackathon Pitch Mode</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                  60-Second Judge Tour
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous AI Operations & Business Intelligence Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-3 space-x-2 overflow-x-auto">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                activeSlide === idx
                  ? 'border-blue-500 text-white bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{idx + 1}. {s.badge}</span>
            </button>
          ))}
        </div>

        {/* Slide Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentSlideData.badgeColor}`}>
                {currentSlideData.badge}
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5">{currentSlideData.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentSlideData.subtitle}</p>
            </div>
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 items-center justify-center text-slate-300 shrink-0">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="pt-2">
            {currentSlideData.content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
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
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/25"
              >
                <span>Next Slide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/25"
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
