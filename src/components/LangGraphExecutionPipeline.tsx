import React from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  RotateCcw, 
  ArrowRight, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

interface WorkflowLog {
  id: string;
  node: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'REPLANNING';
  details: string;
  timestamp: string;
  payload?: any;
}

interface Props {
  logs: WorkflowLog[];
  currentStepIndex?: number;
  isExecuting?: boolean;
}

export const LangGraphExecutionPipeline: React.FC<Props> = ({
  logs,
  currentStepIndex = 5,
  isExecuting = false
}) => {
  const nodes = [
    {
      id: "monitor_telemetry_node",
      label: "1. Monitor Telemetry",
      subtitle: "Inventory, Shipments & Vendor feeds",
      icon: Layers
    },
    {
      id: "detect_disruptions_node",
      label: "2. Detect Disruption",
      subtitle: "Constraint & SLA Violation check",
      icon: AlertTriangle
    },
    {
      id: "investigate_alternatives_node",
      label: "3. Investigate Sandbox",
      subtitle: "Multi-modal candidate retrieval",
      icon: GitFork
    },
    {
      id: "optimize_pareto_node",
      label: "4. Multi-Objective Optimize",
      subtitle: "Cost vs Delivery vs Carbon",
      icon: Zap
    },
    {
      id: "execute_recovery_node",
      label: "5. Execute Action",
      subtitle: "State mutation (Purchase/Transfer)",
      icon: ArrowRight
    },
    {
      id: "verify_outcome_node",
      label: "6. Verify Outcome",
      subtitle: "SLA check & Certificate issue",
      icon: ShieldCheck
    },
    {
      id: "replan_recovery_node",
      label: "7. Autonomous Re-plan",
      subtitle: "Fallback loop on secondary failure",
      icon: RotateCcw
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base font-mono">
              LangGraph StateGraph Execution Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stateful autonomous recovery graph orchestrated with <strong>@langchain/langgraph</strong>.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 bg-blue-950 text-blue-300 rounded-lg border border-blue-800 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse" />
            Graph State: ACTIVE
          </span>
        </div>
      </div>

      {/* Visual Interactive DAG Node Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {nodes.map((n, idx) => {
          const matchingLogs = logs.filter(l => l.node === n.id);
          const hasFailed = matchingLogs.some(l => l.status === 'FAILED');
          const hasReplanned = matchingLogs.some(l => l.status === 'REPLANNING');
          const isCompleted = matchingLogs.some(l => l.status === 'COMPLETED');
          const isCurrent = isExecuting && idx === currentStepIndex;

          const Icon = n.icon;

          return (
            <div 
              key={n.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                hasFailed 
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-md shadow-rose-950/30' 
                  : hasReplanned
                  ? 'bg-amber-950/30 border-amber-500/60 animate-pulse'
                  : isCompleted 
                  ? 'bg-blue-950/20 border-blue-500/40' 
                  : isCurrent
                  ? 'bg-slate-800 border-blue-400 shadow-md animate-pulse'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${
                    hasFailed 
                      ? 'bg-rose-900/60 text-rose-300' 
                      : hasReplanned
                      ? 'bg-amber-900/60 text-amber-300'
                      : isCompleted
                      ? 'bg-blue-900/60 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    {hasFailed ? (
                      <span className="text-[9px] font-mono font-bold text-rose-400">FAIL</span>
                    ) : hasReplanned ? (
                      <span className="text-[9px] font-mono font-bold text-amber-400">REPLAN</span>
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] font-mono text-slate-500">IDLE</span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-white font-mono leading-tight">{n.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{n.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Live Telemetry Step Logs */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 font-bold">StateGraph Runtime Trace</span>
          </div>
          <span className="text-[10px] text-slate-500">{logs.length} events logged</span>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-2.5 rounded-lg border text-[11px] leading-relaxed flex items-start space-x-2 ${
                log.status === 'FAILED'
                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  : log.status === 'REPLANNING'
                  ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {log.status === 'FAILED' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                ) : log.status === 'REPLANNING' ? (
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-blue-400">[{log.node}]</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div>{log.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
