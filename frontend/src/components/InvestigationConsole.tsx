import React from 'react';
import { 
  Search, 
  Terminal, 
  Cpu, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Sparkles,
  Zap
} from 'lucide-react';
import { InvestigationDetails, AgentEvent } from '../types';

interface InvestigationConsoleProps {
  investigation: InvestigationDetails | null;
  events: AgentEvent[];
  onTriggerInvestigation: () => void;
  isInvestigating: boolean;
}

export const InvestigationConsole: React.FC<InvestigationConsoleProps> = ({
  investigation,
  events,
  onTriggerInvestigation,
  isInvestigating
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Console Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-white text-lg">ARGUS Autonomous Investigation Console</h2>
              <span className="bg-blue-950 text-blue-400 text-xs px-2.5 py-0.5 rounded-full border border-blue-800 font-mono">
                LangGraph State Machine
              </span>
            </div>
            <p className="text-xs text-slate-400">Live agent reasoning stream, hypothesis validation, and analytical tool execution</p>
          </div>
        </div>

        <button
          onClick={onTriggerInvestigation}
          disabled={isInvestigating}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isInvestigating ? 'animate-spin' : ''}`} />
          <span>{isInvestigating ? 'Executing Reasoning Loop...' : 'Re-Run Agent Investigation'}</span>
        </button>
      </div>

      {investigation ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Investigation Details & Hypotheses (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Investigation Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Investigation #{investigation.id}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{investigation.metric_name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-950 text-amber-300 text-xs font-mono px-3 py-1 rounded-lg border border-amber-800">
                    Anomaly Score: {investigation.anomaly_score}/10
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 text-xs font-mono px-3 py-1 rounded-lg border border-emerald-800 uppercase">
                    {investigation.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Executive Summary</h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  {investigation.summary}
                </p>
              </div>

              {/* Root Cause */}
              <div>
                <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Diagnosed Root Cause</h4>
                <div className="flex items-start space-x-2.5 bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-xl text-rose-200 text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{investigation.root_cause}</span>
                </div>
              </div>
            </div>

            {/* Hypotheses Evaluation Matrix */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Hypotheses Evaluation Matrix</h3>
                  <p className="text-xs text-slate-400">Agent reasoning candidates evaluated against empirical database evidence</p>
                </div>
                <span className="text-xs font-mono text-slate-400">{investigation.hypotheses.length} Hypotheses</span>
              </div>

              <div className="space-y-3">
                {investigation.hypotheses.map((hypothesis) => (
                  <div 
                    key={hypothesis.id}
                    className={`p-4 rounded-xl border transition-all ${
                      hypothesis.validation_status === 'confirmed'
                        ? 'bg-emerald-950/20 border-emerald-800/60'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {hypothesis.validation_status === 'confirmed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className="font-semibold text-sm text-white">{hypothesis.hypothesis_text}</span>
                        </div>
                        <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                          <strong className="text-slate-400">Evidence:</strong> {hypothesis.evidence}
                        </p>
                      </div>

                      {/* Confidence Score Bar */}
                      <div className="shrink-0 text-right space-y-1">
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {(hypothesis.confidence_score * 100).toFixed(0)}% Confidence
                        </span>
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              hypothesis.confidence_score > 0.7 ? 'bg-emerald-500' : 'bg-slate-600'
                            }`}
                            style={{ width: `${hypothesis.confidence_score * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Execution Trace */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Data Tool Execution Trace</h3>
                <p className="text-xs text-slate-400">Autonomous tool invocations executed by ARGUS</p>
              </div>

              <div className="space-y-3">
                {investigation.tool_calls.map((tool) => (
                  <div key={tool.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-blue-400 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-sm text-slate-100">{tool.tool_name}</span>
                      </div>
                      <span className="text-slate-400">{tool.execution_time_ms}ms</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider block mb-1">Inputs:</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800/60 text-slate-300 overflow-x-auto">
                          {JSON.stringify(tool.input_params, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider block mb-1">Output Result:</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800/60 text-emerald-300 overflow-x-auto">
                          {JSON.stringify(tool.output_result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Live Agent Reasoning Event Terminal (1 Col) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-[750px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Agent Event Stream</h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Event Stream Log list */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1 font-mono text-xs">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="text-blue-400 font-semibold">{event.type}</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200 font-semibold">{event.title}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{event.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Cpu className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Active Investigation Loaded</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Click 'Run Investigation' above to initiate the ARGUS agent reasoning loop across your database telemetry.
          </p>
        </div>
      )}

    </div>
  );
};
