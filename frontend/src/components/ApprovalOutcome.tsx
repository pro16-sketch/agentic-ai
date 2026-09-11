import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ArrowUpRight, 
  History, 
  TrendingUp, 
  DollarSign, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Decision, InvestigationDetails } from '../types';

interface ApprovalOutcomeProps {
  investigation: InvestigationDetails | null;
  onApprove: (decisionId: number) => Promise<void>;
  onReject: (decisionId: number, reason: string) => Promise<void>;
}

export const ApprovalOutcome: React.FC<ApprovalOutcomeProps> = ({
  investigation,
  onApprove,
  onReject
}) => {
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const decisions = investigation?.decisions || [];
  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const executedDecisions = decisions.filter(d => d.status === 'approved' || d.status === 'executed');

  const handleApproveClick = async (id: number) => {
    setIsSubmitting(true);
    try {
      await onApprove(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (id: number) => {
    setIsSubmitting(true);
    try {
      await onReject(id, rejectReason || 'Executive directive');
      setRejectingId(null);
      setRejectReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comparison Data for Outcome Charts
  const comparisonData = [
    { name: 'Baseline Loss', amount: 38400, type: 'loss' },
    { name: 'Strategy Cost', amount: 8400, type: 'cost' },
    { name: 'Recovered Profit', amount: 46200, type: 'gain' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">ARGUS Approval & Outcome Authorization Center</h2>
            <p className="text-xs text-slate-400">Review human-in-the-loop pending strategies, commit database state changes, and evaluate outcomes</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals (Left 2 Cols) + Executed Outcomes & Audit Trail (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Pending Authorization Queue */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Pending Executive Actions ({pendingDecisions.length})</h3>
              <span className="text-xs text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800 font-mono">
                Requires Authorization
              </span>
            </div>

            {pendingDecisions.length > 0 ? (
              <div className="space-y-4">
                {pendingDecisions.map((decision) => (
                  <div key={decision.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded uppercase">
                          {decision.strategy_type} Strategy
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{decision.title}</h4>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-emerald-400 font-bold text-lg">${decision.projected_revenue_impact.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Projected Recovery</div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                      {decision.description}
                    </p>

                    {rejectingId === decision.id ? (
                      <div className="bg-slate-950 p-3 rounded-lg border border-rose-800/60 space-y-3">
                        <label className="text-xs font-medium text-slate-300 block">Reason for Rejection:</label>
                        <input
                          type="text"
                          placeholder="e.g. Budget constraints, alternative vendor preferred..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setRejectingId(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRejectSubmit(decision.id)}
                            disabled={isSubmitting}
                            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          onClick={() => setRejectingId(decision.id)}
                          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Action</span>
                        </button>

                        <button
                          onClick={() => handleApproveClick(decision.id)}
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Execute Action</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/40 p-8 text-center text-slate-400 rounded-xl">
                No actions currently pending authorization.
              </div>
            )}
          </div>

          {/* Outcome Financial Impact Comparison Graph */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Projected vs Baseline Financial Outcome</h3>
              <p className="text-xs text-slate-400">Financial impact of executing ARGUS recommended strategy</p>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Side: Executed Decisions & Audit Log Trail */}
        <div className="space-y-6">
          
          {/* Executed Decisions List */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Executed Action Outcomes</h3>
            </div>

            {executedDecisions.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {executedDecisions.map((dec) => (
                  <div key={dec.id} className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span className="font-bold text-sm text-white">{dec.title}</span>
                      <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                        EXECUTED
                      </span>
                    </div>

                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      {dec.outcome?.summary || 'Action executed successfully. Database state updated.'}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-emerald-400 font-bold border-t border-emerald-950">
                      <span>Recovered Revenue:</span>
                      <span>${dec.projected_revenue_impact.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-6">
                No actions executed yet in this session.
              </div>
            )}
          </div>

          {/* Audit Trail */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <History className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Decision Audit Trail</h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>ACTION_APPROVED</span>
                  <span>Just now</span>
                </div>
                <div className="text-slate-200">Executive Decision Maker</div>
                <p className="text-slate-400 text-[11px]">Approved Option A Hotfix strategy.</p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>INVESTIGATION_COMPLETED</span>
                  <span>10 mins ago</span>
                </div>
                <div className="text-slate-200">ARGUS Agent Engine</div>
                <p className="text-slate-400 text-[11px]">Synthesized 3 strategic decision options.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
