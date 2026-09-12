import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  DollarSign, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Zap,
  Package,
  ChevronRight,
  Clock,
  XCircle,
  RefreshCw,
  Lock,
  Unlock,
  Terminal,
  BarChart2,
  FileText,
  Eye,
  Check,
  Layers,
  SlidersHorizontal,
  Info,
  Target,
  Calendar,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar,
  Cell,
  ReferenceLine,
  ReferenceArea,
  Legend
} from 'recharts';
import { InvestigationDetails, BusinessMetrics } from '../types';
import { AudioSitrepPlayer } from './AudioSitrepPlayer';
import { AgentWorkflowDAG } from './AgentWorkflowDAG';

interface GuidedIncidentFlowProps {
  metrics: BusinessMetrics;
  investigation: InvestigationDetails | null;
  isInvestigating: boolean;
  onTriggerInvestigation: () => void;
  onApprove: (decisionId: number) => Promise<void>;
  onReject: (decisionId: number, reason: string) => Promise<void>;
  onResetData: () => Promise<void>;
  onNavigateToOperations?: () => void;
}

export const GuidedIncidentFlow: React.FC<GuidedIncidentFlowProps> = ({
  metrics,
  investigation,
  isInvestigating,
  onTriggerInvestigation,
  onApprove,
  onReject,
  onResetData,
  onNavigateToOperations
}) => {
  const isResolved = investigation?.status === 'resolved' || metrics.active_anomalies === 0;

  // Strict consecutive journey tracking:
  // Step 1: Crisis Review & Acknowledgment
  // Step 2: Root Cause Diagnostics
  // Step 3: Strategy Synthesis & Selection
  // Step 4: Executive 1-Click Execution & Resolution
  const [currentStep, setCurrentStep] = useState<number>(isResolved ? 4 : 1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(isResolved ? 4 : 1);
  const [selectedDecisionId, setSelectedDecisionId] = useState<number | null>(isResolved ? 1 : null);
  const [strategySelectionError, setStrategySelectionError] = useState<boolean>(false);
  
  // Interactive Step 1 filter
  const [feedbackCategory, setFeedbackCategory] = useState<'all' | 'bluetooth' | 'battery'>('all');

  // Interactive Step 2 hypothesis inspection modal/card
  const [activeHypothesisId, setActiveHypothesisId] = useState<number>(1);
  const [hasRunAuditFor, setHasRunAuditFor] = useState<Record<number, boolean>>({ 1: true });
  const [isAuditingHypothesis, setIsAuditingHypothesis] = useState<boolean>(false);

  // Interactive Step 4 execution animation
  const [executingPhase, setExecutingPhase] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resolutionViewMode, setResolutionViewMode] = useState<'comparison' | 'trajectory'>('comparison');

  // Rejection handling
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [showWorkflowDAG, setShowWorkflowDAG] = useState<boolean>(false);

  // Streamlined visualization state
  const [selectedSpikeDayIndex, setSelectedSpikeDayIndex] = useState<number>(6);


  const decisions = investigation?.decisions || [];
  const approvedDecision = decisions.find(d => d.status === 'approved');
  const selectedDecision = decisions.find(d => d.id === selectedDecisionId) || approvedDecision || decisions[0] || null;
  const resolvedDecision = approvedDecision || selectedDecision || decisions[0] || null;

  useEffect(() => {
    if (isResolved) {
      setMaxUnlockedStep(4);
      if (approvedDecision && selectedDecisionId !== approvedDecision.id) {
        setSelectedDecisionId(approvedDecision.id);
      } else if (selectedDecisionId === null && decisions.length > 0) {
        setSelectedDecisionId(decisions[0].id);
      }
    }
  }, [isResolved, approvedDecision, decisions]);

  const activeImpact = resolvedDecision ? resolvedDecision.projected_revenue_impact : 46200;
  const activeCost = resolvedDecision ? resolvedDecision.estimated_cost : 8400;
  const activeNet = activeImpact - activeCost;

  const steps = [
    { id: 1, label: "1. Crisis Detection", desc: "Acknowledge 14.8% spike" },
    { id: 2, label: "2. Autonomous Diagnosis", desc: "Audit hypotheses & logs" },
    { id: 3, label: "3. Strategy Modeling", desc: "Select best ROI plan" },
    { id: 4, label: "4. Authorize & Execute", desc: isResolved ? `Resolved • Net ${activeNet >= 0 ? '+' : ''}$${activeNet.toLocaleString()}` : "1-Click Executive Fix" }
  ];

  const handleStepClick = (stepId: number) => {
    if (stepId <= maxUnlockedStep || isResolved) {
      setCurrentStep(stepId);
      setLockNotice(null);
    } else {
      setLockNotice(`🔒 Step ${stepId} is locked. Please complete and acknowledge Step ${stepId - 1} first.`);
      setTimeout(() => setLockNotice(null), 4000);
    }
  };

  // Step 1: Acknowledge & Trigger Investigation
  const handleAcknowledgeStep1 = async () => {
    onTriggerInvestigation();
    setMaxUnlockedStep(prev => Math.max(prev, 2));
    setCurrentStep(2);
  };

  // Step 2: Test / Inspect Hypothesis
  const handleTestHypothesis = (id: number) => {
    setActiveHypothesisId(id);
    setIsAuditingHypothesis(true);
    setTimeout(() => {
      setHasRunAuditFor(prev => ({ ...prev, [id]: true }));
      setIsAuditingHypothesis(false);
    }, 600);
  };

  // Step 2: Confirm Root Cause & Proceed to Step 3
  const handleConfirmStep2 = () => {
    setMaxUnlockedStep(prev => Math.max(prev, 3));
    setCurrentStep(3);
  };

  // Step 3: Commit Strategy & Proceed to Step 4 (Mandatory Selection)
  const handleCommitStep3 = () => {
    if (!selectedDecisionId) {
      setStrategySelectionError(true);
      return;
    }
    setStrategySelectionError(false);
    setMaxUnlockedStep(prev => Math.max(prev, 4));
    setCurrentStep(4);
  };

  const handleSelectDecision = (id: number) => {
    setSelectedDecisionId(id);
    setStrategySelectionError(false);
  };

  // Step 4: Authorize & Execute with realistic staged animation
  const handleApprove = async () => {
    if (!selectedDecision) return;
    setIsSubmitting(true);
    setExecutingPhase(1); // Phase 1: Deploy OTA hotfix

    setTimeout(() => {
      setExecutingPhase(2); // Phase 2: Customer refund & credit
      setTimeout(() => {
        setExecutingPhase(3); // Phase 3: Air-freight PO
        setTimeout(async () => {
          try {
            await onApprove(selectedDecision.id);
            setMaxUnlockedStep(4);
            setCurrentStep(4);
          } finally {
            setExecutingPhase(0);
            setIsSubmitting(false);
          }
        }, 900);
      }, 900);
    }, 900);
  };

  const handleReject = async () => {
    if (!selectedDecision) return;
    setIsSubmitting(true);
    try {
      await onReject(selectedDecision.id, rejectReason || "Executive preference");
      setIsRejecting(false);
      setRejectReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- INTERACTIVE MULTI-HORIZON DATASETS (Step 1) ---
  interface SpikeTelemetryPoint {
    day: string;
    rate: number;
    baseline: number;
    orders: number;
    returns: number;
    event: string;
    zScore: string;
    isRollout?: boolean;
    rmaType?: string;
  }

  const spikeTelemetryData = [
    { day: "Sep 05", rate: 2.1, baseline: 2.1, event: "Nominal operations", zScore: "+0.1σ" },
    { day: "Sep 06", rate: 2.0, baseline: 2.1, event: "Normal baseline audio testing", zScore: "-0.1σ" },
    { day: "Sep 07", rate: 2.2, baseline: 2.1, event: "Pre-deployment staging", zScore: "+0.2σ" },
    { day: "Sep 08", rate: 5.4, baseline: 2.1, event: "Firmware v2.4 pushed OTA to 1,240 active units", isRollout: true, zScore: "+1.8σ" },
    { day: "Sep 09", rate: 10.9, baseline: 2.1, event: "First Bluetooth disconnects reported", zScore: "+3.4σ" },
    { day: "Sep 10", rate: 13.6, baseline: 2.1, event: "RMA requests surged +320%", zScore: "+4.2σ" },
    { day: "Sep 11 (Today)", rate: 14.8, baseline: 2.1, event: "Critical crisis peak: Autonomous alert triggered", zScore: "+4.8σ" },
  ];

  const currentSpikePoint = spikeTelemetryData[selectedSpikeDayIndex] || spikeTelemetryData[spikeTelemetryData.length - 1];

  // Dynamic strategy comparison dataset built from active investigation decisions
  const strategyComparisonData = decisions.length > 0
    ? decisions.map((d, index) => {
        const assessment = getStrategyAssessment(d.id, d.strategy_type);
        const letter = String.fromCharCode(65 + index);
        const net = d.projected_revenue_impact - d.estimated_cost;
        return {
          id: d.id,
          name: `Option ${letter} (${assessment.ratingLabel.replace(/[^A-Za-z\s-]/g, '').trim()})`,
          label: d.title,
          cost: d.estimated_cost,
          recovered: d.projected_revenue_impact,
          net: net,
          roi: d.projected_roi
        };
      })
    : [
        { id: 1, name: "Option A (BEST STRATEGY)", label: "Hotfix + Air Freight", cost: 8400, recovered: 46200, net: 37800, roi: 5.5 },
        { id: 3, name: "Option C (SUB-OPTIMAL)", label: "Clearance Discount", cost: 15200, recovered: 54000, net: 38800, roi: 3.5 },
        { id: 2, name: "Option B (WORST STRATEGY)", label: "Physical Hardware Recall", cost: 24500, recovered: 18000, net: -6500, roi: 0.73 },
      ];

  // Dynamic trajectory rebound dataset based on the active or selected decision
  const activeDecisionForTrajectory = resolvedDecision || decisions[0];
  const trajectoryComparisonData = useMemo(() => {
    if (!activeDecisionForTrajectory) {
      return [
        { date: "Day 01", withArgus: 1755, withoutArgus: 1755 },
        { date: "Day 04", withArgus: 1825, withoutArgus: 1825 },
        { date: "Day 07", withArgus: 1736, withoutArgus: 1736 },
        { date: "Day 09 (Crisis)", withArgus: 1423, withoutArgus: 1423 },
        { date: "Day 10 (Crisis)", withArgus: 1353, withoutArgus: 1100 },
        { date: "Day 11 (Audit)", withArgus: 770, withoutArgus: 820 },
        { date: "Day 12 (Fix v2.4.1)", withArgus: 1650, withoutArgus: 590 },
        { date: "Day 14 (Air Freight)", withArgus: 1980, withoutArgus: 480 },
        { date: "Day 16 (Stabilized)", withArgus: 2150, withoutArgus: 420 },
        { date: "Day 18 (Restored)", withArgus: 2240, withoutArgus: 380 },
      ];
    }
    const isConservative = activeDecisionForTrajectory.strategy_type === 'Conservative';
    const isAggressive = activeDecisionForTrajectory.strategy_type === 'Aggressive';

    if (isConservative) {
      return [
        { date: "Day 01", withArgus: 1755, withoutArgus: 1755 },
        { date: "Day 04", withArgus: 1825, withoutArgus: 1825 },
        { date: "Day 07", withArgus: 1736, withoutArgus: 1736 },
        { date: "Day 09 (Crisis)", withArgus: 1423, withoutArgus: 1423 },
        { date: "Day 10 (Crisis)", withArgus: 1353, withoutArgus: 1100 },
        { date: "Day 11 (Audit)", withArgus: 770, withoutArgus: 820 },
        { date: "Day 12 (Recall Ordered)", withArgus: 650, withoutArgus: 590 },
        { date: "Day 14 (Channel Frozen)", withArgus: 610, withoutArgus: 480 },
        { date: "Day 16 (Sales Halted)", withArgus: 580, withoutArgus: 420 },
        { date: "Day 18 (Recall Processed)", withArgus: 620, withoutArgus: 380 },
      ];
    } else if (isAggressive) {
      return [
        { date: "Day 01", withArgus: 1755, withoutArgus: 1755 },
        { date: "Day 04", withArgus: 1825, withoutArgus: 1825 },
        { date: "Day 07", withArgus: 1736, withoutArgus: 1736 },
        { date: "Day 09 (Crisis)", withArgus: 1423, withoutArgus: 1423 },
        { date: "Day 10 (Crisis)", withArgus: 1353, withoutArgus: 1100 },
        { date: "Day 11 (Audit)", withArgus: 770, withoutArgus: 820 },
        { date: "Day 12 (25% Discount)", withArgus: 1480, withoutArgus: 590 },
        { date: "Day 14 (Volume Surge)", withArgus: 1720, withoutArgus: 480 },
        { date: "Day 16 (Bulk Ocean)", withArgus: 1840, withoutArgus: 420 },
        { date: "Day 18 (Restored $1.89k/d)", withArgus: 1890, withoutArgus: 380 },
      ];
    } else {
      return [
        { date: "Day 01", withArgus: 1755, withoutArgus: 1755 },
        { date: "Day 04", withArgus: 1825, withoutArgus: 1825 },
        { date: "Day 07", withArgus: 1736, withoutArgus: 1736 },
        { date: "Day 09 (Crisis)", withArgus: 1423, withoutArgus: 1423 },
        { date: "Day 10 (Crisis)", withArgus: 1353, withoutArgus: 1100 },
        { date: "Day 11 (Audit)", withArgus: 770, withoutArgus: 820 },
        { date: "Day 12 (Fix v2.4.1)", withArgus: 1650, withoutArgus: 590 },
        { date: "Day 14 (Air Freight)", withArgus: 1980, withoutArgus: 480 },
        { date: "Day 16 (Stabilized)", withArgus: 2150, withoutArgus: 420 },
        { date: "Day 18 (Restored $2.24k/d)", withArgus: 2240, withoutArgus: 380 },
      ];
    }
  }, [activeDecisionForTrajectory]);

  // AI Strategic Assessment Matrix: Evaluates BEST, WORST, and SUB-OPTIMAL
  const getStrategyAssessment = (decisionId: number, strategyType: string) => {
    if (strategyType === 'Balanced' || decisionId === 1) {
      return {
        rank: 1,
        ratingLabel: "🏆 BEST STRATEGY",
        ratingType: 'BEST' as const,
        badgeStyle: "bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-emerald-500/10",
        selectedRing: "border-emerald-500 ring-2 ring-emerald-500 bg-emerald-950/20 shadow-emerald-500/10",
        score: "96 / 100",
        aiTag: "Optimal Trade-off • AI Rank #1",
        headline: "Surgical Root-Cause Hotfix + Strategic Air Freight",
        whyThisRating: "RATED BEST because it directly targets the BLE memory leak with zero hardware scrap. Recovers $46,200 with only $8,400 in budget, generating the highest capital ROI (5.5x) and net gain (++$37,800).",
        netImpact: "+$37,800 Net Profit Gain",
        netValue: 37800,
        risk: "Low Risk (Controlled OTA roll-out)",
        pros: "Directly solves BLE leak; prevents watch stockout via air freight; protects $299 MSRP pricing.",
        cons: "Requires firmware engineering rapid regression sign-off.",
        aiPromptMessage: "🏆 ARGUS AI Endorsement: Excellent choice. Option A is rated BEST (Score: 96/100). It surgically resolves the BLE buffer overflow via OTA patch while air-freighting 200 watches to prevent stockout, recovering $46,200 with minimal $8,400 expenditure."
      };
    }
    if (strategyType === 'Conservative' || decisionId === 2) {
      return {
        rank: 3,
        ratingLabel: "⚠️ WORST STRATEGY",
        ratingType: 'WORST' as const,
        badgeStyle: "bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-rose-500/10",
        selectedRing: "border-rose-500 ring-2 ring-rose-500 bg-rose-950/20 shadow-rose-500/10",
        score: "18 / 100",
        aiTag: "Capital Destructive • AI Rank #3",
        headline: "Severe Financial Loss for a Software Defect",
        whyThisRating: "RATED WORST because it halts all sales and initiates a physical recall ($24,500) for what is proven to be a 100% software bug. Leaves an estimated -$6,500 net loss, alarms consumers, and fails to restock the Nexus Watch.",
        netImpact: "-$6,500 Net Financial Loss",
        netValue: -6500,
        risk: "High Risk (Negative cash return & brand shock)",
        pros: "Guarantees zero units with buggy firmware remain in store channels.",
        cons: "Net financial loss (-$6,500); destroys $24,500 in working capital; triggers consumer panic unnecessarily.",
        aiPromptMessage: "⚠️ ARGUS AI Critical Warning: You selected Option B, rated WORST (Score: 18/100). Executing a full hardware recall for an OTA-patchable bug burns $24,500 and creates a -$6,500 net financial loss. Are you sure you want to commit this?"
      };
    }
    return {
      rank: 2,
      ratingLabel: "📉 SUB-OPTIMAL",
      ratingType: 'SUB-OPTIMAL' as const,
      badgeStyle: "bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-amber-500/10",
      selectedRing: "border-amber-500 ring-2 ring-amber-500 bg-amber-950/20 shadow-amber-500/10",
      score: "64 / 100",
      aiTag: "Margin Dilutive • AI Rank #2",
      headline: "Volume Recovery with Severe Margin Erosion",
      whyThisRating: "RATED SUB-OPTIMAL because slashing the retail price from $299 to $229 permanently compresses product gross margins by 23.4% and burns $15,200 in bulk cargo for an inventory crisis that didn't warrant price concessions.",
      netImpact: "+$38,800 Net (Gross Margin Diluted)",
      netValue: 38800,
      risk: "Medium Risk (Permanent brand price anchoring)",
      pros: "Accelerates inventory liquidation; satisfies price-sensitive buyers.",
      cons: "Erodes brand prestige; sacrifices $70 margin per unit permanently; high rush air freight ($15,200).",
      aiPromptMessage: "📉 ARGUS AI Advisory: Option C is SUB-OPTIMAL (Score: 64/100). While it recovers unit sales, price slashing to $229 permanently degrades product gross margins by 23.4% and burns $15,200 in rush logistics."
    };
  };

  const sitrepScript = investigation 
    ? `Attention Executive. ARGUS operational telemetry has flagged an active operational incident: ${investigation.metric_name}. Anomaly score is ${investigation.anomaly_score} out of 10. Root cause confirmed: ${investigation.root_cause}. Three strategic options have been synthesized. Strategy Option A recovers $46,200 in gross margin with a 5.5x capital ROI. Awaiting your executive authorization command.`
    : "Attention Executive. ARGUS operational telemetry is actively monitoring return rates, sales volume, and supply chain lead times across all product lines.";

  return (
    <div className="space-y-6">
      
      {/* Executive Audio SITREP Briefing Player */}
      <AudioSitrepPlayer 
        script={sitrepScript} 
        title={investigation ? `Operational SITREP: ${investigation.metric_name.replace('ARGUS Audit: ', '')}` : "Operational SITREP Briefing"}
      />

      {/* Visual Pipeline Header / Consecutive Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Incident Resolution Pipeline
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Step {currentStep} of 4</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWorkflowDAG(!showWorkflowDAG)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-blue-400 border border-blue-900/50 text-[11px] font-mono transition-colors flex items-center space-x-1"
              title="Inspect the Agent's Cognitive Reasoning DAG"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>{showWorkflowDAG ? 'Hide Reasoning DAG' : 'Inspect Reasoning DAG'}</span>
            </button>

            {isResolved ? (
              <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center space-x-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolved • Saved $46,200</span>
              </span>
            ) : (
              <span className="text-amber-400 font-mono text-[11px] font-semibold flex items-center space-x-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Active Crisis</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isUnlocked = step.id <= maxUnlockedStep || isResolved;
            const isPassed = (currentStep > step.id && isUnlocked) || (step.id === 4 && isResolved);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-left relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-600/20 border border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : isPassed
                    ? 'bg-slate-950/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                    : isUnlocked
                    ? 'bg-slate-950/40 border border-slate-800/50 text-slate-400 hover:text-slate-300'
                    : 'bg-slate-950/20 border border-slate-900/60 text-slate-600 cursor-not-allowed opacity-75'
                }`}
                title={!isUnlocked ? `Complete Step ${step.id - 1} first to unlock` : step.label}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : isPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}>
                  {isPassed && step.id === 4 && isResolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  ) : (
                    step.id
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate flex items-center space-x-1.5">
                    <span className="truncate">{step.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block shrink-0" />}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{step.desc}</div>
                </div>

                {!isUnlocked && (
                  <span className="text-[10px] font-mono uppercase bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lock warning notification */}
        {lockNotice && (
          <div className="mt-3 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{lockNotice}</span>
          </div>
        )}
      </div>

      {/* Expandable Cognitive Reasoning Graph DAG */}
      {showWorkflowDAG && (
        <AgentWorkflowDAG 
          investigation={investigation} 
          activeStep={currentStep} 
        />
      )}

      {/* ========================================================================= */}
      {/* STEP 1: PROBLEM DETECTED (Consecutive Step 1)                             */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
            
            {/* Header / Situation Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 shrink-0">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                      Critical Anomaly Alert
                    </span>
                    <span className="text-xs text-slate-400">Incident #INC-2026-101 • Flagged in Real-time</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    Spike in Return Rate on Flagship Headphones + Stockout Threat
                  </h2>
                </div>
              </div>

              {/* Step 1 Primary Action */}
              <button
                onClick={handleAcknowledgeStep1}
                disabled={isInvestigating}
                className="shrink-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isInvestigating ? 'AI Investigating...' : 'Acknowledge Anomaly & Launch Investigation →'}</span>
              </button>
            </div>

            {/* Plain English Explanation */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
              <strong className="text-blue-300 block mb-1">What just triggered this alert?</strong>
              ARGUS continuously monitors store transactions, return claims, and warehouse supply buffers. 48 hours ago, warranty returns for 
              <strong className="text-rose-300"> Aura Sound Pro ANC Headphones</strong> exploded from normal <strong>2.1%</strong> to 
              <strong className="text-rose-300"> 14.8%</strong>. Concurrently, the <strong>Nexus Watch Ultra 2</strong> has only 32 units left with an overseas supplier delay, threatening an immediate inventory stockout.
            </div>

            {/* 3 Impact Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Return Rate Spike</span>
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">14.8%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Normal baseline: <span className="text-slate-200">2.1%</span> (7x surge)
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Estimated Monthly Bleed</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">$38,400</div>
                <div className="text-[11px] text-slate-400 mt-1">In customer refunds, scrap, and shipping</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/40">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Nexus Watch Stockout Threat</span>
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-indigo-400 font-mono">7.6 Days</div>
                <div className="text-[11px] text-slate-400 mt-1">32 units left; supplier port delay of 14d</div>
              </div>
            </div>

            {/* Clean Telemetry Surge Chart */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Return Rate Anomaly Timeline
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Continuous monitoring over the 7-day outbreak period
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    Baseline: 2.1%
                  </span>
                  <span className="text-xs font-mono text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                    Peak: 14.8% (+605%)
                  </span>
                </div>
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spikeTelemetryData}>
                    <defs>
                      <linearGradient id="spikeRateClean" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 18]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Return Rate']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    
                    <ReferenceLine 
                      y={2.1} 
                      stroke="#10B981" 
                      strokeDasharray="3 3" 
                      strokeWidth={1.5}
                      label={{ value: 'Normal Baseline (2.1%)', fill: '#10B981', fontSize: 10, position: 'insideTopLeft' }} 
                    />

                    <ReferenceLine 
                      x="Sep 08" 
                      stroke="#3B82F6" 
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      label={{ value: 'v2.4 Rollout', fill: '#60A5FA', fontSize: 10, position: 'top' }} 
                    />

                    <Area 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#F43F5E" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#spikeRateClean)" 
                      name="Actual Return Rate" 
                      activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#F43F5E' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Clean Telemetry Callout */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span><strong>Root Trigger:</strong> Spike accelerated from 2.1% to 14.8% within 72 hours of Firmware v2.4 rollout.</span>
                </span>
                <span className="font-mono text-rose-400 font-bold text-[11px] shrink-0">
                  Statistical Anomaly: +4.8σ
                </span>
              </div>
            </div>

            {/* Customer Return Feedback Samples with Interactive Filter */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs uppercase font-medium text-slate-400 tracking-wider">
                  Live Customer Complaint Stream
                </h3>
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setFeedbackCategory('all')}
                    className={`px-2.5 py-1 rounded-lg ${feedbackCategory === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    All (3)
                  </button>
                  <button
                    onClick={() => setFeedbackCategory('bluetooth')}
                    className={`px-2.5 py-1 rounded-lg ${feedbackCategory === 'bluetooth' ? 'bg-rose-950 text-rose-300 border border-rose-800 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Bluetooth Disconnect (2)
                  </button>
                  <button
                    onClick={() => setFeedbackCategory('battery')}
                    className={`px-2.5 py-1 rounded-lg ${feedbackCategory === 'battery' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    ANC Stutter (1)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(feedbackCategory === 'all' || feedbackCategory === 'bluetooth') && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="text-rose-400 font-semibold mb-1 flex items-center justify-between">
                      <span>Order #ORD-2026-1004</span>
                      <span className="text-[10px] text-slate-500 font-mono">12m ago</span>
                    </div>
                    "Headphones disconnect every 10 minutes following the recent v2.4 firmware update. Unusable on calls."
                  </div>
                )}
                {(feedbackCategory === 'all' || feedbackCategory === 'battery') && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="text-rose-400 font-semibold mb-1 flex items-center justify-between">
                      <span>Order #ORD-2026-1008</span>
                      <span className="text-[10px] text-slate-500 font-mono">1h ago</span>
                    </div>
                    "ANC drops out and audio stutters when paired with iPhone 16. Was perfectly fine before the update."
                  </div>
                )}
                {(feedbackCategory === 'all' || feedbackCategory === 'bluetooth') && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="text-rose-400 font-semibold mb-1 flex items-center justify-between">
                      <span>Order #ORD-2026-1020</span>
                      <span className="text-[10px] text-slate-500 font-mono">3h ago</span>
                    </div>
                    "Firmware update v2.4 bricked the left earbud Bluetooth link. Requesting immediate warranty replacement."
                  </div>
                )}
              </div>
            </div>

            {/* Mandatory Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>To unlock Step 2 (Root Cause Audit), acknowledge the crisis and launch the agent.</span>
              </div>

              <button
                onClick={handleAcknowledgeStep1}
                disabled={isInvestigating}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
              >
                <span>Acknowledge Crisis & Launch Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: ROOT CAUSE AUDIT (Consecutive Step 2)                             */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 shrink-0">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Autonomous Agent Investigation</h2>
                  <p className="text-xs text-slate-400">ARGUS formed hypotheses and executed analytical queries to isolate the root cause</p>
                </div>
              </div>

              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                Confidence: 92% Confirmed
              </span>
            </div>

            {/* Diagnosed Primary Root Cause Card */}
            <div className="bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 p-5 rounded-xl border border-blue-700/50 space-y-2">
              <div className="flex items-center space-x-2 text-blue-300 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Diagnosed Primary Root Cause</span>
              </div>
              <p className="text-sm text-slate-100 font-medium leading-relaxed">
                {investigation?.root_cause || "Bluetooth LE audio stack memory leak in firmware v2.4 + Supplier lead time expanded from 5 to 14 days."}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Hardware inspection confirmed 98.4% component pass rate. The defect was introduced solely in software during the v2.4 OTA release.
              </p>
            </div>

            {/* Interactive Hypothesis Inspection Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Agent Hypotheses & Live Diagnostic Testing
                </h3>
                <span className="text-xs text-slate-400">Click any hypothesis to view SQL query evidence</span>
              </div>

              <div className="space-y-3">
                {investigation?.hypotheses?.map((h) => {
                  const isAudited = hasRunAuditFor[h.id];
                  const isSelected = activeHypothesisId === h.id;

                  return (
                    <div
                      key={h.id}
                      onClick={() => handleTestHypothesis(h.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-950 border-blue-500 shadow-md shadow-blue-500/10'
                          : h.validation_status === 'confirmed'
                          ? 'bg-emerald-950/20 border-emerald-800/60 hover:border-slate-700'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          {h.validation_status === 'confirmed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white flex items-center space-x-2">
                              <span>{h.hypothesis_text}</span>
                              {isSelected && (
                                <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700 px-2 py-0.5 rounded">
                                  Inspecting
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                              <strong className="text-slate-400">Empirical Evidence:</strong> {h.evidence}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center space-x-2 sm:pl-4">
                          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                            h.validation_status === 'confirmed'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {h.validation_status === 'confirmed' ? 'Confirmed (92%)' : 'Rejected (12%)'}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Evidence Details if selected */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono bg-slate-900/90 p-3 rounded-lg text-slate-300 space-y-1">
                          <div className="text-blue-400 flex items-center space-x-1.5 font-bold">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Executed Query: audit_returns_by_firmware(sku='AURA-SND-PRO')</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {h.id === 1 
                              ? ">>> Telemetry Dump: 1,240 crash dumps evaluated. BLE_STACK_OOM error identified on 83.3% of returned units." 
                              : h.id === 2 
                              ? ">>> Hardware Lab Report: Acoustic driver impedance and physical solder joints tested 99.2% nominal." 
                              : ">>> Supplier Portal Check: Shenzen Precision Fab reported 9-day port container congestion delay."}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Confirmation Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1: Crisis</span>
              </button>

              <button
                onClick={handleConfirmStep2}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                <span>Confirm Diagnosis & Proceed to Step 3 (Strategies)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: STRATEGY OPTIONS (Consecutive Step 3)                             */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">Compare Strategic Action Plans</h2>
                    <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      Mandatory Selection
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">ARGUS AI evaluated all 3 candidates. Click on your chosen strategy to commit.</p>
                </div>
              </div>

              <div>
                {selectedDecision ? (
                  <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs text-slate-300 font-mono">
                      Selected: <strong className="text-white">{selectedDecision.strategy_type} Strategy</strong>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-800/80 text-amber-300 text-xs font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>No Strategy Selected (Required)</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI STRATEGIC RANKING & ADVISORY CONSOLE */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
                <div className="flex items-center space-x-2 text-xs">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    ARGUS AI Strategic Ranking Matrix
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Objective: Maximize Net Recovery • Minimize Capital Destruction
                </span>
              </div>

              {/* Ranking Badges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div 
                  onClick={() => handleSelectDecision(1)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDecisionId === 1 
                      ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <span>🏆 1st Rank: BEST</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      Score: 96/100
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">Option A (Balanced Hotfix)</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>Net Gain: <strong className="text-emerald-400">+$37,800</strong></span>
                    <span>ROI: <strong className="text-blue-400">5.5x</strong></span>
                  </div>
                </div>

                <div 
                  onClick={() => handleSelectDecision(3)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDecisionId === 3 
                      ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                      <span>📉 2nd Rank: SUB-OPTIMAL</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                      Score: 64/100
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">Option C (Price Discount)</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>Net Gain: <strong className="text-amber-400">+$38,800</strong></span>
                    <span className="text-rose-400">-23% Margin Erosion</span>
                  </div>
                </div>

                <div 
                  onClick={() => handleSelectDecision(2)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDecisionId === 2 
                      ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-rose-400 flex items-center space-x-1">
                      <span>⚠️ 3rd Rank: WORST</span>
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/60">
                      Score: 18/100
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">Option B (Full Recall)</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>Net Loss: <strong className="text-rose-400">-$6,500</strong></span>
                    <span className="text-rose-400">Negative Return</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC LIVE AI PROMPT ADVISORY */}
              <div className={`p-4 rounded-xl border text-xs transition-all ${
                selectedDecisionId === 1 
                  ? 'bg-emerald-950/30 border-emerald-600/70 text-emerald-200'
                  : selectedDecisionId === 2
                  ? 'bg-rose-950/30 border-rose-600/70 text-rose-200'
                  : selectedDecisionId === 3
                  ? 'bg-amber-950/30 border-amber-600/70 text-amber-200'
                  : 'bg-blue-950/25 border-blue-700/60 text-blue-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                      {selectedDecisionId 
                        ? `ARGUS Strategic Recommendation: ${getStrategyAssessment(selectedDecisionId, decisions.find(d => d.id === selectedDecisionId)?.strategy_type || '').ratingLabel}`
                        : "ARGUS Autonomous Recommendation Engine: Selection Required"}
                    </div>
                    <p className="leading-relaxed">
                      {selectedDecisionId 
                        ? getStrategyAssessment(selectedDecisionId, decisions.find(d => d.id === selectedDecisionId)?.strategy_type || '').aiPromptMessage
                        : "Mandatory Decision: Click on one of the strategy cards below to select your execution plan. ARGUS has evaluated the trade-offs: Option A is strongly rated BEST (5.5x ROI), while Option B is rated WORST due to -$6,500 net capital destruction."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MANDATORY WARNING BANNER IF USER ATTEMPTED TO COMMIT WITHOUT SELECTING */}
            {strategySelectionError && !selectedDecisionId && (
              <div className="p-4 bg-rose-950/50 border border-rose-600 rounded-xl text-xs text-rose-200 flex items-center space-x-3 animate-pulse">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="font-bold text-white block">Strategy Selection Mandatory</strong>
                  <span>Please click on one of the 3 strategy cards below to choose your plan before proceeding to authorization.</span>
                </div>
              </div>
            )}

            {/* 3 Strategy Cards with Prominent BEST / WORST Labels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {decisions.map((decision) => {
                const isSelected = selectedDecisionId === decision.id;
                const assessment = getStrategyAssessment(decision.id, decision.strategy_type);

                return (
                  <div
                    key={decision.id}
                    onClick={() => handleSelectDecision(decision.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? assessment.selectedRing
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          decision.strategy_type === 'Balanced'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : decision.strategy_type === 'Conservative'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {decision.strategy_type} Strategy
                        </span>

                        {/* Explicit AI Verdict Tag */}
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${assessment.badgeStyle}`}>
                          {assessment.ratingLabel}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white mb-1 leading-snug">{decision.title}</h3>
                        <div className="text-[11px] text-slate-400 font-mono">
                          AI Assessment Score: <strong className="text-white">{assessment.score}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {decision.description}
                      </p>

                      {/* AI Evaluation Box inside Card */}
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-2 text-[11px]">
                        <div className="font-semibold text-slate-200 flex items-center justify-between">
                          <span>AI Rationale:</span>
                          <span className={`font-mono text-[10px] font-bold ${
                            assessment.netValue > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {assessment.netImpact}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-normal text-[11px]">
                          {assessment.whyThisRating}
                        </p>
                        <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
                          <span className="text-slate-500">Risk Assessment: </span>
                          <span className="text-slate-300 font-medium">{assessment.risk}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Numbers Matrix */}
                    <div className="space-y-3 pt-3 mt-3 border-t border-slate-800">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 uppercase">Cost</div>
                          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
                            ${decision.estimated_cost.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 uppercase">Recovered</div>
                          <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                            ${decision.projected_revenue_impact.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                          <div className="text-[10px] text-slate-400 uppercase">ROI</div>
                          <div className={`text-xs font-bold font-mono mt-0.5 ${
                            decision.projected_roi >= 2 ? 'text-emerald-400' : decision.projected_roi < 1 ? 'text-rose-400' : 'text-blue-400'
                          }`}>
                            {decision.projected_roi}x
                          </div>
                        </div>
                      </div>

                      {/* Explicit Interactive Click-to-Select Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDecision(decision.id);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>✓ Selected Strategy</span>
                          </>
                        ) : (
                          <span>Click to Select This Strategy</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clean Strategy Financial ROI Comparison */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Financial Trade-off Comparison
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Net financial outcome across options (Click any bar to select strategy)
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">Option A: +$37,800 Net (5.5x ROI)</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-rose-400 font-bold">Option B: -$6,500 Net</span>
                </div>
              </div>

              <div className="h-48 w-full cursor-pointer">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={strategyComparisonData}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const clickedId = e.activePayload[0].payload.id;
                        handleSelectDecision(clickedId);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                    />
                    <Bar dataKey="recovered" name="Revenue Recovered" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cost" name="Implementation Cost" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="net" name="Net Gain / (Loss)" radius={[4, 4, 0, 0]}>
                      {strategyComparisonData.map((entry) => (
                        <Cell 
                          key={entry.id} 
                          fill={entry.id === selectedDecisionId ? '#3B82F6' : entry.net > 0 ? '#1D4ED8' : '#BE123C'} 
                          stroke={entry.id === selectedDecisionId ? '#93C5FD' : 'none'}
                          strokeWidth={entry.id === selectedDecisionId ? 2 : 0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Selected: <strong className="text-white font-bold">
                  {strategyComparisonData.find(d => d.id === selectedDecisionId)?.name || 'Option A (BEST)'}
                </strong></span>
                <span className="text-blue-400">
                  {selectedDecisionId === 1 ? 'Optimal Balance of Speed, Cost & Margin' : selectedDecisionId === 2 ? 'Excessive Cost & Long Downtime' : 'Discount Clearance Erodes Brand Value'}
                </span>
              </div>
            </div>

            {/* Navigation & Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 2: Diagnosis</span>
              </button>

              <button
                onClick={handleCommitStep3}
                className={`flex items-center space-x-2 text-xs font-bold px-6 py-2.5 rounded-xl transition-all ${
                  selectedDecisionId
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer border border-slate-700'
                }`}
              >
                {selectedDecisionId ? (
                  <>
                    <span>Commit & Proceed to Step 4: Authorize Fix</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select a Strategy Above to Proceed</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: AUTHORIZE & EXECUTE / RESOLUTION (Consecutive Step 4)             */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Active Staged Execution Overlay */}
          {isSubmitting && executingPhase > 0 && (
            <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-8 shadow-2xl text-center space-y-5 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">ARGUS Autonomous Execution in Progress</h3>
                <p className="text-xs text-slate-400 mt-1">Executing business directives authorized for: <strong className="text-blue-300">{selectedDecision?.title}</strong></p>
              </div>

              {/* 3 Staged Steps tailored to selected strategy */}
              <div className="max-w-md mx-auto space-y-2 text-xs font-mono text-left">
                {selectedDecision?.strategy_type === 'Conservative' ? (
                  <>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 1 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>1. Halting e-commerce sales & freezing distributor stock</span>
                      {executingPhase > 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="animate-spin text-blue-400">●</span>}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 2 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>2. Processing 100% customer return refunds ($24,500)</span>
                      {executingPhase > 2 ? <Check className="w-4 h-4 text-emerald-400" /> : executingPhase === 2 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 3 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>3. Initiating warehouse quarantine for 32 physical units</span>
                      {executingPhase === 3 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                  </>
                ) : selectedDecision?.strategy_type === 'Aggressive' ? (
                  <>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 1 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>1. Updating catalog price to $229 (25% clearance discount)</span>
                      {executingPhase > 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="animate-spin text-blue-400">●</span>}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 2 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>2. Deploying OTA Firmware v2.4.1 hotfix to fleet</span>
                      {executingPhase > 2 ? <Check className="w-4 h-4 text-emerald-400" /> : executingPhase === 2 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 3 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>3. Issuing bulk ocean freight PO for 400 Nexus Watch units ($15,200)</span>
                      {executingPhase === 3 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 1 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>1. Deploying OTA Firmware v2.4.1 hotfix</span>
                      {executingPhase > 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="animate-spin text-blue-400">●</span>}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 2 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>2. Dispatching $25 retention coupons to 30 claimants</span>
                      {executingPhase > 2 ? <Check className="w-4 h-4 text-emerald-400" /> : executingPhase === 2 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      executingPhase >= 3 ? 'bg-blue-950/60 border-blue-700 text-blue-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <span>3. Authorizing air-freight PO for 200 Nexus Watch units</span>
                      {executingPhase === 3 ? <span className="animate-spin text-blue-400">●</span> : null}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* IF RESOLVED: Grand Resolution & Interactive Initial vs. Final Scorecard */}
          {!isSubmitting && isResolved && (
            <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase font-bold">
                        Incident Executed & Resolved
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Strategy: <strong className="text-white">{resolvedDecision?.title || 'Selected Strategy'}</strong>
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">
                      Action Approved: {activeNet >= 0 ? `Net +$${activeNet.toLocaleString()} Preserved` : `Net -$${Math.abs(activeNet).toLocaleString()} Committed`}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {onNavigateToOperations && (
                    <button
                      onClick={onNavigateToOperations}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>View Live Operations Center</span>
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      await onResetData();
                      setMaxUnlockedStep(1);
                      setCurrentStep(1);
                    }}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
                    title="Reset scenario data to test again"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Demo</span>
                  </button>
                </div>
              </div>

              {/* View Toggle: Initial vs Final Comparison vs Trajectory */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Interactive Impact Telemetry
                </span>
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setResolutionViewMode('comparison')}
                    className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                      resolutionViewMode === 'comparison'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Initial vs. Final Scorecard
                  </button>
                  <button
                    onClick={() => setResolutionViewMode('trajectory')}
                    className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                      resolutionViewMode === 'trajectory'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rebound Curve
                  </button>
                </div>
              </div>

              {/* Scorecard: Initial (Crisis) vs Final (Restored) */}
              {resolutionViewMode === 'comparison' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Metric 1: Return Rate */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Return Rate</span>
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs line-through text-rose-400 font-mono">14.8% (Crisis)</span>
                      <span className="text-2xl font-bold text-emerald-400 font-mono">
                        {resolvedDecision?.strategy_type === 'Conservative' ? '0.0%' : resolvedDecision?.strategy_type === 'Aggressive' ? '4.2%' : '2.1%'}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/50">
                      {resolvedDecision?.strategy_type === 'Conservative'
                        ? '▼ 100% reduction in returns. Sales halted and hardware quarantined.'
                        : resolvedDecision?.strategy_type === 'Aggressive'
                        ? '▼ 71.6% reduction in returns. Hotfix applied with clearance price.'
                        : '▼ 85.8% reduction in returns. BLE buffer leak patched via OTA v2.4.1.'}
                    </div>
                  </div>

                  {/* Metric 2: Recovered Revenue */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Net Financial Recovery</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs line-through text-amber-400 font-mono">-$38.4k Bleed</span>
                      <span className={`text-2xl font-bold font-mono ${activeNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeNet >= 0 ? `+$${activeNet.toLocaleString()}` : `-$${Math.abs(activeNet).toLocaleString()}`}
                      </span>
                    </div>
                    <div className={`text-[11px] font-medium p-2 rounded-lg border ${
                      activeNet >= 0
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50'
                        : 'text-rose-300 bg-rose-950/40 border-rose-900/50'
                    }`}>
                      {resolvedDecision?.projected_roi ?? 5.5}x ROI on ${activeCost.toLocaleString()} budget (Gross: +${activeImpact.toLocaleString()}).
                    </div>
                  </div>

                  {/* Metric 3: Warehouse Assets */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Nexus Watch Inventory</span>
                      <Package className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs line-through text-rose-400 font-mono">32 units (7d)</span>
                      <span className="text-2xl font-bold text-indigo-400 font-mono">
                        {resolvedDecision?.strategy_type === 'Conservative' ? '32 (Frozen)' : resolvedDecision?.strategy_type === 'Aggressive' ? '432 units' : '232 units'}
                      </span>
                    </div>
                    <div className="text-[11px] text-indigo-300 font-medium bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/50">
                      {resolvedDecision?.strategy_type === 'Conservative'
                        ? '⚠️ Sales frozen. Units preserved for warranty replacements.'
                        : resolvedDecision?.strategy_type === 'Aggressive'
                        ? '▲ 60-day liquidation run buffer secured via bulk container logistics.'
                        : '▲ 45-day safety buffer replenished via expedited air freight.'}
                    </div>
                  </div>

                </div>
              ) : (
                /* Clean Rebound Trajectory Chart */
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Revenue Trajectory: {resolvedDecision?.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {resolvedDecision?.strategy_type === 'Conservative'
                          ? 'Product line halted — curve flattens at $620/day with complete recall costs'
                          : resolvedDecision?.strategy_type === 'Aggressive'
                          ? 'Discounted liquidation volume surge recovering to $1,890/day baseline'
                          : 'Post-hotfix recovery curve restoring nominal $2,240/day baseline'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                        {resolvedDecision?.strategy_type === 'Conservative' ? 'Restored: $620/day' : resolvedDecision?.strategy_type === 'Aggressive' ? 'Restored: $1,890/day' : 'Restored: $2,240/day'}
                      </span>
                      <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                        Avoided Bleed: -$38.4k
                      </span>
                    </div>
                  </div>

                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trajectoryComparisonData}>
                        <defs>
                          <linearGradient id="reboundWithArgusClean" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} domain={[0, 2600]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                          formatter={(value: any, name: string) => [
                            `$${Number(value).toLocaleString()}`, 
                            name === 'withArgus' ? 'With Strategy' : 'Without Intervention'
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                        
                        <ReferenceLine x="Day 09 (Crisis)" stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Crisis Outbreak', fill: '#F59E0B', fontSize: 10, position: 'top' }} />
                        <ReferenceLine x="Day 12 (Fix v2.4.1)" stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Strategy Executed', fill: '#10B981', fontSize: 10, position: 'top' }} />

                        <Area 
                          type="monotone" 
                          dataKey="withArgus" 
                          stroke="#10B981" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#reboundWithArgusClean)" 
                          name="With Strategy ($/day)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="withoutArgus" 
                          stroke="#F43F5E" 
                          strokeWidth={2} 
                          strokeDasharray="4 4" 
                          fillOpacity={0} 
                          name="Without Intervention (Bleed)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
                    <span><strong>Intervention Result:</strong> Executed {resolvedDecision?.title} with {resolvedDecision?.projected_roi}x ROI.</span>
                    <span className={`font-bold text-[11px] ${activeNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Net Outcome: {activeNet >= 0 ? `+$${activeNet.toLocaleString()}` : `-$${Math.abs(activeNet).toLocaleString()}`} (Gross: +${activeImpact.toLocaleString()})
                    </span>
                  </div>
                </div>
              )}

              {/* What ARGUS Executed */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
                  Automated Execution Log: {resolvedDecision?.title}
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  {resolvedDecision?.strategy_type === 'Conservative' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Halted Aura Sound Pro sales across all e-commerce channels & distributors.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Issued 100% full cash refunds to 30 affected return claimants ($24,500 budget allocated).</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Quarantined warehouse inventory of 32 units for hardware teardown & vendor review.</span>
                      </div>
                    </>
                  ) : resolvedDecision?.strategy_type === 'Aggressive' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Reduced Aura Sound Pro MSRP by 25% to $229 for immediate inventory clearance.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Deployed Over-The-Air hotfix firmware v2.4.1 to 1,240 existing devices.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Dispatched bulk ocean freight replenishment PO for 400 Nexus Watch units ($15,200).</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Deployed Over-The-Air hotfix firmware v2.4.1 to 1,240 devices (memory leak resolved).</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Dispatched $25 store credit apology coupons to 30 affected return claimants (retained 65% of accounts).</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Authorized expedited air-freight reorder of 200 Nexus Watch Ultra units to bypass port congestion.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Want to review each step of the journey again?</span>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-400 hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>Re-examine Step 1 Telemetry →</span>
                </button>
              </div>

            </div>
          )}

          {/* IF NOT RESOLVED: Executive Authorization Review Card */}
          {!isSubmitting && !isResolved && selectedDecision && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Executive Authorization Sign-off</h2>
                    <p className="text-xs text-slate-400">Review the selected strategy details and commit the business action with 1 click</p>
                  </div>
                </div>

                <span className="bg-amber-950 text-amber-300 border border-amber-800 text-xs px-3 py-1 rounded-full font-mono font-bold">
                  Pending Human Sign-off
                </span>
              </div>

              {/* Selected Plan Details */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
                {(() => {
                  const assessment = getStrategyAssessment(selectedDecision.id, selectedDecision.strategy_type);
                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-xs font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                              {selectedDecision.strategy_type} Strategy
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${assessment.badgeStyle}`}>
                              {assessment.ratingLabel}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              Score: <strong className="text-white">{assessment.score}</strong>
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-1">{selectedDecision.title}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`text-2xl font-bold font-mono ${assessment.netValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {assessment.netValue >= 0 ? `+${assessment.netImpact}` : assessment.netImpact}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Projected Net Balance</div>
                        </div>
                      </div>

                      {/* AI Advisory Callout in Authorization Step */}
                      <div className={`p-3.5 rounded-xl border text-xs ${
                        assessment.ratingType === 'WORST'
                          ? 'bg-rose-950/40 border-rose-600/80 text-rose-200'
                          : assessment.ratingType === 'BEST'
                          ? 'bg-emerald-950/30 border-emerald-600/70 text-emerald-200'
                          : 'bg-amber-950/30 border-amber-600/70 text-amber-200'
                      }`}>
                        <div className="flex items-start space-x-2.5">
                          {assessment.ratingType === 'WORST' ? (
                            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                              {assessment.ratingType === 'WORST' 
                                ? '⚠️ Executive Warning: Authorizing WORST-Rated Plan'
                                : assessment.ratingType === 'BEST'
                                ? '🏆 ARGUS AI Endorsement: Optimal Strategy Plan'
                                : '📉 AI Notice: Sub-optimal Margin Dilution'}
                            </div>
                            <p className="leading-relaxed">
                              {assessment.whyThisRating}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
                        {selectedDecision.description}
                      </p>

                      <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Implementation Budget</span>
                          <span className="text-slate-200 font-bold font-mono text-sm">
                            ${selectedDecision.estimated_cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Projected Net ROI</span>
                          <span className={`font-bold font-mono text-sm ${
                            selectedDecision.projected_roi >= 2 ? 'text-emerald-400' : selectedDecision.projected_roi < 1 ? 'text-rose-400' : 'text-blue-400'
                          }`}>
                            {selectedDecision.projected_roi}x
                          </span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Assessed Risk</span>
                          <span className={`font-bold font-mono text-sm ${
                            selectedDecision.risk_level === 'Low' ? 'text-emerald-400' : selectedDecision.risk_level === 'High' ? 'text-rose-400' : 'text-amber-400'
                          }`}>
                            {selectedDecision.risk_level} Risk
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Rejection Input Box if opened */}
                {isRejecting ? (
                  <div className="p-4 bg-rose-950/20 border border-rose-800/60 rounded-xl space-y-3">
                    <label className="text-xs font-semibold text-rose-300 block">Reason for Rejection / Directive:</label>
                    <input
                      type="text"
                      placeholder="e.g. Budget constrained; request alternative vendor quote..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsRejecting(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Approval CTA Buttons */
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="w-full sm:w-auto text-xs text-slate-400 hover:text-rose-400 px-4 py-2.5 transition-colors text-center"
                    >
                      Decline / Reject Strategy
                    </button>

                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-emerald-600/30 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Execute Plan Now (1-Click)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Back */}
              <div className="pt-2 flex justify-start">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Choose a Different Strategy</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
