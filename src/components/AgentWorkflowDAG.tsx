import React, { useState } from 'react';
import { 
  Activity, 
  Brain, 
  Wrench, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { InvestigationDetails } from '../types';

interface AgentWorkflowDAGProps {
  investigation: InvestigationDetails | null;
  activeStep?: number;
}

export const AgentWorkflowDAG: React.FC<AgentWorkflowDAGProps> = ({ investigation, activeStep = 2 }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('hypotheses');

  const nodes = [
    {
      id: 'telemetry',
      stage: 'Stage 1: Perception',
      label: 'Telemetry Trigger',
      icon: Activity,
      status: 'Surveillance Alert',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
      headline: 'Statistical Anomaly Flagged (+4.8σ)',
      description: 'Z-score monitor detected a sudden 605% spike in return rates for Aura Sound Pro (14.8% vs. 2.1% baseline) immediately following the v2.4 OTA push.',
      keyFact: '1,240 active units monitored across Stripe & Shopify streams'
    },
    {
      id: 'hypotheses',
      stage: 'Stage 2: Deliberation',
      label: 'Root Cause Validation',
      icon: Brain,
      status: '92% Confidence',
      badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800',
      headline: 'Confirmed: Firmware BLE Buffer Memory Leak',
      description: 'The agent tested 3 competing hypotheses. It falsified hardware solder fractures and shipping impact, confirming that BLE stack buffer overflows crash devices after 10 minutes of pairing.',
      keyFact: '1,034 crash dumps confirmed BLE_STACK_OOM; 0 hardware defects found'
    },
    {
      id: 'tools',
      stage: 'Stage 3: Verification',
      label: 'Sandbox Diagnostics',
      icon: Wrench,
      status: 'Simulated',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
      headline: 'Validated Financial Bleed & Supply Lead Times',
      description: 'Executed sandboxed SQL queries and supply chain models. Calculated ongoing revenue erosion at -$38,400/month and identified air-freight reorder as the fastest stockout remedy (3.5 days).',
      keyFact: '3 diagnostic queries executed in 340ms total execution time'
    },
    {
      id: 'decisions',
      stage: 'Stage 4: Optimization',
      label: 'Strategy Ranking',
      icon: Scale,
      status: 'Ranked Best',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      headline: 'Selected Option A: Hotfix + Air Freight (5.5x ROI)',
      description: 'Synthesized and compared 3 courses of action. Option A (Balanced) minimizes capital outlay ($8,400) while recovering +$46,200 in revenue with an industry-standard 5.5x ROI.',
      keyFact: 'Scored 96/100 vs. Recall (18/100) and Discount Clearance (64/100)'
    },
    {
      id: 'authorization',
      stage: 'Stage 5: Governance',
      label: 'Executive Gate',
      icon: ShieldCheck,
      status: investigation?.status === 'resolved' ? 'Authorized' : 'Awaiting Sign-off',
      badgeColor: investigation?.status === 'resolved' 
        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' 
        : 'text-blue-400 bg-blue-950/60 border-blue-800',
      headline: investigation?.status === 'resolved' 
        ? 'Executive Approved: Deployed to Production' 
        : 'Human-in-the-Loop Safeguard Active',
      description: investigation?.status === 'resolved'
        ? 'Operations Director authorized Option A. OTA patch v2.4.1 deployed and air-freight PO dispatched.'
        : 'Expenditures over $5,000 require 1-click human executive authorization before dispatching firmware or supplier POs.',
      keyFact: 'Audit log immutable; zero autonomous irreversible actions taken without sign-off'
    }
  ];

  const currentNode = nodes.find(n => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Autonomous Reasoning Pipeline</span>
              <span className="text-[10px] font-normal text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                Click any step to inspect
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Clear end-to-end audit trail: from perception to executive authorization
            </p>
          </div>
        </div>
      </div>

      {/* 5 Clean Interactive Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const isSelected = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${node.badgeColor}`}>
                  {node.status}
                </span>
              </div>

              <div className="flex items-center space-x-2 my-1">
                <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white leading-tight">
                  {node.label}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                {node.headline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Clean Selected Step Details Callout */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-blue-400 font-semibold">{currentNode.stage}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-white">{currentNode.headline}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${currentNode.badgeColor}`}>
            {currentNode.status}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentNode.description}
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span><strong className="text-slate-200">Key Evidence:</strong> {currentNode.keyFact}</span>
        </div>
      </div>

    </div>
  );
};
