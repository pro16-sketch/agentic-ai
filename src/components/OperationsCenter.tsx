import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  RotateCcw, 
  Sliders, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  Filter,
  Info,
  ChevronRight,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight
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
  Cell 
} from 'recharts';
import { BusinessMetrics, ScenarioSimulationResult, ProductMetric } from '../types';
import { runSimulation } from '../api';

interface OperationsCenterProps {
  metrics: BusinessMetrics;
  onGoToIncident: () => void;
}

export const OperationsCenter: React.FC<OperationsCenterProps> = ({
  metrics,
  onGoToIncident
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interactive Perspective Switcher:
  // 'live' = actual backend current state
  // 'initial' = crisis state (14.8% return rate, critical stock)
  // 'final' = resolved state (2.1% return rate, restocked)
  // 'delta' = side-by-side comparison
  const [viewPerspective, setViewPerspective] = useState<'live' | 'initial' | 'final' | 'delta'>('live');

  // Interactive Timeline Milestone Selection
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  // Interactive Product Drilldown Modal
  const [inspectingProduct, setInspectingProduct] = useState<ProductMetric | null>(null);

  // Interactive Simulation State
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [recoveryRatePct, setRecoveryRatePct] = useState<number>(65);
  const [expediteCost, setExpediteCost] = useState<number>(3500);
  const [reorderQty, setReorderQty] = useState<number>(200);
  const [simResult, setSimResult] = useState<ScenarioSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSim = async () => {
      setIsSimulating(true);
      try {
        const res = await runSimulation({
          price_change_pct: priceChangePct,
          recovery_rate_pct: recoveryRatePct,
          expedite_cost: expediteCost,
          reorder_qty: reorderQty
        });
        if (isMounted) setSimResult(res);
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        if (isMounted) setIsSimulating(false);
      }
    };

    fetchSim();
    return () => { isMounted = false; };
  }, [priceChangePct, recoveryRatePct, expediteCost, reorderQty]);

  // Compute active metrics based on chosen interactive perspective
  const isInitial = viewPerspective === 'initial';
  const isFinal = viewPerspective === 'final';

  const activeRevenue = isInitial ? 48500 : isFinal ? 64200 : metrics.total_revenue;
  const activeProfit = isInitial ? 20400 : isFinal ? 39800 : metrics.total_profit;
  const activeMargin = isInitial ? 42.1 : isFinal ? 62.0 : metrics.gross_margin_pct;
  const activeReturnRate = isInitial ? 14.8 : isFinal ? 2.1 : metrics.overall_return_rate_pct;
  const activeInventoryValue = isInitial ? 28400 : isFinal ? 51400 : metrics.total_inventory_value;
  const activeLowStock = isInitial ? 1 : isFinal ? 0 : metrics.low_stock_skus;
  const activeAnomalies = isInitial ? 1 : isFinal ? 0 : metrics.active_anomalies;

  // Milestone definitions for timeline narrative
  const milestones = [
    {
      id: 1,
      date: "Day 0 - Baseline",
      title: "Normal Baseline Operations",
      status: "Healthy",
      desc: "Healthy baseline return rate at 2.1% and steady gross revenue.",
      revenue: "$48,500",
      returnRate: "2.1%"
    },
    {
      id: 2,
      date: "Day 14 - Outbreak",
      title: "Firmware v2.4 Release Spikes Returns",
      status: "Crisis Outbreak",
      desc: "OTA update introduced BLE audio buffer memory leak. Returns skyrocketed to 14.8%.",
      revenue: "$37,200",
      returnRate: "14.8%"
    },
    {
      id: 3,
      date: "Day 16 - ARGUS Agent",
      title: "ARGUS Autonomous Root-Cause Isolation",
      status: "Investigation",
      desc: "Agent analyzed 1,240 crash dumps with 92% confidence and drafted 3 recovery plans.",
      revenue: "$38,100",
      returnRate: "14.8%"
    },
    {
      id: 4,
      date: "Day 18 - Resolution",
      title: "Hotfix v2.4.1 Deployed & Air-Freight Arrived",
      status: "Recovered",
      desc: "Returns plunged back to 2.1%. Saved $46,200 in net revenue with zero stockout.",
      revenue: "$64,200",
      returnRate: "2.1%"
    }
  ];

  const filteredProducts = metrics.products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Interactive Perspective & Scenario Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Interactive Data Lens:</span>
            </span>
            <span className="text-xs text-slate-400">Toggle between operational states to see before-and-after numbers</span>
          </div>
        </div>

        {/* 4 Interactive Toggle Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setViewPerspective('live')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              viewPerspective === 'live'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡ Live Production</span>
          </button>
          
          <button
            onClick={() => setViewPerspective('initial')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              viewPerspective === 'initial'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔴 Initial Crisis</span>
          </button>

          <button
            onClick={() => setViewPerspective('final')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              viewPerspective === 'final'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🟢 Final Restored</span>
          </button>

          <button
            onClick={() => setViewPerspective('delta')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              viewPerspective === 'delta'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚖️ Initial vs. Final Delta</span>
          </button>
        </div>
      </div>

      {/* Delta Comparison Banner when 'delta' is selected */}
      {viewPerspective === 'delta' && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">⚖️</span>
              <span>Executive Differential: Initial Crisis vs. Final Restored State</span>
            </h3>
            <span className="text-xs text-indigo-300 font-mono font-bold bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-800">
              Net Impact: +$46,200 Recovered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Overall Return Rate</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xs line-through text-rose-400 font-mono">14.8%</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">2.1%</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">▼ 85.8% drop (BLE bug fixed)</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Monthly Return Loss</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xs line-through text-amber-400 font-mono">-$38,400</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">+$46,200</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">▲ 5.5x ROI on $8.4k budget</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Nexus Watch Stock</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xs line-through text-rose-400 font-mono">32 units (7d)</span>
                <span className="text-xl font-bold text-indigo-400 font-mono">232 units</span>
              </div>
              <div className="text-[11px] text-indigo-300 mt-1 font-semibold">▲ 45 days of supply secured</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Profit Margin</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xs line-through text-slate-400 font-mono">42.1%</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">61.4%</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-semibold">▲ 19.3% margin expansion</div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Top-Level Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${activeRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{isInitial ? '-18.4% crisis dip' : '+18.2% rebound'}</span>
            </div>
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${activeProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2 font-medium">
              <span className="font-semibold text-emerald-400 font-mono">{activeMargin}%</span>
              <span>Profit Margin</span>
            </div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warehouse Assets</span>
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">
              ${activeInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2">
              <span className={`font-semibold ${activeLowStock > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {activeLowStock} Low Stock SKU{activeLowStock !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Return Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Return Rate</span>
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-mono ${activeReturnRate > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeReturnRate}%
            </div>
            <div className="flex items-center space-x-1.5 text-xs mt-2">
              {activeAnomalies > 0 ? (
                <button
                  onClick={onGoToIncident}
                  className="text-amber-400 hover:underline flex items-center space-x-1 font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{activeAnomalies} Anomaly Detected →</span>
                </button>
              ) : (
                <span className="text-emerald-400 flex items-center space-x-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All thresholds healthy</span>
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Visualizers: Financial Trend with Interactive Milestone Pins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue vs Profit Chart with Milestones */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Operational & Financial Trajectory</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Interactive Timeline
                </span>
              </h3>
              <p className="text-xs text-slate-400">Click any milestone pin below to view operational events at that point</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Revenue</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">Net Profit</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthly_revenue_trend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 4 Interactive Clickable Timeline Milestone Pins */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            {milestones.map((m) => {
              const isSelected = selectedMilestone === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMilestone(isSelected ? null : m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 font-mono">{m.date}</div>
                  <div className="text-xs font-semibold text-white truncate mt-0.5">{m.title}</div>
                  <div className="flex items-center justify-between text-[10px] mt-1">
                    <span className={m.returnRate === '14.8%' ? 'text-rose-400' : 'text-emerald-400'}>
                      Ret: {m.returnRate}
                    </span>
                    <span className="text-slate-400">{m.revenue}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Milestone Context Drawer */}
          {selectedMilestone && (
            <div className="p-3.5 bg-blue-950/30 border border-blue-800/50 rounded-xl text-xs text-slate-300 flex items-start justify-between space-x-3 animate-fadeIn">
              <div>
                <strong className="text-white block font-semibold mb-0.5">
                  {milestones.find(m => m.id === selectedMilestone)?.title}
                </strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {milestones.find(m => m.id === selectedMilestone)?.desc}
                </p>
              </div>
              <button 
                onClick={() => setSelectedMilestone(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Return Reasons Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white">Return Reasons Breakdown</h3>
              <span className="text-[10px] text-slate-400 font-mono">Live Telemetry</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Customer warranty claims categorized</p>
            
            <div className="space-y-3">
              {metrics.return_reasons_breakdown.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-200 truncate">{item.reason}</span>
                    <span className="font-mono text-rose-400 font-bold">{item.count} returns</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.reason.includes('Bluetooth') ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, item.count * 20)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-200">Incident Connection:</strong> When incident was resolved, firmware Bluetooth failures dropped by 85%.
          </div>
        </div>

      </div>

      {/* Interactive Catalog & Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>SKU Inventory & Health Directory</span>
              <span className="text-xs text-slate-400 font-normal">({filteredProducts.length} items)</span>
            </h3>
            <p className="text-xs text-slate-400">Click any product row to open detailed SKU telemetry</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by SKU, name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Name / SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Cost</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Return Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => {
                const isAnomaly = isInitial && p.id === 1 ? true : p.has_anomaly;
                const displayReturnRate = isInitial && p.id === 1 ? 14.8 : isFinal && p.id === 1 ? 2.1 : p.return_rate_pct;
                const displayStock = isFinal && p.id === 2 ? 232 : p.stock_level;

                return (
                  <tr 
                    key={p.id}
                    onClick={() => setInspectingProduct(p)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-slate-200">${p.price.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">Cost: ${p.cost.toFixed(2)}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`font-semibold ${displayStock <= p.min_reorder_point ? 'text-rose-400' : 'text-slate-200'}`}>
                        {displayStock} units
                      </span>
                      {displayStock <= p.min_reorder_point && (
                        <div className="text-[10px] text-rose-400 font-sans">Low stock</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`font-semibold ${displayReturnRate > 5.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {displayReturnRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isAnomaly ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Anomaly</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Nominal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-blue-400 group-hover:underline text-[11px] inline-flex items-center space-x-1">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Product Drilldown Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  {inspectingProduct.sku}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{inspectingProduct.name}</h3>
                <p className="text-xs text-slate-400">{inspectingProduct.category}</p>
              </div>
              <button 
                onClick={() => setInspectingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Current Stock</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {inspectingProduct.stock_level} units
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Safety reorder point: {inspectingProduct.min_reorder_point}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Return Rate Telemetry</div>
                <div className={`text-base font-bold font-mono mt-0.5 ${inspectingProduct.return_rate_pct > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {inspectingProduct.return_rate_pct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Category benchmark: 2.5%
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <strong className="text-white block">Incident Context:</strong>
              {inspectingProduct.id === 1 ? (
                <p className="text-slate-400 leading-relaxed">
                  Aura Sound Pro was the primary anomaly center. A memory leak in OTA Firmware v2.4 caused severe audio dropouts and inflated return claims. Resolved via emergency Hotfix v2.4.1.
                </p>
              ) : inspectingProduct.id === 2 ? (
                <p className="text-slate-400 leading-relaxed">
                  Nexus Watch Ultra 2 faced imminent stockout threat (32 units left) due to overseas shipping delays. Resolved via authorized expedited air-freight reorder of 200 units.
                </p>
              ) : (
                <p className="text-slate-400 leading-relaxed">
                  This SKU maintains stable operational performance with zero critical alerts and healthy supply buffers.
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setInspectingProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Close
              </button>
              {inspectingProduct.has_anomaly && (
                <button
                  onClick={() => {
                    setInspectingProduct(null);
                    onGoToIncident();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
                >
                  <span>Resolve in Incident Flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive What-If Scenario Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive What-If Scenario Modeler</h3>
              <p className="text-xs text-slate-400">Simulate pricing adjustments, refund recovery rates, and supply expedite options</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Real-time Simulation Engine:</span>
            <span className="text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Active
            </span>
          </div>
        </div>

        {/* 4 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Slider 1: Price Adjustment */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Price Adjustment</span>
              <span className="font-mono text-blue-400 font-bold">{priceChangePct > 0 ? `+${priceChangePct}` : priceChangePct}%</span>
            </div>
            <input 
              type="range" 
              min="-20" 
              max="20" 
              step="5"
              value={priceChangePct}
              onChange={(e) => setPriceChangePct(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-20% (Discount)</span>
              <span>+20% (Premium)</span>
            </div>
          </div>

          {/* Slider 2: Recovery Rate */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Return Recovery %</span>
              <span className="font-mono text-emerald-400 font-bold">{recoveryRatePct}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="95" 
              step="5"
              value={recoveryRatePct}
              onChange={(e) => setRecoveryRatePct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20% (Low retention)</span>
              <span>95% (High retention)</span>
            </div>
          </div>

          {/* Slider 3: Expedite Cost */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Expedite Shipping</span>
              <span className="font-mono text-amber-400 font-bold">${expediteCost.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="10000" 
              step="500"
              value={expediteCost}
              onChange={(e) => setExpediteCost(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$1,000 (Standard)</span>
              <span>$10,000 (Air charter)</span>
            </div>
          </div>

          {/* Slider 4: Reorder Qty */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Reorder Quantity</span>
              <span className="font-mono text-indigo-400 font-bold">{reorderQty} units</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="500" 
              step="25"
              value={reorderQty}
              onChange={(e) => setReorderQty(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>50 units</span>
              <span>500 units</span>
            </div>
          </div>

        </div>

        {/* Dynamic Simulation Output Metrics */}
        {simResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Projected Revenue</div>
              <div className="text-xl font-bold text-blue-400 font-mono mt-1">
                ${simResult.projected_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Implementation Cost</div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                ${simResult.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Net Financial Gain</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                +${simResult.net_gain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Stockout Risk Reduction</div>
              <div className="text-xl font-bold text-indigo-400 font-mono mt-1">
                {simResult.stockout_risk_reduction_pct}% Risk Drop
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
