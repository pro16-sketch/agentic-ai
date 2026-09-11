import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
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
  Bar 
} from 'recharts';
import { BusinessMetrics } from '../types';

interface BusinessOverviewProps {
  metrics: BusinessMetrics;
  onInvestigateAnomaly: () => void;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({
  metrics,
  onInvestigateAnomaly
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert (If Active Anomaly Exists) */}
      {metrics.active_anomalies > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-800/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-900/40 border border-amber-700/50 rounded-xl text-amber-400 shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-base">Active Business Anomaly Flagged</h3>
                <span className="bg-amber-900/60 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-700 font-mono">
                  Severity 8.7/10
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                ARGUS detected a <strong className="text-amber-300">14.8% return rate spike</strong> on <em>Aura Sound Pro ANC Headphones</em> following firmware v2.4, alongside an impending stockout risk on <em>Nexus SmartWatch Ultra 2</em> due to supplier lead time expansion.
              </p>
            </div>
          </div>
          <button
            onClick={onInvestigateAnomaly}
            className="shrink-0 flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Launch Agent Investigation</span>
          </button>
        </div>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-blue-950/60 border border-blue-800/50 rounded-lg text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-white font-mono">
              ${metrics.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Profit</span>
            <div className="p-2 bg-emerald-950/60 border border-emerald-800/50 rounded-lg text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-white font-mono">
              ${metrics.total_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2">
              <span className="font-semibold text-emerald-400">{metrics.gross_margin_pct}%</span>
              <span>Net Gross Margin</span>
            </div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inventory Assets</span>
            <div className="p-2 bg-indigo-950/60 border border-indigo-800/50 rounded-lg text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-white font-mono">
              ${metrics.total_inventory_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 mt-2 font-medium">
              <span>{metrics.low_stock_skus} Low Stock SKUs</span>
            </div>
          </div>
        </div>

        {/* Return Rate */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Return Rate</span>
            <div className="p-2 bg-rose-950/60 border border-rose-800/50 rounded-lg text-rose-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-white font-mono">
              {metrics.overall_return_rate_pct}%
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-rose-400 mt-2 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Spike detected in Audio category</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue vs Profit Chart */}
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white text-base">Financial Trajectory</h3>
              <p className="text-xs text-slate-400">Monthly Gross Revenue vs Net Profit performance</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span className="text-slate-300">Revenue</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-300">Profit</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthly_revenue_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Return Reasons Breakdown */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="mb-4">
            <h3 className="font-semibold text-white text-base">Return Root Causes</h3>
            <p className="text-xs text-slate-400">Categorized customer return feedback</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.return_reasons_breakdown} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="reason" type="category" stroke="#94A3B8" fontSize={10} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Relatable Product Inventory & Anomaly Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="font-semibold text-white text-base">Product Inventory & Anomaly Telemetry</h3>
            <p className="text-xs text-slate-400">Real-time SKU performance, stock status, and return rates</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {metrics.products.length} Core Enterprise SKUs
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Return Rate</th>
                <th className="py-3 px-4 text-right">ARGUS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metrics.products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-900/60 transition-colors">
                  
                  {/* Product Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="font-medium text-white text-sm">{product.name}</div>
                        <div className="text-xs font-mono text-slate-400">{product.sku}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-xs text-slate-400 font-medium">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* Stock Level */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono text-sm font-semibold ${
                        product.stock_level <= product.min_reorder_point ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {product.stock_level} units
                      </span>
                      {product.stock_level <= product.min_reorder_point && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded font-mono">
                          Reorder
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Return Rate */}
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-sm font-semibold ${
                      product.return_rate_pct > 10.0 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {product.return_rate_pct.toFixed(1)}%
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-right">
                    {product.has_anomaly ? (
                      <span className="inline-flex items-center space-x-1 bg-rose-950/80 text-rose-300 border border-rose-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>Anomaly Flagged</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Healthy</span>
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
