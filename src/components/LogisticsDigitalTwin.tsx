import React from 'react';
import { 
  Building2, 
  Truck, 
  Plane, 
  Train, 
  Ship, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Leaf, 
  Layers, 
  TrendingDown, 
  ShieldCheck,
  Zap,
  MapPin,
  Anchor
} from 'lucide-react';
import { LogisticsDigitalTwinState, WarehouseInventory, LogisticsShipment, LogisticsVendor } from '../types';

interface Props {
  state: LogisticsDigitalTwinState;
  onSelectSku?: (sku: string) => void;
}

export const LogisticsDigitalTwin: React.FC<Props> = ({ state, onSelectSku }) => {
  const getTransportIcon = (mode: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stockout_imminent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" /> STOCKOUT IMMINENT
          </span>
        );
      case 'recovering':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Zap className="w-3 h-3 mr-1" /> RECOVERING
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3 h-3 mr-1" /> AT RISK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> HEALTHY
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Regional Warehouse Digital Twin */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base font-mono">Multi-Warehouse Inventory Digital Twin</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated inventory telemetry across 4 global fulfillment hubs & buffer nodes.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
              Total Hubs: 4
            </span>
            <span className="px-2.5 py-1 bg-blue-950 text-blue-300 rounded-lg border border-blue-800">
              Auto-Polling: 1.0s
            </span>
          </div>
        </div>

        {/* Warehouse Inventory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {state.inventory.map((inv) => {
            const isCritical = inv.status === 'stockout_imminent';
            const supplyPercent = Math.min(100, Math.round((inv.daysOfSupply / 30) * 100));

            return (
              <div 
                key={inv.id}
                onClick={() => onSelectSku && onSelectSku(inv.sku)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isCritical 
                    ? 'bg-rose-950/20 border-rose-500/50 hover:border-rose-400 shadow-lg shadow-rose-950/30' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[11px] font-mono font-semibold text-slate-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-blue-400 shrink-0" />
                      {inv.location}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 font-mono">{inv.sku}</div>
                    <div className="text-xs text-slate-300 line-clamp-1">{inv.productName}</div>
                  </div>
                  <div>{getStatusBadge(inv.status)}</div>
                </div>

                {/* Stock KPI Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">On-Hand / Avail</span>
                    <span className="font-bold text-white text-sm font-mono">
                      {inv.onHandStock} <span className="text-[10px] font-normal text-slate-400">({inv.availableStock})</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Daily Burn Rate</span>
                    <span className="font-bold text-amber-400 text-sm font-mono">{inv.dailyBurnRate}/day</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Days of Supply</span>
                    <span className={`font-bold text-sm font-mono ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {inv.daysOfSupply}d
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Lead Time</span>
                    <span className="font-bold text-slate-300 text-sm font-mono">{inv.primarySupplierLeadDays}d</span>
                  </div>
                </div>

                {/* Supply Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Stockout Buffer ({inv.daysOfSupply}d)</span>
                    <span className={isCritical ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {isCritical ? `Deficit: -${inv.stockoutGapDays}d` : 'Nominal'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isCritical ? 'bg-rose-500 animate-pulse' : inv.status === 'recovering' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(8, supplyPercent)}%` }}
                    />
                  </div>
                </div>

                {inv.inTransitStock > 0 && (
                  <div className="mt-2.5 p-1.5 bg-blue-950/40 border border-blue-800/60 rounded-lg text-[11px] text-blue-300 flex items-center justify-between font-mono">
                    <span className="flex items-center">
                      <Truck className="w-3 h-3 mr-1 text-blue-400" /> Inbound In-Transit:
                    </span>
                    <span className="font-bold text-white">+{inv.inTransitStock} Units</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Live Shipments in Transit & Certified Vendor Network */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active In-Transit Shipments */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base font-mono">In-Transit Freight & Route Tracking</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md">
              {state.shipments.length} Active Shipments
            </span>
          </div>

          <div className="space-y-3">
            {state.shipments.map((shp) => {
              const isDelayed = shp.status === 'delayed';

              return (
                <div 
                  key={shp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDelayed 
                      ? 'bg-amber-950/20 border-amber-500/40' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                          {getTransportIcon(shp.transportMode)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white font-mono">{shp.trackingNumber}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{shp.carrier} • {shp.sku} ({shp.quantity} Units)</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {isDelayed ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <AlertTriangle className="w-3 h-3 mr-1" /> DELAYED (+9d)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          <Clock className="w-3 h-3 mr-1" /> ON TIME ({shp.etaDays}d)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Origin -> Destination Route */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Origin</span>
                      <span className="text-slate-300 font-medium truncate block">{shp.origin}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Destination</span>
                      <span className="text-slate-300 font-medium truncate block">{shp.destination}</span>
                    </div>
                  </div>

                  {/* Delay notice if any */}
                  {shp.delayNotice && (
                    <div className="mt-2.5 p-2 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-300 flex items-start space-x-2">
                      <Anchor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-200">Berth Congestion Alert: </span>
                        <span>{shp.delayNotice}</span>
                      </div>
                    </div>
                  )}

                  {/* Metrics Footer */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                    <div className="flex items-center space-x-3">
                      <span>Freight Cost: <strong className="text-white">${shp.costUsd.toLocaleString()}</strong></span>
                      <span className="flex items-center text-emerald-400">
                        <Leaf className="w-3 h-3 mr-1" /> {shp.carbonEmissionKg} kg CO2
                      </span>
                    </div>
                    <div>
                      ETA: <strong className="text-white">{shp.etaDays} Days</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Certified Vendor Network */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base font-mono">Vendor Capacity & SLA Matrix</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
              {state.vendors.length} Vendors
            </span>
          </div>

          <div className="space-y-3">
            {state.vendors.map((vnd) => {
              const isBottlenecked = vnd.status === 'bottlenecked' || vnd.status === 'capacity_exceeded';
              const reliabilityPct = Math.round(vnd.reliabilityScore * 100);

              return (
                <div 
                  key={vnd.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isBottlenecked 
                      ? 'bg-rose-950/20 border-rose-500/40' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white font-mono">{vnd.name}</span>
                        {vnd.certified && (
                          <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                            CERTIFIED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Code: {vnd.code} • Origin: {vnd.originPort}
                      </div>
                    </div>
                    <div>
                      {isBottlenecked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded font-bold">
                          {vnd.status.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-bold">
                          AVAILABLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vendor Lead Time & Capacity Bar */}
                  <div className="grid grid-cols-3 gap-2 mt-2.5 text-[11px] font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Lead Time</span>
                      <span className={`font-bold ${isBottlenecked ? 'text-rose-400' : 'text-slate-200'}`}>
                        {vnd.standardLeadDays}d ({vnd.expediteLeadDays}d exp)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Reliability</span>
                      <span className="font-bold text-emerald-400">{reliabilityPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Unit Cost</span>
                      <span className="font-bold text-white">${vnd.unitCost}</span>
                    </div>
                  </div>

                  {vnd.statusReason && (
                    <div className="mt-2 text-[10px] text-slate-400 font-mono">
                      <span className="text-amber-400">Notice: </span>
                      {vnd.statusReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
