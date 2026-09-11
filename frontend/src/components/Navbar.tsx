import React from 'react';
import { 
  BarChart3, 
  Search, 
  Sliders, 
  CheckCircle2, 
  Activity, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'investigation' | 'decision' | 'approval';
  setActiveTab: (tab: 'overview' | 'investigation' | 'decision' | 'approval') => void;
  activeAnomaliesCount: number;
  onTriggerInvestigation: () => void;
  onResetData: () => void;
  isInvestigating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeAnomaliesCount,
  onTriggerInvestigation,
  onResetData,
  isInvestigating
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider text-white font-mono">ARGUS</span>
                <span className="text-[10px] font-semibold bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  v1.0 Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Business Intelligence Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Business Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('investigation')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'investigation'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Investigation Console</span>
              {activeAnomaliesCount > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('decision')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'decision'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Decision Center</span>
            </button>

            <button
              onClick={() => setActiveTab('approval')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'approval'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approval / Outcome</span>
            </button>
          </nav>

          {/* Action Triggers & System Status */}
          <div className="flex items-center space-x-3">
            {activeAnomaliesCount > 0 && (
              <div className="hidden lg:flex items-center space-x-2 bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeAnomaliesCount} Anomaly Flagged</span>
              </div>
            )}

            <button
              onClick={onTriggerInvestigation}
              disabled={isInvestigating}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isInvestigating ? 'animate-spin' : ''}`} />
              <span>{isInvestigating ? 'Agent Running...' : 'Run Investigation'}</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
