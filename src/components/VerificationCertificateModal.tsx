import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Award, 
  CheckCircle2, 
  Clock, 
  Leaf, 
  DollarSign, 
  Layers, 
  FileText,
  Calendar,
  Zap,
  TrendingUp
} from 'lucide-react';
import { VerificationReport } from '../types';

interface Props {
  report: VerificationReport | null;
  onClose: () => void;
}

export const VerificationCertificateModal: React.FC<Props> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden font-mono text-xs">
        {/* Background decorative watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-emerald-400">
          <ShieldCheck className="w-64 h-64" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Autonomous Supply Chain Protocol
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Supply Chain SLA Recovery Certificate
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate ID & Timestamp */}
        <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Certificate ID:</span>
            <strong className="text-emerald-400">{report.recoveryCertificateId}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Verified Timestamp:</span>
            <strong className="text-slate-300">{new Date(report.verifiedAt).toLocaleString()}</strong>
          </div>
        </div>

        {/* Pre vs Post Recovery Matrix */}
        <div className="space-y-2 my-4">
          <div className="text-slate-400 font-bold text-[11px] flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Closed-Loop Telemetry Delta (Pre vs Post Action)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Pre-Recovery (Deficit state) */}
            <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-1.5">
              <div className="text-rose-400 font-bold text-[11px] flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                PRE-RECOVERY (DEFICIT)
              </div>
              <div className="text-slate-300">
                Available Stock: <strong>{report.preRecovery.availableStock} Units</strong>
              </div>
              <div className="text-slate-300">
                Days of Supply: <strong className="text-rose-400">{report.preRecovery.daysOfSupply} Days</strong>
              </div>
              <div className="text-slate-300">
                Stockout Gap: <strong className="text-rose-400">-{report.preRecovery.stockoutGapDays} Days (Violated)</strong>
              </div>
            </div>

            {/* Post-Recovery (Restored state) */}
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5">
              <div className="text-emerald-400 font-bold text-[11px] flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                POST-RECOVERY (RESTORED)
              </div>
              <div className="text-slate-300">
                Inbound In-Transit: <strong>+{report.postRecovery.incomingUnits} Units</strong>
              </div>
              <div className="text-slate-300">
                New Arrival ETA: <strong>{report.postRecovery.newEtaDays} Days</strong>
              </div>
              <div className="text-slate-300">
                Effective Days of Supply: <strong className="text-emerald-400">{report.postRecovery.effectiveDaysOfSupply} Days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Environmental SLA Metrics */}
        <div className="grid grid-cols-3 gap-2 my-4 text-center">
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Total Recovery Cost</span>
            <span className="font-bold text-white text-sm">₹{report.totalCostUsd.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Carbon Incurred</span>
            <span className="font-bold text-emerald-400 text-sm flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 mr-1" /> {report.totalCarbonKg} kg CO2
            </span>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Constraint Satisfaction</span>
            <span className="font-bold text-emerald-400 text-sm">100% RESOLVED</span>
          </div>
        </div>

        {/* Audit Trail List */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Cryptographic Validation Steps:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1 text-[10px]">
            {report.auditTrail.map((at, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-950 rounded border border-slate-800/80">
                <span className="text-slate-300">[{at.step}] {at.detail}</span>
                <span className="text-emerald-400 font-bold">{at.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-800 text-[11px]">
          <div className="text-slate-400 flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
            Autonomous Supply Chain SLA Certified
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
          >
            Acknowledge Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
