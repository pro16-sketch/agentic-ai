import React, { useState, useEffect } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { GuidedIncidentFlow } from './components/GuidedIncidentFlow';
import { OperationsCenter } from './components/OperationsCenter';
import { AgentActivityLog } from './components/AgentActivityLog';
import { ExplainModal } from './components/ExplainModal';
import { HackathonPitchModal } from './components/HackathonPitchModal';
import { AskArgusCopilot } from './components/AskArgusCopilot';
import { ScenarioSelectorBar } from './components/ScenarioSelectorBar';
import { 
  fetchBusinessState, 
  fetchInvestigationDetails, 
  triggerInvestigation, 
  fetchAgentEvents,
  approveAction,
  rejectAction,
  resetDemoData,
  injectScenarioApi
} from './api';
import { 
  BusinessMetrics, 
  InvestigationDetails, 
  AgentEvent 
} from './types';
import { Sparkles, HelpCircle, AlertOctagon, Trophy, BrainCircuit } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('guided');
  const [isExplainOpen, setIsExplainOpen] = useState<boolean>(false);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [activeInvestigationId, setActiveInvestigationId] = useState<number | null>(1);
  const [investigation, setInvestigation] = useState<InvestigationDetails | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [currentScenarioName, setCurrentScenarioName] = useState<string>("Firmware BLE Memory Leak");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load business state
  const loadBusinessState = async () => {
    try {
      const data = await fetchBusinessState();
      setMetrics(data.metrics);
      if (data.active_investigation_id) {
        setActiveInvestigationId(data.active_investigation_id);
      }
    } catch (err: any) {
      console.error("Failed to load business state:", err);
      setError("Unable to connect to ARGUS Backend API.");
    } finally {
      setLoading(false);
    }
  };

  const loadInvestigation = async (id: number) => {
    try {
      const details = await fetchInvestigationDetails(id);
      setInvestigation(details);
    } catch (err) {
      console.error("Failed to fetch investigation details:", err);
    }
  };

  const loadAgentEvents = async () => {
    try {
      const res = await fetchAgentEvents();
      setEvents(res.events);
    } catch (err) {
      console.error("Failed to load agent events:", err);
    }
  };

  useEffect(() => {
    loadBusinessState();
    loadAgentEvents();

    const interval = setInterval(() => {
      loadBusinessState();
      loadAgentEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeInvestigationId) {
      loadInvestigation(activeInvestigationId);
    }
  }, [activeInvestigationId]);

  // Action Handlers
  const handleTriggerInvestigation = async () => {
    setIsInvestigating(true);
    try {
      const res = await triggerInvestigation("Audit Return Rate Spike & Supply Chain Lead Times");
      setActiveInvestigationId(res.investigation_id);
      await loadInvestigation(res.investigation_id);
      await loadBusinessState();
      await loadAgentEvents();
      setViewMode('guided');
    } catch (err) {
      console.error("Error triggering investigation:", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleSelectScenario = async (scenarioKey: string, customPrompt?: string) => {
    setIsInvestigating(true);
    try {
      const res = await injectScenarioApi(scenarioKey, customPrompt);
      setActiveInvestigationId(res.investigation_id);
      await loadInvestigation(res.investigation_id);
      await loadBusinessState();
      await loadAgentEvents();
      
      const scenarioMap: Record<string, string> = {
        'firmware_leak': 'Firmware BLE Memory Leak',
        'supplier_bottleneck': 'Global Microelectronics Port Bottleneck',
        'viral_defect': 'Vortex Keyboard Viral Switch Chatter',
        'custom': customPrompt ? `Custom: ${customPrompt.slice(0, 30)}...` : 'Custom Operational Incident'
      };
      setCurrentScenarioName(scenarioMap[scenarioKey] || 'Active Operational Incident');
      setViewMode('guided');
    } catch (err) {
      console.error("Scenario injection error:", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleApproveAction = async (decisionId: number) => {
    try {
      await approveAction(decisionId);
      await loadBusinessState();
      if (activeInvestigationId) {
        await loadInvestigation(activeInvestigationId);
      }
      await loadAgentEvents();
    } catch (err) {
      console.error("Approve action error:", err);
    }
  };

  const handleRejectAction = async (decisionId: number, reason: string) => {
    try {
      await rejectAction(decisionId, reason);
      await loadBusinessState();
      if (activeInvestigationId) {
        await loadInvestigation(activeInvestigationId);
      }
      await loadAgentEvents();
    } catch (err) {
      console.error("Reject action error:", err);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetDemoData();
      await loadBusinessState();
      await loadInvestigation(1);
      setActiveInvestigationId(1);
      setCurrentScenarioName("Firmware BLE Memory Leak");
      await loadAgentEvents();
      setViewMode('guided');
    } catch (err) {
      console.error("Reset data error:", err);
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 animate-spin">
          <div className="w-full h-full bg-slate-950 rounded-[10px]" />
        </div>
        <div className="text-slate-300 font-mono text-sm">Connecting to ARGUS Intelligence Engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeAnomaliesCount={metrics?.active_anomalies || 0}
        onOpenExplain={() => setIsExplainOpen(true)}
        onOpenPitchModal={() => setIsPitchOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-2xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadBusinessState} className="underline text-xs font-mono ml-4">Retry Connection</button>
          </div>
        )}

        {/* Live Scenario Selector / Disaster Injector (Available across views) */}
        <ScenarioSelectorBar
          onSelectScenario={handleSelectScenario}
          isLoading={isInvestigating}
          activeScenarioName={currentScenarioName}
        />

        {/* View 1: Guided Incident Flow (Default) */}
        {viewMode === 'guided' && metrics && (
          <GuidedIncidentFlow
            metrics={metrics}
            investigation={investigation}
            isInvestigating={isInvestigating}
            onTriggerInvestigation={handleTriggerInvestigation}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
            onResetData={handleResetData}
            onNavigateToOperations={() => setViewMode('operations')}
          />
        )}

        {/* View 2: Operations Center Dashboard */}
        {viewMode === 'operations' && metrics && (
          <OperationsCenter
            metrics={metrics}
            onGoToIncident={() => setViewMode('guided')}
          />
        )}

        {/* View 3: Agent Live Telemetry Log */}
        {viewMode === 'logs' && (
          <AgentActivityLog events={events} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ARGUS Autonomous Operations Engine &copy; 2026. Real-time Incident Detection & Decision Resolution.</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPitchOpen(true)}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Judge Pitch Mode</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Plain-English Explanation Modal */}
      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        onStartWalkthrough={() => setViewMode('guided')}
      />

      {/* 🏆 Hackathon Pitch Modal */}
      <HackathonPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onSelectScenario={handleSelectScenario}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* 🤖 Gemini 3.8 Flash AI Copilot Drawer */}
      <AskArgusCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeAnomalyTitle={investigation?.metric_name}
      />

    </div>
  );
}

export default App;
