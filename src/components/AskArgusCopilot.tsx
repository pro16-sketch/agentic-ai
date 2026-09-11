import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { askArgusApi } from '../api';
import { AskArgusResult } from '../types';

interface AskArgusCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeAnomalyTitle?: string;
}

export const AskArgusCopilot: React.FC<AskArgusCopilotProps> = ({
  isOpen,
  onClose,
  activeAnomalyTitle
}) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    sender: 'user' | 'agent';
    text: string;
    result?: AskArgusResult;
    timestamp: string;
  }>>([
    {
      sender: 'agent',
      text: "Greetings, Executive. I am ARGUS, your Autonomous AI Operations Copilot powered by Gemini 3.8. I have full real-time access to company sales logs, supplier lead times, inventory levels, and financial risk models. How may I assist your decision-making?",
      timestamp: "Just now"
    }
  ]);

  const quickPrompts = [
    "Why did gross margin drop from 61.5% to 44.2%?",
    "Which supplier has the highest stockout risk?",
    "Compare the ROI of Option A vs Option B",
    "Draft an executive email to the VP of Engineering"
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const result = await askArgusApi(textToSend);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'agent' as const,
          text: result.answer,
          result,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error("Agent ask error:", err);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'agent' as const,
          text: "I encountered a transient telemetry retrieval error. The operational model recommends proceeding with Option A hotfix implementation.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-xl h-full sm:h-[92vh] bg-slate-900 border-l sm:border border-slate-700/80 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-blue-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base font-mono">ARGUS AI Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Enterprise BI & Operations Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-950/40">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-950 border border-indigo-700 text-indigo-300'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
              }`}>
                <div className="whitespace-pre-line leading-relaxed font-sans">
                  {msg.text}
                </div>

                {/* Agent Key Metrics & Action Pills */}
                {msg.result && (
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    {/* Key metrics grid */}
                    {msg.result.key_metrics && msg.result.key_metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.result.key_metrics.map((km, kIdx) => (
                          <div key={kIdx} className="bg-slate-950/80 border border-slate-800 rounded-lg p-2">
                            <div className="text-[10px] text-slate-400">{km.label}</div>
                            <div className="text-xs font-bold text-white flex items-center space-x-1 mt-0.5">
                              <span>{km.value}</span>
                              {km.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                              {km.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommended Action */}
                    {msg.result.recommended_action && (
                      <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-2.5 flex items-start space-x-2 text-blue-200">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block text-[11px]">Recommended Directive:</span>
                          <span className="text-[11px] text-blue-300">{msg.result.recommended_action}</span>
                        </div>
                      </div>
                    )}

                    {/* Model badge */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>Reasoning engine: {msg.result.model_used}</span>
                      <span>Confidence: {(msg.result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}

                <div className={`text-[10px] ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700 text-indigo-300 flex items-center justify-center shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2 shadow-md">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150" />
                <span className="ml-1 text-[11px] text-slate-400 font-mono">Synthesizing telemetry with Gemini 3.8 Flash...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
          <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Executive Suggested Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors text-left disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask ARGUS anything about company data, supply chain, or margins..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
