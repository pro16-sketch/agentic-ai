import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  BarChart2,
  Sparkles
} from 'lucide-react';
import { InvestigationDetails, Decision, ScenarioSimulationResult } from '../types';
import { runSimulation } from '../api';

interface DecisionCenterProps {
  investigation: InvestigationDetails | null;
  onSelectStrategy: (decision: Decision) => void;
}

export const DecisionCenter: React.FC<DecisionCenterProps> = ({
  investigation,
  onSelectStrategy
}) => {
  // Scenario Simulation Sliders State
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [recoveryRatePct, setRecoveryRatePct] = useState<number>(65);
  const [expediteCost, setExpediteCost] = useState<number>(3500);
  const [reorderQty, setReorderQty] = useState<number>(200);

  const [simResult, setSimResult] = useState<ScenarioSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Trigger scenario simulation whenever parameters change
  useEffect(() => {
    const fetchSim = async () => {
      setIsSimulating(true);
      try {
        const res = await runSimulation({
          price_change_pct: priceChangePct,
          recovery_rate_pct: recoveryRatePct,
          expedite_cost: expediteCost,
          reorder_qty: reorderQty
        });
        setSimResult(res);
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        setIsSimulating(false);
      }
    };

    fetchSim();
  }, [priceChangePct, recoveryRatePct, expediteCost, reorderQty]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">ARGUS Strategy & Decision Simulation Center</h2>
            <p className="text-xs text-slate-400">Evaluate synthesized strategic options and run interactive financial simulations</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Strategic Options (Left) + Interactive Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Strategy Options List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Synthesized Strategic Options</h3>
            <span className="text-xs text-slate-400 font-mono">Select a strategy to proceed to approval</span>
          </div>

          {investigation && investigation.decisions ? (
            <div className="space-y-4">
              {investigation.decisions.map((decision) => (
                <div 
                  key={decision.id}
                  className={`bg-slate-950/80 border rounded-2xl p-5 shadow-lg transition-all space-y-4 hover:border-blue-700/60 ${
                    decision.strategy_type === 'Balanced'
                      ? 'border-blue-600/80 bg-blue-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          decision.strategy_type === 'Balanced'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : decision.strategy_type === 'Conservative'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {decision.strategy_type} Strategy
                        </span>
                        {decision.strategy_type === 'Balanced' && (
                          <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-800 font-mono">
                            Recommended
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white mt-2">{decision.title}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold font-mono text-emerald-400">{decision.projected_roi}x</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Projected ROI</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                    {decision.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Est. Implementation Cost</span>
                      <span className="text-slate-200 font-bold">${decision.estimated_cost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Projected Revenue Recovered</span>
                      <span className="text-emerald-400 font-bold">${decision.projected_revenue_impact.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Risk Assessment</span>
                      <span className={`font-bold ${
                        decision.risk_level === 'Low' ? 'text-emerald-400' : decision.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {decision.risk_level} Risk
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onSelectStrategy(decision)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all"
                    >
                      <span>Authorize Strategy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              Run an investigation first to synthesize decision strategies.
            </div>
          )}
        </div>

        {/* Interactive Scenario Parameter Simulator (1 Col) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Interactive What-If Simulator</h3>
          </div>

          {/* Parameter Sliders */}
          <div className="space-y-4 text-xs">
            
            {/* Price Change % */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-slate-300">SKU Price Adjustment %</span>
                <span className="font-mono text-blue-400 font-bold">{priceChangePct > 0 ? `+${priceChangePct}` : priceChangePct}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={priceChangePct}
                onChange={(e) => setPriceChangePct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Return Recovery Rate % */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-slate-300">Customer Return Recovery Rate %</span>
                <span className="font-mono text-emerald-400 font-bold">{recoveryRatePct}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={recoveryRatePct}
                onChange={(e) => setRecoveryRatePct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Expedited Freight Cost */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-slate-300">Expedited Freight Budget</span>
                <span className="font-mono text-amber-400 font-bold">${expediteCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={expediteCost}
                onChange={(e) => setExpediteCost(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Reorder Quantity */}
            <div>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-slate-300">Replenishment Reorder Units</span>
                <span className="font-mono text-indigo-400 font-bold">{reorderQty} units</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={reorderQty}
                onChange={(e) => setReorderQty(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

          </div>

          {/* Simulation Output Cards */}
          {simResult && (
            <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Revenue:</span>
                  <span className="text-emerald-400 font-bold">${simResult.projected_revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Strategy Cost:</span>
                  <span className="text-rose-400 font-bold">${simResult.total_cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2">
                  <span className="text-slate-300 font-bold">Simulated Net ROI:</span>
                  <span className="text-blue-400 font-extrabold text-sm">{simResult.simulated_roi}x</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60 flex items-center justify-between text-emerald-300">
                <span>Stockout Risk Reduction:</span>
                <span className="font-bold">{simResult.stockout_risk_reduction_pct}%</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
