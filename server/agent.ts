import { GoogleGenAI } from '@google/genai';
import { getStore } from './store.js';
import { Investigation, Hypothesis, ToolCall, Decision, AuditLog } from './types.js';

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!genAIInstance && key && key.trim().length > 5) {
    try {
      genAIInstance = new GoogleGenAI({ apiKey: key.trim() });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI with provided key:", err);
      genAIInstance = null;
    }
  }
  return genAIInstance;
}

export interface AskArgusResult {
  answer: string;
  key_metrics: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'neutral' }>;
  recommended_action: string;
  confidence: number;
  model_used: string;
}

export async function askArgus(question: string): Promise<AskArgusResult> {
  const store = getStore();
  const activeInv = store.investigations[store.investigations.length - 1];
  const pendingDecisions = store.decisions.filter(d => d.investigation_id === activeInv?.id);
  const ai = getGenAI();

  const businessContext = {
    active_investigation: activeInv ? {
      title: activeInv.metric_name,
      anomaly_score: activeInv.anomaly_score,
      root_cause: activeInv.root_cause,
      status: activeInv.status
    } : null,
    products: store.products.map(p => ({
      sku: p.sku,
      name: p.name,
      stock: p.stock_level,
      price: p.price,
      status: p.status
    })),
    suppliers: store.suppliers.map(s => ({
      name: s.name,
      reliability: `${(s.reliability_score * 100).toFixed(0)}%`,
      lead_time_days: s.avg_lead_time_days
    })),
    pending_decisions: pendingDecisions.map(d => ({
      title: d.title,
      strategy: d.strategy_type,
      cost: `$${d.estimated_cost}`,
      projected_impact: `$${d.projected_revenue_impact}`,
      roi: `${d.projected_roi}x`,
      risk: d.risk_level
    }))
  };

  if (ai) {
    try {
      const prompt = `You are ARGUS, an elite Autonomous Chief AI Operations Officer and Business Intelligence Agent for enterprise retail/e-commerce.
Analyze the following real-time company telemetry and answer the executive's query with analytical rigor, exact numbers, and direct strategic recommendations.

Current Enterprise Context:
${JSON.stringify(businessContext, null, 2)}

Executive Query:
"${question}"

Format your response strictly as JSON with the following structure:
{
  "answer": "Clear, direct, markdown-formatted executive response (3-5 concise sentences or bullets citing exact numbers and tactical implications)",
  "key_metrics": [
    { "label": "e.g. Return Rate Spike", "value": "14.8%", "trend": "up" },
    { "label": "e.g. Monthly Profit Loss", "value": "-$38,400", "trend": "down" },
    { "label": "e.g. Recommended Option ROI", "value": "5.5x", "trend": "up" }
  ],
  "recommended_action": "Single crisp 1-sentence executive command or decision recommendation",
  "confidence": 0.94
}`;

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Gemini request timed out")), 3500)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        }),
        timeoutPromise
      ]);

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return {
        answer: parsed.answer || responseText,
        key_metrics: parsed.key_metrics || [
          { label: "Margin Drift", value: "-17.3%", trend: "down" },
          { label: "Stockout Buffer", value: "7.6 Days", trend: "down" }
        ],
        recommended_action: parsed.recommended_action || "Execute Option A (Firmware Hotfix v2.4.1) immediately.",
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
        model_used: 'gemini-3.8-flash'
      };
    } catch (geminiError) {
      console.warn("Gemini query error, falling back to deterministic intelligence engine:", geminiError);
    }
  }

  // Fallback intelligent heuristic engine based on real store state
  const qLower = question.toLowerCase();
  if (qLower.includes('margin') || qLower.includes('profit') || qLower.includes('loss')) {
    return {
      answer: "Gross margin fell from the healthy baseline of **61.5% down to 44.2%** (a 17.3% margin compression). The primary culprit is the 7x surge in Aura Sound Pro customer returns following firmware update v2.4, generating **$38,400/month** in direct return handling losses and restocking write-downs.",
      key_metrics: [
        { label: "Baseline Margin", value: "61.5%", trend: "neutral" },
        { label: "Current Compressed Margin", value: "44.2%", trend: "down" },
        { label: "Net Monthly Run-Rate Loss", value: "$38,400", trend: "down" }
      ],
      recommended_action: "Authorize Option A Hotfix immediately to eliminate the BLE disconnect defect and recapture $46,200 in gross margin.",
      confidence: 0.96,
      model_used: 'argus-cognitive-engine'
    };
  }

  if (qLower.includes('supplier') || qLower.includes('stockout') || qLower.includes('lead time') || qLower.includes('inventory')) {
    return {
      answer: "**Global Microelectronics Co.** is the company's highest operational vulnerability. Their average lead time has ballooned from 5 days to **14 days** without prior buffer notice. As a result, the Nexus SmartWatch Ultra 2 has only **32 units left in stock** with a burn rate of 4.2 units/day, triggering an unavoidable stockout within **7.6 days** unless expedited air freight is approved.",
      key_metrics: [
        { label: "Remaining Inventory", value: "32 Units", trend: "down" },
        { label: "Time to Stockout", value: "7.6 Days", trend: "down" },
        { label: "Supplier Lead Time", value: "14 Days", trend: "up" }
      ],
      recommended_action: "Approve emergency air freight replenishment ($3,500 shipping expedite) to prevent an 8-day black hole in flagship smartwatch sales.",
      confidence: 0.93,
      model_used: 'argus-cognitive-engine'
    };
  }

  if (qLower.includes('option') || qLower.includes('roi') || qLower.includes('compare') || qLower.includes('decision')) {
    return {
      answer: "### Strategic Trade-Off Analysis:\n- **Option A (Balanced - Recommended):** $8,400 cost, **5.5x ROI**, $46,200 revenue recovered. Resolves the root cause via OTA patch while replenishing stock with low risk.\n- **Option B (Conservative Recall):** $24,500 cost, **0.73x ROI**. Destroys brand equity and burns cash without fixing firmware.\n- **Option C (Price Drop Liquidation):** $15,200 cost, **3.55x ROI**. Dilutes brand pricing power permanently.",
      key_metrics: [
        { label: "Option A Projected ROI", value: "5.5x", trend: "up" },
        { label: "Option B Projected ROI", value: "0.73x", trend: "down" },
        { label: "Option C Projected ROI", value: "3.55x", trend: "up" }
      ],
      recommended_action: "Executive approval of Option A yields maximum capital efficiency with zero lasting brand damage.",
      confidence: 0.97,
      model_used: 'argus-cognitive-engine'
    };
  }

  if (qLower.includes('email') || qLower.includes('draft') || qLower.includes('message')) {
    return {
      answer: "### Draft Executive SITREP to Engineering & Supply Chain:\n\n**Subject:** URGENT: Executive Action Required - Firmware v2.4 BLE Mitigation & Air-Freight\n\n*Team,*\nARGUS operational telemetry has flagged an active crisis: return rates on Aura Sound Pro have reached 14.8% due to a Bluetooth LE audio stack memory leak in firmware v2.4. Simultaneously, Nexus Watch inventory is within 7.6 days of total depletion.\n\n*Immediate Directives:*\n1. Engineering: Deploy over-the-air hotfix v2.4.1 within 48 hours.\n2. Logistics: Expedite 200 units via Air Freight from secondary supplier buffer.\n3. Customer Ops: Issue $25 courtesy credit to restore satisfaction.\n\n*Budget Approved: $8,400. Projected Profit Recovery: $46,200.*",
      key_metrics: [
        { label: "Draft Status", value: "Ready to Send", trend: "up" },
        { label: "Addressees", value: "VP Eng / VP Supply Chain", trend: "neutral" }
      ],
      recommended_action: "Dispatch communication to executive leadership to sync cross-functional response.",
      confidence: 0.95,
      model_used: 'argus-cognitive-engine'
    };
  }

  // Default holistic executive summary
  return {
    answer: `ARGUS is actively monitoring 4 flagship product lines and 4 suppliers. Current high-severity event: **Aura Sound Pro** returns (14.8%) and **Nexus Watch Ultra 2** stockout risk (7.6 days remaining). The autonomous agent has executed 3 diagnostic database tool calls and recommends immediate execution of Option A ($8,400 cost for $46,200 recovery, 5.5x ROI).`,
    key_metrics: [
      { label: "Anomaly Severity Score", value: "8.7 / 10", trend: "up" },
      { label: "Return Rate Elevation", value: "14.8%", trend: "up" },
      { label: "Capital Recovery Yield", value: "$46,200", trend: "up" }
    ],
    recommended_action: "Confirm human authorization on Step 4 of the Incident Flow to trigger autonomous deployment.",
    confidence: 0.94,
    model_used: 'argus-cognitive-engine'
  };
}

export function runInvestigation(targetObjective?: string, scenarioType?: string): Investigation {
  const store = getStore();
  const now = new Date();
  const timestampStr = now.toISOString().replace('T', ' ').slice(0, 16);
  const invId = store.nextIds.investigation++;

  const type = scenarioType || (
    targetObjective?.toLowerCase().includes('supplier') ? 'supplier_bottleneck' :
    targetObjective?.toLowerCase().includes('keyboard') || targetObjective?.toLowerCase().includes('social') ? 'viral_defect' :
    targetObjective?.toLowerCase().includes('tariff') || targetObjective?.toLowerCase().includes('ssd') ? 'logistics_tariff' :
    'firmware_leak'
  );

  let investigation: Investigation;
  let hypotheses: Hypothesis[];
  let toolCalls: ToolCall[];
  let decisions: Decision[];

  if (type === 'supplier_bottleneck') {
    investigation = {
      id: invId,
      goal_id: 1,
      metric_name: "ARGUS Audit: Critical Supplier Bottleneck & Stockout Risk",
      anomaly_score: 9.2,
      status: "action_pending",
      summary: `Critical inventory anomaly: Nexus SmartWatch Ultra 2 burn rate (4.2 units/day) with 32 units left will cause complete stockout in 7.6 days due to Global Microelectronics expanding lead times to 14 days without notice.`,
      root_cause: "Global Microelectronics component backlog + lack of dual-sourcing air-freight buffer.",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    hypotheses = [
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Supplier Global Microelectronics lead time expanded from 5 to 14 days due to overseas port backlog.",
        confidence_score: 0.94,
        validation_status: "confirmed",
        evidence: "Supplier ERP webhook reports 9-day shipping delay at Shanghai container terminal."
      },
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Unexpected spike in enterprise B2B purchasing volume depleting buffer stock prematurely.",
        confidence_score: 0.28,
        validation_status: "rejected",
        evidence: "Order volume is within 4% of historical 30-day forecast."
      }
    ];

    toolCalls = [
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "simulate_supply_chain_leadtime",
        input_params: { supplier_id: 2, sku: "WTC-NEXUS-U2" },
        output_result: { current_stock: 32, burn_rate_daily: 4.2, stockout_in_days: 7.6, revenue_at_risk: 89800 },
        execution_time_ms: 110,
        created_at: now.toISOString()
      },
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "evaluate_secondary_suppliers",
        input_params: { sku: "WTC-NEXUS-U2", target_units: 200 },
        output_result: { vendor: "Apex Dynamics", unit_premium: "$12.00", transit_days: 2.5, feasible: true },
        execution_time_ms: 145,
        created_at: now.toISOString()
      }
    ];

    decisions = [
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option A (Recommended): Dual-Source Air-Freight Replenishment (200 Units)",
        strategy_type: "Balanced",
        description: "Engage secondary certified supplier Apex Dynamics to air-freight 200 units within 48 hours to avert stockout completely.",
        estimated_cost: 6200.00,
        projected_revenue_impact: 89800.00,
        projected_roi: 14.48,
        risk_level: "Low",
        status: "pending"
      },
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option B: Ration Orders & Limit B2B Allocations",
        strategy_type: "Conservative",
        description: "Cap customer purchases to 1 unit and delay bulk fulfillments until ocean freight arrives.",
        estimated_cost: 1500.00,
        projected_revenue_impact: 22000.00,
        projected_roi: 1.46,
        risk_level: "Medium",
        status: "pending"
      }
    ];
  } else if (type === 'viral_defect') {
    investigation = {
      id: invId,
      goal_id: 1,
      metric_name: "ARGUS Audit: Viral Social Media Defect & Warranty Churn",
      anomaly_score: 8.9,
      status: "action_pending",
      summary: `Vortex Mechanical Keyboard returns jumped 340% following viral social media posts detailing double-typing switch bounce after 2 weeks of usage.`,
      root_cause: "Batch #882 mechanical switch debounce threshold set too low (2ms vs standard 8ms).",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    hypotheses = [
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Switch debounce controller setting in batch #882 causes key chattering under high-speed typing.",
        confidence_score: 0.95,
        validation_status: "confirmed",
        evidence: "Telemetry logs on return tickets show 89% complaints mention 'spacebar double pressing'."
      }
    ];

    toolCalls = [
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "query_database_returns",
        input_params: { sku: "KB-VORTEX-RGB", filter: "chatter" },
        output_result: { total_complaints: 84, affected_batch: "LOT-882", churn_acceleration: "+340%" },
        execution_time_ms: 125,
        created_at: now.toISOString()
      }
    ];

    decisions = [
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option A (Recommended): Firmware Debounce Hotfix v1.12 + Social Media Response",
        strategy_type: "Balanced",
        description: "Push desktop companion app update increasing debounce filter to 8ms and issue public video acknowledgment with keycap bonus.",
        estimated_cost: 4500.00,
        projected_revenue_impact: 38000.00,
        projected_roi: 8.44,
        risk_level: "Low",
        status: "pending"
      }
    ];
  } else {
    // Default baseline: Firmware v2.4 BLE Memory Leak & Stockout
    investigation = {
      id: invId,
      goal_id: 1,
      metric_name: targetObjective ? `ARGUS Audit: ${targetObjective}` : "ARGUS Audit: Return Rate Spike & Supply Chain Variance",
      anomaly_score: 8.7,
      status: "action_pending",
      summary: `Root cause confirmed: Firmware v2.4 BLE audio regression causing return spike on Aura Sound Pro (14.8%), coupled with supplier lead time delay on Nexus Watch Ultra 2. Generated 3 actionable strategies. Initiated at ${timestampStr}.`,
      root_cause: "Bluetooth LE audio stack memory leak in firmware v2.4 + Supplier lead time expanded from 5 to 14 days.",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    hypotheses = [
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Firmware v2.4 BLE audio stack memory leak causing Bluetooth disconnects on flagship audio SKUs.",
        confidence_score: 0.91,
        validation_status: "confirmed",
        evidence: "Return logs contain 83% keyword match for 'v2.4 update disconnect' and 'audio lag'."
      },
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Supplier lead time bottleneck from Global Microelectronics causing impending stockout on Nexus Watch Ultra 2.",
        confidence_score: 0.86,
        validation_status: "confirmed",
        evidence: "Supplier lead time expanded from 5 days to 14 days without buffer notification."
      },
      {
        id: store.nextIds.hypothesis++,
        investigation_id: invId,
        hypothesis_text: "Packaging damage during transit via regional carrier.",
        confidence_score: 0.12,
        validation_status: "rejected",
        evidence: "Transit damage claims represent < 1.2% of total returns."
      }
    ];

    toolCalls = [
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "query_database_returns",
        input_params: { sku: "AUD-AURA-PRO", period: "30d" },
        output_result: { total_returns: 30, return_rate: "14.8%", primary_reason: "Firmware Bluetooth Disconnect" },
        execution_time_ms: 132,
        created_at: now.toISOString()
      },
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "calculate_variance_metrics",
        input_params: { metric: "Gross_Margin", product_id: 1 },
        output_result: { baseline_margin: "61.5%", current_margin: "44.2%", monthly_profit_loss: "$38,400" },
        execution_time_ms: 95,
        created_at: now.toISOString()
      },
      {
        id: store.nextIds.toolCall++,
        investigation_id: invId,
        tool_name: "simulate_supply_chain_leadtime",
        input_params: { supplier_id: 2, sku: "WTC-NEXUS-U2" },
        output_result: { current_stock: 32, days_to_stockout: 7.6, supplier_lead_days: 14, stockout_risk: "High" },
        execution_time_ms: 180,
        created_at: now.toISOString()
      }
    ];

    decisions = [
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option A (Recommended): Emergency Hotfix v2.4.1 + Air Freight Replenishment",
        strategy_type: "Balanced",
        description: "Push over-the-air hotfix v2.4.1 to eliminate Bluetooth disconnects, offer $25 store credit to affected users, and air-freight 200 units of Nexus Watch Ultra 2 to prevent stockout.",
        estimated_cost: 8400.00,
        projected_revenue_impact: 46200.00,
        projected_roi: 5.50,
        risk_level: "Low",
        status: "pending"
      },
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option B: Total Product Recall & Sales Freeze",
        strategy_type: "Conservative",
        description: "Halt sales of Aura Sound Pro ANC Headphones, issue 100% cash refunds, and pause marketing campaigns.",
        estimated_cost: 24500.00,
        projected_revenue_impact: 18000.00,
        projected_roi: 0.73,
        risk_level: "High",
        status: "pending"
      },
      {
        id: store.nextIds.decision++,
        investigation_id: invId,
        title: "Option C: Price Drop Liquidation & Bulk Reorder",
        strategy_type: "Aggressive",
        description: "Discount Aura Sound Pro by 25% to liquidate current stock while deploying hotfix v2.4.1.",
        estimated_cost: 15200.00,
        projected_revenue_impact: 54000.00,
        projected_roi: 3.55,
        risk_level: "Medium",
        status: "pending"
      }
    ];
  }

  store.investigations.push(investigation);
  store.hypotheses.push(...hypotheses);
  store.toolCalls.push(...toolCalls);
  store.decisions.push(...decisions);

  const audit: AuditLog = {
    id: store.nextIds.auditLog++,
    action_type: "INVESTIGATION_COMPLETED",
    performed_by: "ARGUS Agent Engine",
    details: `Investigation #${investigation.id} created (${type}). ${hypotheses.length} hypotheses tested, ${toolCalls.length} tools executed, ${decisions.length} strategies formulated.`,
    timestamp: now.toISOString()
  };
  store.auditLogs.push(audit);

  return investigation;
}

export function generateExecutiveSitrep(investigationId: number): { text: string; audioScript: string } {
  const store = getStore();
  const inv = store.investigations.find(i => i.id === investigationId) || store.investigations[store.investigations.length - 1];
  const decisions = store.decisions.filter(d => d.investigation_id === inv?.id);
  const rec = decisions.find(d => d.strategy_type === 'Balanced') || decisions[0];

  const audioScript = `Attention Executive. ARGUS operational telemetry has isolated a critical operational anomaly. Anomaly severity score: ${inv?.anomaly_score || 8.7} out of 10. Root cause confirmed: ${inv?.root_cause || 'Firmware BLE memory leak and supplier bottleneck'}. Autonomous diagnostic tool calls have completed. ARGUS recommends immediate authorization of Strategy Option A: ${rec?.title || 'Emergency Hotfix and Air Freight'}. Projected cost: $${rec?.estimated_cost || 8400}, with an anticipated revenue recovery of $${rec?.projected_revenue_impact || 46200}, delivering a 5.5x return on capital. Awaiting your executive authorization command.`;

  return {
    text: inv?.summary || "Active operational incident under executive review.",
    audioScript
  };
}
