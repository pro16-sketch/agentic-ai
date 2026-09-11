import React from 'react';
import { 
  Zap, 
  HelpCircle, 
  RotateCcw, 
  Layers, 
  BarChart3, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Trophy,
  BrainCircuit
} from 'lucide-react';

export type AppViewMode = 'guided' | 'operations' | 'logs';

interface NavbarProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  activeAnomaliesCount: number;
  onOpenExplain: () => void;
  onOpenPitchModal: () => void;
  onOpenCopilot: () => void;
  onResetData: () => Promise<void>;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  activeAnomaliesCount,
  onOpenExplain,
  onOpenPitchModal,
  onOpenCopilot,
  onResetData,
  isResetting
}) => {
  return (
    <header className="bg-slate-950/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">ARGUS</span>
                <span className="text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full uppercase">
                  Autonomous Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                AI Incident Resolution & Executive Decision Engine
              </p>
            </div>
          </div>

          {/* View Switcher */}
          <nav className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('guided')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'guided'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Incident Flow</span>
              {activeAnomaliesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              )}
            </button>

            <button
              onClick={() => setViewMode('operations')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'operations'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operations Center</span>
            </button>

            <button
              onClick={() => setViewMode('logs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'logs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Agent Log</span>
            </button>
          </nav>

          {/* Right Controls: Pitch Mode + AI Copilot + Reset Demo */}
          <div className="flex items-center space-x-2">
            
            {/* 🏆 Hackathon Pitch Mode Button */}
            <button
              onClick={onOpenPitchModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
              title="Open 60-Second Hackathon Judge Pitch & Storyboard"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Hackathon Pitch</span>
            </button>

            {/* Ask ARGUS AI Copilot Button */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/70 text-blue-300 border border-blue-800 text-xs font-semibold transition-all"
              title="Open Live Gemini 3.8 AI Executive Copilot"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Ask Copilot</span>
            </button>

            {/* How it Works Modal */}
            <button
              onClick={onOpenExplain}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors"
              title="Learn how ARGUS works"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </button>

            {/* Reset Demo */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors disabled:opacity-50"
              title="Reset scenario data to initial state"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
