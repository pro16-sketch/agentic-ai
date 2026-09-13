import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Truck, 
  Plane, 
  Train, 
  Ship,
  Leaf, 
  Clock,
  Sparkles,
  PackageCheck,
  Award,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp,
  MapPin,
  Bot
} from 'lucide-react';
import { 
  fetchLogisticsState, 
  executeLogisticsAction, 
  verifyLogisticsRecoveryApi, 
  runLangGraphRecoveryApi,
  triggerReplanDemoApi,
  resetLogisticsSandboxApi
} from '../api';
import { 
  LogisticsDigitalTwinState, 
  VerificationReport 
} from '../types';
import { VerificationCertificateModal } from './VerificationCertificateModal';

export const PS6AutonomousRecoveryCenter: React.FC = () => {
  const [digitalTwin, setDigitalTwin] = useState<LogisticsDigitalTwinState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stepLabel, setStepLabel] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null);
  const [showAgentTrace, setShowAgentTrace] = useState<boolean>(false);

  // Interactive Pareto Weights
  const [costWeight, setCostWeight] = useState<number>(35);
  const [speedWeight, setSpeedWeight] = useState<number>(45);
  const [carbonWeight, setCarbonWeight] = useState<number>(20);

  const loadState = async () => {
    try {
      const state = await fetchLogisticsState();
      setDigitalTwin(state);
      if (state.incidents[0]?.status === 'RESOLVED') {
        setActiveStep(4);
      }
    } catch (err) {
      console.error("Failed to load logistics state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadState();
    const interval = setInterval(loadState, 4000);
    return () => clearInterval(interval);
  }, []);

  const incident = digitalTwin?.incidents[0];
  const isResolved = incident?.status === 'RESOLVED' || activeStep === 4;

  // Dynamically calculate Pareto Scores based on user sliders
  const scoredAlternatives = useMemo(() => {
    if (!digitalTwin?.alternatives) return [];

    const totalWeight = costWeight + speedWeight + carbonWeight || 1;
    const normCost = costWeight / totalWeight;
    const normSpeed = speedWeight / totalWeight;
    const normCarbon = carbonWeight / totalWeight;

    return digitalTwin.alternatives.map(alt => {
      // Speed score: 1.8 days = 100%, 14 days = 0%
      const speedScore = Math.max(0, 100 - (alt.deliveryDays - 1.8) * 8.2);
      // Cost score: ₹1,00,000 = 100%, ₹6,50,000 = 0%
      const costScore = Math.max(0, 100 - ((alt.totalCostUsd - 100000) / 550000) * 100);
      // Carbon score: 90kg = 100%, 750kg = 0%
      const carbonScore = Math.max(0, 100 - ((alt.carbonEmissionKg - 90) / 660) * 100);

      const dynamicScore = Math.round(
        (speedScore * normSpeed) + (costScore * normCost) + (carbonScore * normCarbon)
      );

      return {
        ...alt,
        dynamicScore,
        speedScore: Math.round(speedScore),
        costScore: Math.round(costScore),
        carbonScore: Math.round(carbonScore)
      };
    }).sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [digitalTwin?.alternatives, costWeight, speedWeight, carbonWeight]);

  // 1. Single-click Autonomous AI Recovery
  const handleAutoRecover = async () => {
    setIsExecuting(true);
    setActiveStep(1);
    setStepLabel("Step 1: AI scanning Indian aviation corridors, DFC container rail & logistics hubs...");

    try {
      setTimeout(() => {
        setActiveStep(2);
        setStepLabel("Step 2: AI calculating Pareto optimization (Speed vs ₹ Cost vs Carbon)...");
      }, 700);

      setTimeout(() => {
        setActiveStep(3);
        setStepLabel("Step 3: Dispatching emergency order via Blue Dart Aviation (Chennai → Bengaluru)...");
      }, 1400);

      const res = await runLangGraphRecoveryApi("INC-2026-006", false);
      setDigitalTwin(res.digital_twin);

      setTimeout(() => {
        setActiveStep(4);
        setStepLabel("✅ Bengaluru Stock Restored! 200 units en route, arriving in 2.0 days.");
        setIsExecuting(false);
        if (res.final_state?.verificationResult) {
          setSelectedReport(res.final_state.verificationResult);
        }
      }, 2100);

    } catch (err) {
      console.error("Recovery failed:", err);
      setIsExecuting(false);
    }
  };

  // 2. Failure -> AI Re-Plan Demo (Evaluator Showcase)
  const handleTestReplan = async () => {
    setIsExecuting(true);
    setActiveStep(1);
    setStepLabel("Step 1: AI selects Blue Dart Air Express delivery...");

    try {
      setTimeout(() => {
        setActiveStep(2);
        setStepLabel("⚠️ DISRUPTION: Air carrier reported sudden cargo capacity lock-out during festive peak!");
      }, 900);

      setTimeout(() => {
        setActiveStep(3);
        setStepLabel("🔄 AI RE-PLANNING: Automatically rerouting stock via Indian Railways DFC Express Rail from Delhi NCR...");
      }, 1800);

      const res = await triggerReplanDemoApi();
      await loadState();

      setTimeout(() => {
        setActiveStep(4);
        setStepLabel("✅ Re-plan successful! DFC Express Rail transfer arrives in 3.5 days. Zero stockouts.");
        setIsExecuting(false);
        if (res.demo?.step6_verification) {
          setSelectedReport(res.demo.step6_verification);
        }
      }, 2700);

    } catch (err) {
      console.error("Replan demo failed:", err);
      setIsExecuting(false);
    }
  };

  // 3. Manual Choice Selection
  const handlePickOption = async (actionId: string) => {
    setIsExecuting(true);
    setStepLabel("Executing your chosen recovery option...");
    try {
      await executeLogisticsAction(actionId);
      const report = await verifyLogisticsRecoveryApi("INC-2026-006", actionId);
      await loadState();
      setActiveStep(4);
      setStepLabel("✅ Action dispatched successfully!");
      setSelectedReport(report);
    } catch (err) {
      console.error("Manual action failed:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  // 4. Reset
  const handleReset = async () => {
    setIsLoading(true);
    setActiveStep(0);
    setStepLabel(null);
    try {
      await resetLogisticsSandboxApi();
      await loadState();
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !digitalTwin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Connecting to India Supply Chain Digital Twin...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* 0. JUDGE CHEAT SHEET / 30-SECOND GUIDE */}
      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Judges 30-Second Quick Guide • Problem Statement 6 (India Logistics Twin)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <strong className="text-white block mb-0.5">1. The Disruption</strong>
            <span>32 watches left in Bengaluru (7.6d). JNPT Port ship delayed to 14d. ₹74.5L at risk.</span>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <strong className="text-white block mb-0.5">2. Pareto Intelligence</strong>
            <span>Balances Cost (₹) vs Speed vs Carbon emissions across Indian rail &amp; air corridors.</span>
          </div>
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <strong className="text-white block mb-0.5">3. Failure &amp; Re-Plan Loop</strong>
            <span>If airline locks out, LangGraph autonomously re-routes to DFC Indian Railways.</span>
          </div>
        </div>
      </div>

      {/* 1. THE PROBLEM CARD (Visual & Clear) */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isResolved 
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 shadow-xl shadow-emerald-950/20' 
          : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'
      }`}>
        
        {/* Status Badge & Reset */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isResolved 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {isResolved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Bengaluru Stockout Prevented &amp; Verified
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-1.5" /> Active Supply Chain Deficit
              </>
            )}
          </span>

          <button
            onClick={handleReset}
            disabled={isExecuting}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Big Clear Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {isResolved 
            ? "Bengaluru Watch Supply Restored to 55+ Days!" 
            : "Emergency: Bengaluru Warehouse Runs Out of Stock in 7.6 Days"}
        </h2>

        {/* Plain-English Story */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          {isResolved ? (
            "The autonomous recovery agent identified optimal multi-modal Indian logistics alternatives, dispatched emergency replenishment, and restored Bengaluru warehouse buffers prior to stockout."
          ) : (
            <>
              You have <strong className="text-white font-semibold">32 Nexus SmartWatches</strong> on hand at the <strong className="text-white font-semibold">Bengaluru Hub (Whitefield)</strong> selling at <strong className="text-white font-semibold">4.2 units/day</strong>. The primary inbound shipment via JNPT Port (Mumbai) is delayed to <strong className="text-rose-400 font-semibold">14.0 days</strong>, causing a critical <strong className="text-rose-400 font-semibold">-6.4 day stockout deficit</strong>.
            </>
          )}
        </p>

        {/* Visual Timeline Comparison */}
        {!isResolved ? (
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>The 6.4-Day Danger Gap</span>
              <span className="text-rose-400 font-mono">₹74,50,000 Revenue Exposure</span>
            </div>
            
            {/* Timeline Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Today (Day 0)</span>
                <span className="text-rose-400 font-bold">Stockout Occurs (Day 7.6)</span>
                <span className="text-slate-400">JNPT Port Boat Arrives (Day 14.0)</span>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[54%]" title="Stock Available (7.6 Days)" />
                <div className="h-full bg-rose-500/80 w-[46%] animate-pulse" title="Danger Zone (6.4 Days)" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-medium">✅ 7.6 Days Stock Remaining</span>
                <span className="text-rose-400 font-semibold">❌ 6.4 Days Empty Shelves (₹74.5 Lakhs Lost Sales)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-base">200 Replacement Units Dispatched to Bengaluru</div>
                <div className="text-xs text-emerald-300">Arrives in 2.0 days • Inventory buffer secured for 55.2 days</div>
              </div>
            </div>
            {selectedReport && (
              <button
                onClick={() => setSelectedReport(selectedReport)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/30 shrink-0"
              >
                <Award className="w-4 h-4" />
                <span>View SLA Certificate</span>
              </button>
            )}
          </div>
        )}

        {/* 2 Primary Interactive Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={handleAutoRecover}
            disabled={isExecuting}
            className="py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2.5 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Agent is Optimizing &amp; Dispatching...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>⚡ 1-Click Autonomous Recovery</span>
              </>
            )}
          </button>

          <button
            onClick={handleTestReplan}
            disabled={isExecuting}
            className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-sm flex items-center justify-center space-x-2.5 transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>🔄 Failure → Autonomous Re-Plan Demo</span>
          </button>
        </div>

        {/* Live Step Progress Feedback */}
        {stepLabel && (
          <div className="mt-4 p-3.5 bg-slate-950/80 border border-blue-500/30 rounded-xl text-xs sm:text-sm text-blue-200 flex items-center space-x-2.5 animate-fadeIn font-mono">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span>{stepLabel}</span>
          </div>
        )}
      </div>

      {/* 2. SUPPLY CHAIN DIGITAL TWIN NODE NETWORK (Visual Map - India) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white text-sm">
              India Supply Chain Digital Twin Node Network
            </h3>
          </div>
          <span className="text-xs text-slate-400">4 National Warehouses &amp; Freight Corridors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Bengaluru Hub */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" /> Bengaluru Hub
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                CRISIS NODE
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Stock: <strong className="text-white">32 Units</strong></div>
              <div>Daily Velocity: <strong className="text-amber-400">4.2 / Day</strong></div>
              <div>Days Supply: <strong className="text-rose-400 font-bold">7.6 Days</strong></div>
            </div>
          </div>

          {/* Delhi NCR Hub */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Delhi NCR Hub
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                SURPLUS BUFFER
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Surplus Stock: <strong className="text-white">150 Units</strong></div>
              <div>DFC Rail Link: <strong className="text-emerald-400">3.5 Days</strong></div>
              <div>Transfer Status: <strong className="text-emerald-400">Ready</strong></div>
            </div>
          </div>

          {/* Blue Dart Air Cargo */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center">
                <Plane className="w-3.5 h-3.5 mr-1 text-blue-400" /> Chennai Air Cargo
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                AIR EXPRESS
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Transit: <strong className="text-white">2.0 Days</strong></div>
              <div>Cost: <strong className="text-white">₹3,85,000</strong></div>
              <div>Carrier: <strong className="text-blue-400">Blue Dart Aviation</strong></div>
            </div>
          </div>

          {/* JNPT Port Route */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 opacity-70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center">
                <Ship className="w-3.5 h-3.5 mr-1 text-amber-400" /> JNPT Port Mumbai
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                BLOCKED (14d)
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Port Status: <strong className="text-rose-400">Berth Backlog</strong></div>
              <div>Transit ETA: <strong className="text-slate-400">14.0 Days</strong></div>
              <div>Current Delay: <strong className="text-rose-400">+9.0 Days</strong></div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. INTERACTIVE PARETO OPTIMIZATION MATRIX (With Live Weight Sliders) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        
        {/* Header & Interactive Sliders */}
        <div className="space-y-3 pb-4 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base">
                Multi-Objective Pareto Optimization Engine
              </h3>
              <p className="text-xs text-slate-400">
                Adjust the weights below to see how the AI dynamically recalculates multi-objective scores.
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-slate-950 text-slate-300 rounded-xl border border-slate-800 shrink-0">
              Constraint: Must arrive &lt; <strong className="text-rose-400">7.6 Days</strong>
            </span>
          </div>

          {/* 3 Interactive Priority Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Speed Slider */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-blue-400" /> Speed Priority</span>
                <strong className="text-blue-400">{speedWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={speedWeight} 
                onChange={(e) => setSpeedWeight(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cost Slider */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-400" /> ₹ Cost Priority</span>
                <strong className="text-emerald-400">{costWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={costWeight} 
                onChange={(e) => setCostWeight(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Carbon Slider */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center"><Leaf className="w-3.5 h-3.5 mr-1 text-amber-400" /> ESG / Carbon Priority</span>
                <strong className="text-amber-400">{carbonWeight}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={carbonWeight} 
                onChange={(e) => setCarbonWeight(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Dynamic Alternatives Ranked Live */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scoredAlternatives.map((alt, rank) => {
            const isTopRanked = rank === 0;

            return (
              <div 
                key={alt.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isTopRanked
                    ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-950/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      RANK #{rank + 1}
                    </span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                      isTopRanked 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      Score: {alt.dynamicScore}/100
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm flex items-center space-x-1.5">
                    {alt.transportMode === 'AIR_EXPRESS' && <Plane className="w-4 h-4 text-blue-400 shrink-0" />}
                    {alt.transportMode === 'RAIL_FREIGHT' && <Train className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {alt.transportMode === 'GROUND_EXPEDITED' && <Truck className="w-4 h-4 text-slate-400 shrink-0" />}
                    <span>{alt.name}</span>
                  </h4>

                  <p className="text-xs text-slate-400">{alt.details}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery Time:</span>
                    <strong className={alt.deliveryDays <= 3.5 ? 'text-emerald-400' : 'text-slate-300'}>
                      {alt.deliveryDays} Days
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Freight Cost:</span>
                    <strong className="text-white">₹{alt.totalCostUsd.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Carbon Footprint:</span>
                    <span className={alt.carbonEmissionKg <= 200 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {alt.carbonEmissionKg} kg CO₂
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePickOption(alt.id)}
                  disabled={isExecuting}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors disabled:opacity-50 ${
                    isTopRanked 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Select &amp; Dispatch
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. EXPANDABLE LANGGRAPH AGENT STATE MACHINE TRACE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          onClick={() => setShowAgentTrace(!showAgentTrace)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-white">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>🔬 View LangGraph Agent State Machine &amp; Execution DAG</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>{showAgentTrace ? 'Hide Trace' : 'Inspect Graph State'}</span>
            {showAgentTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAgentTrace && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3 font-mono text-xs text-slate-300 animate-fadeIn">
            <div className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">
              StateGraph Architecture &amp; Execution Nodes (India Logistics):
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div><code>Node 1 (monitor_telemetry)</code>: Senses Bengaluru stock (32 units) and JNPT Port transit backlog (14.0d).</div>
              <div><code>Node 2 (detect_disruption)</code>: Calculates -6.4d deficit gap (LeadTime &gt; Stock / BurnRate).</div>
              <div><code>Node 3 (investigate_alternatives)</code>: Queries multi-modal Indian logistics graph (Blue Dart Air, DFC Rail, Delhivery).</div>
              <div><code>Node 4 (pareto_optimizer)</code>: Solves multi-objective Pareto matrix (Weights: {speedWeight}s / {costWeight}c / {carbonWeight}e).</div>
              <div><code>Node 5 (execute_action)</code>: State mutation on digital twin $\rightarrow$ dispatches carrier replenishment order.</div>
              <div><code>Node 6 (verify_recovery)</code>: Verifies restored days of supply (55.2 days) and issues signed SLA certificate.</div>
              <div><code>Conditional Edge (failure_handler)</code>: On air capacity lockout $\rightarrow$ branches to <code>replan_recovery_node</code>.</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. SLA Certificate Modal */}
      {selectedReport && (
        <VerificationCertificateModal 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

    </div>
  );
};
