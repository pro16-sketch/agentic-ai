import React, { useState, useEffect } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { GuidedIncidentFlow } from './components/GuidedIncidentFlow';
import { OperationsCenter } from './components/OperationsCenter';
import { AgentActivityLog } from './components/AgentActivityLog';
import { ExplainModal } from './components/ExplainModal';
import { 
  fetchBusinessState, 
  fetchInvestigationDetails, 
  triggerInvestigation, 
  fetchAgentEvents,
  approveAction,
  rejectAction,
  resetDemoData
} from './api';
import { 
  BusinessMetrics, 
  InvestigationDetails, 
  AgentEvent 
} from './types';
import { Sparkles, HelpCircle, AlertOctagon } from 'lucide-react';

export function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('guided');
  const [isExplainOpen, setIsExplainOpen] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [activeInvestigationId, setActiveInvestigationId] = useState<number | null>(1);
  const [investigation, setInvestigation] = useState<InvestigationDetails | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  
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

        {/* Friendly Guided Incident Intro Banner (Only in guided mode) */}
        {viewMode === 'guided' && (
          <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Interactive Walkthrough:</strong> Follow this 4-step pipeline to see how ARGUS detects an e-commerce crisis, runs autonomous diagnostics, and proposes a 1-click executive fix.
              </p>
            </div>
            <button
              onClick={() => setIsExplainOpen(true)}
              className="shrink-0 text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium underline"
            >
              <span>Explain in plain English →</span>
            </button>
          </div>
        )}

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
        ARGUS Autonomous Operations Engine &copy; 2026. Real-time Incident Detection & Decision Resolution.
      </footer>

      {/* Plain-English Explanation Modal */}
      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        onStartWalkthrough={() => setViewMode('guided')}
      />

    </div>
  );
}

export default App;
