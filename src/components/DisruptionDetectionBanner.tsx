import React from 'react';
import { 
  AlertOctagon, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  ShieldAlert, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { DisruptionIncident } from '../types';

interface Props {
  incident: DisruptionIncident | undefined;
  onRunAutonomousRecovery: () => void;
  onTriggerReplanDemo: () => void;
  isLoading: boolean;
  status: string;
}

export const DisruptionDetectionBanner: React.FC<Props> = ({
  incident,
  onRunAutonomousRecovery,
  onTriggerReplanDemo,
  isLoading,
  status
}) => {
  if (!incident) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-mono text-slate-300">
            Autonomous Monitoring Active: All supply chain nodes operating within nominal constraints.
          </span>
        </div>
      </div>
    );
  }

  const isResolved = incident.status === 'RESOLVED';
  const isReplanning = incident.status === 'FAILED_REPLANNING';

  return (
    <div className={`border rounded-2xl p-5 shadow-2xl transition-all ${
      isResolved 
        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-950/20' 
        : isReplanning
        ? 'bg-amber-950/30 border-amber-500/60 shadow-amber-950/30 animate-pulse'
        : 'bg-rose-950/25 border-rose-500/50 shadow-rose-950/30'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Disruption Header & Mathematical Breakdown */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              isResolved 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : isReplanning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
            }`}>
              {isResolved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> RECOVERY RESOLVED & VERIFIED
                </>
              ) : isReplanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> SECONDARY DISRUPTION: RE-PLANNING IN PROGRESS
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3.5 h-3.5 mr-1 animate-pulse" /> DISRUPTION & CONSTRAINT VIOLATION DETECTED
                </>
              )}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Incident ID: <strong className="text-white">{incident.id}</strong>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
              SKU: {incident.sku}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-rose-950 text-rose-300 rounded border border-rose-800">
              Severity: {incident.severity}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white font-mono leading-tight">
            {incident.title}
          </h2>

          <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
            {incident.description}
          </p>

          {/* Mathematical Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">On-Hand Stock</span>
              <span className="text-sm font-bold text-white">{incident.currentStock} Units</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Daily Burn Rate</span>
              <span className="text-sm font-bold text-amber-400">{incident.dailyBurnRate} units/day</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Days of Supply</span>
              <span className={`text-sm font-bold ${isResolved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {incident.daysOfSupply} Days
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Supplier Lead Time</span>
              <span className="text-sm font-bold text-slate-300">{incident.leadTimeDays} Days</span>
            </div>
          </div>

          {/* Constraint Violations Checklist */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-slate-400 font-semibold mb-1">
              Active Constraint Violations Identified by Agent:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {incident.constraintViolations.map((cv, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-xs text-rose-300 font-mono bg-rose-950/30 px-2.5 py-1 rounded-md border border-rose-900/40">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span className="truncate">{cv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Trigger Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
          <button
            onClick={onRunAutonomousRecovery}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running LangGraph Recovery...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run Autonomous Recovery Agent</span>
              </>
            )}
          </button>

          <button
            onClick={onTriggerReplanDemo}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Run Failure → Re-Plan Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
