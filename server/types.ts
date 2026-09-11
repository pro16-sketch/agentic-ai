export interface Product {
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
}

export interface Supplier {
  id: number;
  name: string;
  contact_email: string;
  reliability_score: number;
  avg_lead_time_days: number;
}

export interface Inventory {
  id: number;
  product_id: number;
  warehouse_location: string;
  reorder_lead_time_days: number;
  supplier_id: number;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  segment: string;
  lifetime_value: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface Return {
  id: number;
  order_id: number;
  product_id: number;
  reason: string;
  customer_feedback: string;
  status: string;
  created_at: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  status: string;
  target_metric: string;
  created_at: string;
}

export interface Hypothesis {
  id: number;
  investigation_id: number;
  hypothesis_text: string;
  confidence_score: number;
  validation_status: string;
  evidence: string;
}

export interface ToolCall {
  id: number;
  investigation_id: number;
  tool_name: string;
  input_params: Record<string, any>;
  output_result: Record<string, any>;
  execution_time_ms: number;
  created_at: string;
}

export interface Decision {
  id: number;
  investigation_id: number;
  title: string;
  strategy_type: string;
  description: string;
  estimated_cost: number;
  projected_revenue_impact: number;
  projected_roi: number;
  risk_level: string;
  status: string;
  approved_at?: string | null;
}

export interface Outcome {
  id: number;
  decision_id: number;
  actual_roi: number;
  revenue_recovered: number;
  status: string;
  summary: string;
  recorded_at: string;
}

export interface AuditLog {
  id: number;
  action_type: string;
  performed_by: string;
  details: string;
  timestamp: string;
}

export interface Investigation {
  id: number;
  goal_id?: number | null;
  metric_name: string;
  anomaly_score: number;
  status: string;
  summary: string;
  root_cause: string;
  created_at: string;
  updated_at: string;
}
