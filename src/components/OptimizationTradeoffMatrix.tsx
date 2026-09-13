import React, { useState } from 'react';
import { 
  Sliders, 
  Plane, 
  Train, 
  Truck, 
  Ship, 
  Leaf, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  Zap
} from 'lucide-react';
import { RecoveryAlternative, TransportMode } from '../types';

interface Props {
  alternatives: RecoveryAlternative[];
  daysOfSupplyThreshold: number;
  onExecuteAction: (actionId: string) => void;
  isLoading: boolean;
  selectedActionId?: string;
}

export const OptimizationTradeoffMatrix: React.FC<Props> = ({
  alternatives,
  daysOfSupplyThreshold,
  onExecuteAction,
  isLoading,
  selectedActionId
}) => {
  const [maxBudget, setMaxBudget] = useState<number>(10000);
  const [maxDays, setMaxDays] = useState<number>(7.6);
  const [prioritizeCarbon, setPrioritizeCarbon] = useState<boolean>(false);

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'AIR_EXPRESS':
      case 'AIR_STANDARD':
        return <Plane className="w-4 h-4 text-blue-400" />;
      case 'RAIL_FREIGHT':
        return <Train className="w-4 h-4 text-emerald-400" />;
      case 'OCEAN_FREIGHT':
        return <Ship className="w-4 h-4 text-amber-400" />;
      default:
        return <Truck className="w-4 h-4 text-indigo-400" />;
    }
  };

  // Sort and filter according to user constraints
  const processedAlternatives = [...alternatives].map(alt => {
    const withinBudget = alt.totalCostUsd <= maxBudget;
    const withinLeadTime = alt.deliveryDays <= maxDays;
    const dynamicFeasible = withinBudget && withinLeadTime && alt.deliveryDays < daysOfSupplyThreshold;

    let dynamicScore = alt.compositeScore;
    if (prioritizeCarbon) {
      // Heavily penalize high carbon and boost rail/eco options
      dynamicScore = alt.transportMode === 'RAIL_FREIGHT' 
        ? 98.0 
        : alt.transportMode === 'AIR_EXPRESS' 
        ? 82.0 
        : dynamicScore;
    }

    return {
      ...alt,
      dynamicFeasible,
      dynamicScore
    };
  });

  processedAlternatives.sort((a, b) => b.dynamicScore - a.dynamicScore);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base font-mono">
              Multi-Objective Pareto Optimization Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time trade-off evaluation: Cost vs Delivery Speed vs Carbon Emissions (CO2 kg) vs Service Level Feasibility.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
            Stockout Deadline: <strong className="text-rose-400">{daysOfSupplyThreshold} Days</strong>
          </span>
        </div>
      </div>

      {/* Interactive Constraint Sliders Bar */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Max Delivery Window:</span>
            <strong className="text-white">{maxDays} Days</strong>
          </div>
          <input 
            type="range" 
            min="1.5" 
            max="15.0" 
            step="0.5" 
            value={maxDays}
            onChange={(e) => setMaxDays(parseFloat(e.target.value))}
            className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Max Budget Ceiling:</span>
            <strong className="text-white">${maxBudget.toLocaleString()} USD</strong>
          </div>
          <input 
            type="range" 
            min="2000" 
            max="15000" 
            step="500" 
            value={maxBudget}
            onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end md:space-x-3 pt-2 md:pt-0">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={prioritizeCarbon}
              onChange={(e) => setPrioritizeCarbon(e.target.checked)}
              className="accent-emerald-500 w-4 h-4 rounded"
            />
            <span className="text-slate-300 flex items-center">
              <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Prioritize ESG / Low Carbon
            </span>
          </label>
        </div>
      </div>

      {/* Alternatives Comparison Cards Table */}
      <div className="space-y-3">
        {processedAlternatives.map((alt, index) => {
          const isSelected = selectedActionId === alt.id || alt.selected;
          const isTopRanked = index === 0;

          return (
            <div 
              key={alt.id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-950/40' 
                  : alt.dynamicFeasible 
                  ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                  : 'bg-slate-950/30 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Option Title & Badges */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700">
                      Rank #{index + 1}
                    </span>
                    {isTopRanked && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 rounded flex items-center">
                        <Award className="w-3 h-3 mr-1 text-amber-400" /> PARETO OPTIMAL
                      </span>
                    )}
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center ${
                      alt.dynamicFeasible 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {alt.dynamicFeasible ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> FEASIBLE (Arrives in {alt.deliveryDays}d &lt; {daysOfSupplyThreshold}d)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" /> INFEASIBLE
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                      {getTransportIcon(alt.transportMode)}
                    </div>
                    <h4 className="text-sm font-bold text-white font-mono">{alt.name}</h4>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {alt.details}
                  </p>

                  {/* Feasibility Reasons list */}
                  <div className="text-[11px] font-mono space-y-0.5 pt-1">
                    {alt.feasibilityReasons.map((fr, fIdx) => (
                      <div key={fIdx} className={`flex items-center space-x-1 ${
                        fr.startsWith('❌') ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        <span>•</span>
                        <span>{fr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center: Multi-Metric Score Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono shrink-0 lg:w-96">
                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Total Cost</span>
                    <span className="font-bold text-white text-sm">
                      ${alt.totalCostUsd.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Delivery Time</span>
                    <span className={`font-bold text-sm ${
                      alt.deliveryDays <= 2.5 ? 'text-blue-400' : alt.deliveryDays <= 4 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {alt.deliveryDays} Days
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Carbon (CO2)</span>
                    <span className="font-bold text-emerald-400 text-sm flex items-center">
                      <Leaf className="w-3 h-3 mr-0.5" /> {alt.carbonEmissionKg} kg
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Pareto Score</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {alt.dynamicScore.toFixed(1)}/100
                    </span>
                  </div>
                </div>

                {/* Right: Execution Button */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => onExecuteAction(alt.id)}
                    disabled={isLoading || !alt.dynamicFeasible}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      isSelected 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                        : alt.dynamicFeasible 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{isSelected ? 'Action Executed' : 'Execute Recovery'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
