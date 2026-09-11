export interface ProductMetric {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock_level: number;
  min_reorder_point: number;
  image_url: string;
  status: string;
  return_rate_pct: number;
  has_anomaly: boolean;
}

export interface InitialVsFinalComparison {
  initial: {
    return_rate_pct: number;
    monthly_loss: number;
    net_profit: number;
    gross_margin_pct: number;
    inventory_risk: string;
    affected_skus: number;
  };
  final: {
    return_rate_pct: number;
    net_recovered: number;
    net_profit: number;
    gross_margin_pct: number;
    inventory_risk: string;
    affected_skus: number;
  };
}

export interface BusinessMetrics {
  total_revenue: number;
  total_profit: number;
  gross_margin_pct: number;
  total_inventory_value: number;
  overall_return_rate_pct: number;
  low_stock_skus: number;
  active_anomalies: number;
  products: ProductMetric[];
  monthly_revenue_trend: Array<{ date: string; revenue: number; profit: number; returnRate?: number }>;
  return_reasons_breakdown: Array<{ reason: string; count: number }>;
  is_resolved?: boolean;
  initial_vs_final?: InitialVsFinalComparison;
}

export interface BusinessStateResponse {
  metrics: BusinessMetrics;
  active_goal: {
    id: number;
    title: string;
    description: string;
    status: string;
    target_metric: string;
  } | null;
  active_investigation_id: number | null;
}

export interface Hypothesis {
  id: number;
  hypothesis_text: string;
  confidence_score: number;
  validation_status: string;
  evidence: string;
}

export interface ToolCall {
  id: number;
  tool_name: string;
  input_params: Record<string, any>;
  output_result: Record<string, any>;
  execution_time_ms: number;
  created_at: string;
}

export interface Outcome {
  id: number;
  actual_roi: number;
  revenue_recovered: number;
  status: string;
  summary: string;
}

export interface Decision {
  id: number;
  title: string;
  strategy_type: string;
  description: string;
  estimated_cost: number;
  projected_revenue_impact: number;
  projected_roi: number;
  risk_level: string;
  status: string;
  outcome: Outcome | null;
}

export interface InvestigationDetails {
  id: number;
  metric_name: string;
  anomaly_score: number;
  status: string;
  summary: string;
  root_cause: string;
  created_at: string;
  hypotheses: Hypothesis[];
  tool_calls: ToolCall[];
  decisions: Decision[];
}

export interface AgentEvent {
  id: string;
  type: string;
  title: string;
  details: string;
  timestamp: string;
}

export interface ScenarioSimulationResult {
  price_change_pct: number;
  recovery_rate_pct: number;
  expedite_shipping_cost: number;
  reorder_quantity: number;
  projected_revenue: number;
  total_cost: number;
  net_gain: number;
  simulated_roi: number;
  stockout_risk_reduction_pct: number;
}
