import React from 'react';
import { 
  Zap, 
  HelpCircle, 
  RotateCcw, 
  Sparkles,
  Trophy,
  BrainCircuit
} from 'lucide-react';

export type AppViewMode = 'ps6_recovery' | 'guided' | 'operations' | 'logs';

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
  onOpenExplain,
  onOpenPitchModal,
  onOpenCopilot,
  onResetData,
  isResetting
}) => {
  return (
    <header className="bg-slate-950/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wider text-white font-mono">ARGUS</span>
                <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full uppercase font-mono">
                  PS6 Autonomous Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                Retail Supply Chain Recovery Agent
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2.5">
            
            {/* Hackathon Rubric / Pitch Briefing */}
            <button
              onClick={onOpenPitchModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">PS6 Rubric &amp; Briefing</span>
            </button>

            {/* Ask AI Copilot */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-800 text-xs font-mono font-semibold transition-all"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Reset Environment */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-50"
              title="Reset Sandbox"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
