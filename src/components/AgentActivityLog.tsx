import React from 'react';
import { 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Database,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AgentEvent } from '../types';

interface AgentActivityLogProps {
  events: AgentEvent[];
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({ events }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Autonomous Agent Activity Stream</h2>
            <p className="text-xs text-slate-400">Chronological telemetry of tool calls, diagnostic reasoning, and human approvals</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-emerald-400">Live Agent Stream Active</span>
        </div>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const isTool = event.type === 'TOOL_EXECUTION';
          const isApproval = event.type === 'ACTION_APPROVED';
          const isRejected = event.type === 'ACTION_REJECTED';

          return (
            <div 
              key={event.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isApproval
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isRejected
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {isApproval ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isTool ? (
                    <Database className="w-4 h-4" />
                  ) : (
                    <Cpu className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-white">{event.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isApproval 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : isRejected
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    {event.details}
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:text-right text-xs text-slate-500 font-mono flex items-center sm:block space-x-1 sm:space-x-0">
                <Clock className="w-3 h-3 inline mr-1 text-slate-600 sm:hidden" />
                <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
