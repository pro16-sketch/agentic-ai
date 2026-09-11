import { getStore } from './store.js';
import { Investigation, Hypothesis, ToolCall, Decision, AuditLog } from './types.js';

export function runInvestigation(targetObjective?: string): Investigation {
  const store = getStore();
  const now = new Date();
  const timestampStr = now.toISOString().replace('T', ' ').slice(0, 16);
  const title = targetObjective || "Investigate Return Rate & Margin Variance";

  const invId = store.nextIds.investigation++;
  const investigation: Investigation = {
    id: invId,
    goal_id: 1,
    metric_name: `ARGUS Audit: ${title}`,
    anomaly_score: 8.7,
    status: "action_pending",
    summary: `Root cause confirmed: Firmware v2.4 BLE audio regression causing return spike on Aura Sound Pro, coupled with supplier lead time delay on Nexus Watch Ultra 2. Generated 3 actionable strategies. Initiated at ${timestampStr}.`,
    root_cause: "Bluetooth LE audio stack memory leak in firmware v2.4 + Supplier lead time expanded from 5 to 14 days.",
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  store.investigations.push(investigation);

  const h1: Hypothesis = {
    id: store.nextIds.hypothesis++,
    investigation_id: invId,
    hypothesis_text: "Firmware v2.4 BLE audio stack memory leak causing Bluetooth disconnects on flagship audio SKUs.",
    confidence_score: 0.91,
    validation_status: "confirmed",
    evidence: "Return logs contain 83% keyword match for 'v2.4 update disconnect' and 'audio lag'."
  };
  const h2: Hypothesis = {
    id: store.nextIds.hypothesis++,
    investigation_id: invId,
    hypothesis_text: "Supplier lead time bottleneck from Global Microelectronics causing impending stockout on Nexus Watch Ultra 2.",
    confidence_score: 0.86,
    validation_status: "confirmed",
    evidence: "Supplier lead time expanded from 5 days to 14 days without buffer notification."
  };
  const h3: Hypothesis = {
    id: store.nextIds.hypothesis++,
    investigation_id: invId,
    hypothesis_text: "Packaging damage during transit via regional carrier.",
    confidence_score: 0.12,
    validation_status: "rejected",
    evidence: "Transit damage claims represent < 1.2% of total returns."
  };
  store.hypotheses.push(h1, h2, h3);

  const tc1: ToolCall = {
    id: store.nextIds.toolCall++,
    investigation_id: invId,
    tool_name: "query_database_returns",
    input_params: { sku: "AUD-AURA-PRO", period: "30d" },
    output_result: { total_returns: 30, return_rate: "14.8%", primary_reason: "Firmware Bluetooth Disconnect" },
    execution_time_ms: 132,
    created_at: now.toISOString()
  };
  const tc2: ToolCall = {
    id: store.nextIds.toolCall++,
    investigation_id: invId,
    tool_name: "calculate_variance_metrics",
    input_params: { metric: "Gross_Margin", product_id: 1 },
    output_result: { baseline_margin: "61.5%", current_margin: "44.2%", monthly_profit_loss: "$38,400" },
    execution_time_ms: 95,
    created_at: now.toISOString()
  };
  const tc3: ToolCall = {
    id: store.nextIds.toolCall++,
    investigation_id: invId,
    tool_name: "simulate_supply_chain_leadtime",
    input_params: { supplier_id: 2, sku: "WTC-NEXUS-U2" },
    output_result: { current_stock: 32, days_to_stockout: 7.6, supplier_lead_days: 14, stockout_risk: "High" },
    execution_time_ms: 180,
    created_at: now.toISOString()
  };
  store.toolCalls.push(tc1, tc2, tc3);

  const d1: Decision = {
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
  };
  const d2: Decision = {
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
  };
  const d3: Decision = {
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
  };
  store.decisions.push(d1, d2, d3);

  const audit: AuditLog = {
    id: store.nextIds.auditLog++,
    action_type: "INVESTIGATION_COMPLETED",
    performed_by: "ARGUS Agent Engine",
    details: `Investigation ID #${investigation.id} created with 3 hypotheses, 3 tool calls, and 3 strategy recommendations.`,
    timestamp: now.toISOString()
  };
  store.auditLogs.push(audit);

  return investigation;
}
