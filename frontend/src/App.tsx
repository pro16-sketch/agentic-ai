import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BusinessOverview } from './components/BusinessOverview';
import { InvestigationConsole } from './components/InvestigationConsole';
import { DecisionCenter } from './components/DecisionCenter';
import { ApprovalOutcome } from './components/ApprovalOutcome';
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
  AgentEvent,
  Decision
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'investigation' | 'decision' | 'approval'>('overview');
  
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [activeInvestigationId, setActiveInvestigationId] = useState<number | null>(1);
  const [investigation, setInvestigation] = useState<InvestigationDetails | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial & Periodic Data Refresh
  const loadBusinessState = async () => {
    try {
      const data = await fetchBusinessState();
      setMetrics(data.metrics);
      if (data.active_investigation_id) {
        setActiveInvestigationId(data.active_investigation_id);
      }
    } catch (err: any) {
      console.error("Failed to load business state:", err);
      setError("Unable to connect to ARGUS Backend. Make sure FastAPI server is running on port 8000.");
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
    }, 8000);

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
      setActiveTab('investigation');
    } catch (err) {
      console.error("Error triggering investigation:", err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleSelectStrategy = (decision: Decision) => {
    setActiveTab('approval');
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
    try {
      await resetDemoData();
      await loadBusinessState();
      if (activeInvestigationId) {
        await loadInvestigation(1);
      }
      await loadAgentEvents();
      setActiveTab('overview');
    } catch (err) {
      console.error("Reset data error:", err);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAnomaliesCount={metrics?.active_anomalies || 0}
        onTriggerInvestigation={handleTriggerInvestigation}
        onResetData={handleResetData}
        isInvestigating={isInvestigating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadBusinessState} className="underline text-xs font-mono ml-4">Retry Connection</button>
          </div>
        )}

        {/* Section 1: Business Overview */}
        {activeTab === 'overview' && metrics && (
          <BusinessOverview
            metrics={metrics}
            onInvestigateAnomaly={handleTriggerInvestigation}
          />
        )}

        {/* Section 2: Investigation Console */}
        {activeTab === 'investigation' && (
          <InvestigationConsole
            investigation={investigation}
            events={events}
            onTriggerInvestigation={handleTriggerInvestigation}
            isInvestigating={isInvestigating}
          />
        )}

        {/* Section 3: Decision Center */}
        {activeTab === 'decision' && (
          <DecisionCenter
            investigation={investigation}
            onSelectStrategy={handleSelectStrategy}
          />
        )}

        {/* Section 4: Approval / Outcome */}
        {activeTab === 'approval' && (
          <ApprovalOutcome
            investigation={investigation}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        ARGUS Enterprise Business Intelligence Platform &copy; 2026. Connected to FastAPI Engine on Port 8000.
      </footer>

    </div>
  );
}

export default App;
