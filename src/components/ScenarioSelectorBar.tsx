import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  RotateCw, 
  Sparkles, 
  Radio, 
  ChevronDown,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ScenarioSelectorBarProps {
  onSelectScenario: (scenarioKey: string, customPrompt?: string) => Promise<void>;
  isLoading: boolean;
  activeScenarioName?: string;
}

export const ScenarioSelectorBar: React.FC<ScenarioSelectorBarProps> = ({
  onSelectScenario,
  isLoading,
  activeScenarioName = "Firmware BLE Memory Leak"
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const scenarios = [
    {
      id: 'firmware_leak',
      title: 'Aura Sound Pro: BLE Firmware Memory Leak',
      shortTitle: 'Firmware Leak',
      category: 'Audio Regression',
      badge: '14.8% Returns',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: Flame
    },
    {
      id: 'supplier_bottleneck',
      title: 'Nexus Watch: Global Microelectronics Port Bottleneck',
      shortTitle: 'Supplier Bottleneck',
      category: 'Supply Chain',
      badge: '7.6d Stockout',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Clock
    },
    {
      id: 'viral_defect',
      title: 'Vortex Keyboard: Viral Switch Chatter Defect',
      shortTitle: 'Social Outcry',
      category: 'Defect Outbreak',
      badge: '+340% Claims',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: Radio
    }
  ];

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isLoading) return;
    await onSelectScenario('custom', customPrompt.trim());
    setIsCustomOpen(false);
    setCustomPrompt('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Label & Active Scenario Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Scenario Injector:
              </span>
              <span className="text-[11px] text-amber-300 font-medium">
                {activeScenarioName}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Select a crisis simulation to test ARGUS's autonomous reasoning in real-time
            </p>
          </div>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isCurrent = activeScenarioName.includes(sc.shortTitle);
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                disabled={isLoading}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50 border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
                title={sc.title}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sc.shortTitle}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border ${sc.badgeColor}`}>
                  {sc.badge}
                </span>
              </button>
            );
          })}

          {/* Custom Incident Prompt Button */}
          <button
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Custom Crisis...</span>
          </button>
        </div>

      </div>

      {/* Custom Prompt Drawer */}
      {isCustomOpen && (
        <form onSubmit={handleCustomSubmit} className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2 animate-fadeIn">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Type any operational disaster (e.g. 'European warehouse customs audit holding 500 SSD units')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-md shadow-indigo-600/30"
          >
            {isLoading ? "Injecting..." : "Simulate Crisis"}
          </button>
        </form>
      )}
    </div>
  );
};
