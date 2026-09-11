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
  ShieldCheck
} from 'lucide-react';

export type AppViewMode = 'guided' | 'operations' | 'logs';

interface NavbarProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  activeAnomaliesCount: number;
  onOpenExplain: () => void;
  onResetData: () => Promise<void>;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  activeAnomaliesCount,
  onOpenExplain,
  onResetData,
  isResetting
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/10">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">ARGUS</span>
                <span className="text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full uppercase">
                  Operations Copilot
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous AI Incident Resolution & Decision Engine
              </p>
            </div>
          </div>

          {/* Simplified View Switcher */}
          <nav className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('guided')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'logs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Agent Log</span>
            </button>
          </nav>

          {/* Right Controls: How this works + Reset Demo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenExplain}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors"
              title="Learn how ARGUS works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-medium">How it works</span>
            </button>

            <button
              onClick={onResetData}
              disabled={isResetting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-colors disabled:opacity-50"
              title="Reset scenario data to initial state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
