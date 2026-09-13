import React, { useState } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { PS6AutonomousRecoveryCenter } from './components/PS6AutonomousRecoveryCenter';
import { HackathonPitchModal } from './components/HackathonPitchModal';
import { AskArgusCopilot } from './components/AskArgusCopilot';
import { resetLogisticsSandboxApi } from './api';
import { Trophy, BrainCircuit } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('ps6_recovery');
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetLogisticsSandboxApi();
    } catch (err) {
      console.error("Failed to reset sandbox:", err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Clean, Minimalist Header */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeAnomaliesCount={1}
        onOpenExplain={() => {}}
        onOpenPitchModal={() => setIsPitchOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Focus: Problem Statement 6 Autonomous Recovery Agent */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        <PS6AutonomousRecoveryCenter />
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ARGUS • Autonomous Retail Supply Chain Recovery Agent (PS6)</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPitchOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>PS6 Rubric</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>
          </div>
        </div>
      </footer>

      {/* PS6 Briefing / Pitch Modal */}
      <HackathonPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onSelectScenario={() => {}}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* AI Copilot Drawer */}
      <AskArgusCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeAnomalyTitle="Supply Chain Port Bottleneck & Stockout Risk"
      />

    </div>
  );
}

export default App;
