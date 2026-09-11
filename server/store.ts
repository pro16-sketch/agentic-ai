import {
  Product,
  Supplier,
  Inventory,
  Customer,
  Order,
  Return,
  Goal,
  Hypothesis,
  ToolCall,
  Decision,
  Outcome,
  AuditLog,
  Investigation
} from './types.js';

export interface DataStore {
  products: Product[];
  suppliers: Supplier[];
  inventory: Inventory[];
  customers: Customer[];
  orders: Order[];
  returns: Return[];
  goals: Goal[];
  investigations: Investigation[];
  hypotheses: Hypothesis[];
  toolCalls: ToolCall[];
  decisions: Decision[];
  outcomes: Outcome[];
  auditLogs: AuditLog[];
  nextIds: {
    investigation: number;
    hypothesis: number;
    toolCall: number;
    decision: number;
    outcome: number;
    auditLog: number;
  };
}

let store: DataStore;

export function initializeStore(): DataStore {
  const now = new Date();

  const suppliers: Supplier[] = [
    { id: 1, name: "AuraTech Components", contact_email: "supply@auratech.com", reliability_score: 0.96, avg_lead_time_days: 4 },
    { id: 2, name: "Global Microelectronics Co.", contact_email: "ops@globalmicro.io", reliability_score: 0.82, avg_lead_time_days: 12 },
    { id: 3, name: "Quantum Memory Labs", contact_email: "orders@quantumlabs.com", reliability_score: 0.98, avg_lead_time_days: 3 },
    { id: 4, name: "Apex Dynamics Assembly", contact_email: "logistics@apexdynamics.com", reliability_score: 0.91, avg_lead_time_days: 6 }
  ];

  const products: Product[] = [
    {
      id: 1,
      sku: "AUD-AURA-PRO",
      name: "Aura Sound Pro ANC Headphones",
      category: "Audio & Wearables",
      price: 299.00,
      cost: 115.00,
      stock_level: 420,
      min_reorder_point: 100,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      status: "warning"
    },
    {
      id: 2,
      sku: "WTC-NEXUS-U2",
      name: "Nexus SmartWatch Ultra 2",
      category: "Wearables",
      price: 449.00,
      cost: 190.00,
      stock_level: 32,
      min_reorder_point: 75,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      status: "low_stock"
    },
    {
      id: 3,
      sku: "KB-VORTEX-RGB",
      name: "Vortex Pro Wireless Mechanical Keyboard",
      category: "Peripherals",
      price: 179.00,
      cost: 68.00,
      stock_level: 680,
      min_reorder_point: 150,
      image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
      status: "active"
    },
    {
      id: 4,
      sku: "SSD-QUANTUM-2T",
      name: "Quantum SSD 2TB NVMe Gen4",
      category: "Storage",
      price: 199.00,
      cost: 85.00,
      stock_level: 510,
      min_reorder_point: 120,
      image_url: "https://images.unsplash.com/photo-1597872250970-482a0b127599?w=500&auto=format&fit=crop&q=60",
      status: "active"
    },
    {
      id: 5,
      sku: "MON-LUMI-4K",
      name: "Luminary Studio Monitor 27-inch 4K",
      category: "Displays",
      price: 649.00,
      cost: 290.00,
      stock_level: 185,
      min_reorder_point: 50,
      image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60",
      status: "active"
    },
    {
      id: 6,
      sku: "CHR-STARLIGHT",
      name: "Starlight Ergonomic Mesh Desk Chair",
      category: "Furniture",
      price: 529.00,
      cost: 210.00,
      stock_level: 94,
      min_reorder_point: 40,
      image_url: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&auto=format&fit=crop&q=60",
      status: "active"
    },
    {
      id: 7,
      sku: "DRN-APEX-4K",
      name: "Apex Pro Cinema Drone 4K",
      category: "Electronics",
      price: 899.00,
      cost: 410.00,
      stock_level: 45,
      min_reorder_point: 30,
      image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60",
      status: "active"
    },
    {
      id: 8,
      sku: "PWR-SOLARIS-25",
      name: "Solaris PowerBank 25000mAh 100W",
      category: "Accessories",
      price: 89.00,
      cost: 32.00,
      stock_level: 820,
      min_reorder_point: 200,
      image_url: "https://images.unsplash.com/photo-1609592424074-297d0fd979ef?w=500&auto=format&fit=crop&q=60",
      status: "active"
    }
  ];

  const inventory: Inventory[] = [
    { id: 1, product_id: 1, warehouse_location: "US-East-Primary", reorder_lead_time_days: 4, supplier_id: 1, updated_at: now.toISOString() },
    { id: 2, product_id: 2, warehouse_location: "US-West-Central", reorder_lead_time_days: 14, supplier_id: 2, updated_at: now.toISOString() },
    { id: 3, product_id: 3, warehouse_location: "US-East-Primary", reorder_lead_time_days: 5, supplier_id: 1, updated_at: now.toISOString() },
    { id: 4, product_id: 4, warehouse_location: "US-East-Primary", reorder_lead_time_days: 3, supplier_id: 3, updated_at: now.toISOString() },
    { id: 5, product_id: 5, warehouse_location: "EU-Central-1", reorder_lead_time_days: 7, supplier_id: 4, updated_at: now.toISOString() },
    { id: 6, product_id: 6, warehouse_location: "US-West-Central", reorder_lead_time_days: 8, supplier_id: 4, updated_at: now.toISOString() },
    { id: 7, product_id: 7, warehouse_location: "US-East-Primary", reorder_lead_time_days: 6, supplier_id: 4, updated_at: now.toISOString() },
    { id: 8, product_id: 8, warehouse_location: "US-East-Primary", reorder_lead_time_days: 3, supplier_id: 1, updated_at: now.toISOString() }
  ];

  const customers: Customer[] = [
    { id: 1, name: "Apex Enterprise Logistics", email: "procurement@apexlog.com", segment: "Enterprise", lifetime_value: 48200.00 },
    { id: 2, name: "Horizon Design Studio", email: "tech@horizondesign.co", segment: "VIP", lifetime_value: 19500.00 },
    { id: 3, name: "Sarah Jenkins", email: "s.jenkins@gmail.com", segment: "Standard", lifetime_value: 1240.00 },
    { id: 4, name: "Marcus Vance", email: "mvance@techcorp.io", segment: "VIP", lifetime_value: 8450.00 },
    { id: 5, name: "Elena Rostova", email: "elena@rostovadesign.com", segment: "Standard", lifetime_value: 2100.00 }
  ];

  const orders: Order[] = [];
  let orderIdCounter = 1000;

  for (let i = 0; i < 120; i++) {
    const prod = products[i % products.length];
    const cust = customers[i % customers.length];
    const daysAgo = (120 - i) * 0.25;
    const createdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const qty = prod.price > 300 ? 1 : (i % 3 === 0 ? 2 : 1);
    const total = prod.price * qty;

    let status = "completed";
    if (prod.id === 1 && i % 4 === 0) {
      status = "returned";
    } else if (prod.id === 2 && i % 15 === 0) {
      status = "returned";
    }

    orderIdCounter += 1;
    orders.push({
      id: i + 1,
      order_number: `ORD-2026-${orderIdCounter}`,
      customer_id: cust.id,
      product_id: prod.id,
      quantity: qty,
      total_price: total,
      status,
      created_at: createdDate.toISOString()
    });
  }

  const returns: Return[] = [
    {
      id: 1,
      order_id: 4,
      product_id: 1,
      reason: "Firmware Bluetooth Disconnect",
      customer_feedback: "Headphones disconnect every 10 minutes following recent v2.4 firmware update.",
      status: "processed",
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      order_id: 8,
      product_id: 1,
      reason: "Firmware Bluetooth Disconnect",
      customer_feedback: "ANC drops out and audio stutters when paired with iPhone 16 Pro.",
      status: "processed",
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      order_id: 12,
      product_id: 1,
      reason: "Firmware Bluetooth Disconnect",
      customer_feedback: "Unusable audio lag after update. Requesting full refund.",
      status: "processed",
      created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      order_id: 16,
      product_id: 1,
      reason: "Defective Hardware",
      customer_feedback: "Right ear cushion came loose right out of the box.",
      status: "processed",
      created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      order_id: 20,
      product_id: 1,
      reason: "Firmware Bluetooth Disconnect",
      customer_feedback: "Firmware update v2.4 bricked the left earbud connectivity.",
      status: "processed",
      created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const goals: Goal[] = [
    {
      id: 1,
      title: "Maintain Net Margin > 35% & Protect Customer Satisfaction Score",
      description: "Monitor quarterly return rate variances, stockout risks, and supplier lead times across all premium SKUs.",
      status: "investigating",
      target_metric: "Gross Profit Margin & Return Rate %",
      created_at: now.toISOString()
    }
  ];

  const investigations: Investigation[] = [
    {
      id: 1,
      goal_id: 1,
      metric_name: "Return Rate Spike & Gross Margin Compression (SKU: AUD-AURA-PRO)",
      anomaly_score: 8.7,
      status: "action_pending",
      summary: "ARGUS detected an unusual 14.8% return rate spike on 'Aura Sound Pro ANC Headphones' (baseline 2.1%) following the v2.4 firmware release, creating a projected $38,400 monthly profit loss and inventory stockout risk for SKU WTC-NEXUS-U2 due to supplier lead time delay.",
      root_cause: "Bluetooth LE audio stack regression in firmware v2.4 causing connection drops, compounded by Global Microelectronics Co. component shipping delay (14 days vs 5 days avg).",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
  ];

  const hypotheses: Hypothesis[] = [
    {
      id: 1,
      investigation_id: 1,
      hypothesis_text: "Hardware batch acoustic transducer defect in Q3 manufacturing run.",
      confidence_score: 0.15,
      validation_status: "rejected",
      evidence: "Hardware failure diagnostics show 98.4% component pass rate. Issue did not exist prior to firmware update v2.4."
    },
    {
      id: 2,
      investigation_id: 1,
      hypothesis_text: "Firmware v2.4 BLE audio stack buffer overflow causing connection drops on modern mobile OS.",
      confidence_score: 0.92,
      validation_status: "confirmed",
      evidence: "82% of return comments explicitly cite 'Bluetooth disconnection after v2.4 update'. Automated regression test confirms packet drop under high bandwidth."
    },
    {
      id: 3,
      investigation_id: 1,
      hypothesis_text: "Supplier lead time delay from Global Microelectronics Co. threatens stockout for Nexus Watch Ultra 2.",
      confidence_score: 0.88,
      validation_status: "confirmed",
      evidence: "Inventory count is 32 units against reorder point of 75 units. Supplier lead time expanded from 5 to 14 days without notice."
    }
  ];

  const toolCalls: ToolCall[] = [
    {
      id: 1,
      investigation_id: 1,
      tool_name: "query_database_returns",
      input_params: { sku: "AUD-AURA-PRO", timeframe_days: 30 },
      output_result: { total_returns: 30, return_rate: 0.148, primary_reason: "Firmware Bluetooth Disconnect", reason_percentage: 0.833 },
      execution_time_ms: 145,
      created_at: now.toISOString()
    },
    {
      id: 2,
      investigation_id: 1,
      tool_name: "calculate_variance_metrics",
      input_params: { metric: "Gross_Margin", product_id: 1 },
      output_result: { baseline_margin: 0.615, current_margin: 0.442, variance_pct: -28.1, monthly_profit_loss: 38400.0 },
      execution_time_ms: 98,
      created_at: now.toISOString()
    },
    {
      id: 3,
      investigation_id: 1,
      tool_name: "simulate_supply_chain_leadtime",
      input_params: { supplier_id: 2, sku: "WTC-NEXUS-U2" },
      output_result: { current_stock: 32, daily_burn_rate: 4.2, days_to_stockout: 7.6, supplier_lead_days: 14, projected_stockout_days: 6.4 },
      execution_time_ms: 210,
      created_at: now.toISOString()
    }
  ];

  const decisions: Decision[] = [
    {
      id: 1,
      investigation_id: 1,
      title: "Option A (Recommended): Emergency Firmware Patch v2.4.1 + Expedited Air Freight for Nexus Watch",
      strategy_type: "Balanced",
      description: "1. Deploy over-the-air hotfix firmware v2.4.1 resolving BLE audio buffer issue.\n2. Automatically trigger $25 store credit to affected return customers to recover 65% of returns.\n3. Expedite air shipment for Nexus Watch Ultra 2 from secondary supplier to eliminate 6.4 day stockout gap.",
      estimated_cost: 8400.00,
      projected_revenue_impact: 46200.00,
      projected_roi: 5.5,
      risk_level: "Low",
      status: "pending"
    },
    {
      id: 2,
      investigation_id: 1,
      title: "Option B: Full Product Recall & Sales Freeze on Aura Sound Pro",
      strategy_type: "Conservative",
      description: "Halt all sales of Aura Sound Pro ANC Headphones immediately, issue full refunds for all customer returns, and await physical hardware audit.",
      estimated_cost: 24500.00,
      projected_revenue_impact: 18000.00,
      projected_roi: 0.73,
      risk_level: "High",
      status: "pending"
    },
    {
      id: 3,
      investigation_id: 1,
      title: "Option C: Aggressive Price Discount & Air-Freight Bulk Replenishment",
      strategy_type: "Aggressive",
      description: "Reduce Aura Sound Pro price from $299 to $229 to liquidate inventory while releasing hotfix v2.4.1. Double reorder quantity for Nexus Watch Ultra via expedited shipping.",
      estimated_cost: 15200.00,
      projected_revenue_impact: 54000.00,
      projected_roi: 3.55,
      risk_level: "Medium",
      status: "pending"
    }
  ];

  const outcomes: Outcome[] = [];

  const auditLogs: AuditLog[] = [
    {
      id: 1,
      action_type: "SYSTEM_INITIALIZED",
      performed_by: "ARGUS System",
      details: "Database populated with enterprise telemetry data and initial active anomaly investigation ID #1.",
      timestamp: now.toISOString()
    }
  ];

  store = {
    products,
    suppliers,
    inventory,
    customers,
    orders,
    returns,
    goals,
    investigations,
    hypotheses,
    toolCalls,
    decisions,
    outcomes,
    auditLogs,
    nextIds: {
      investigation: 2,
      hypothesis: 4,
      toolCall: 4,
      decision: 4,
      outcome: 1,
      auditLog: 2
    }
  };

  return store;
}

export function getStore(): DataStore {
  if (!store) {
    initializeStore();
  }
  return store;
}

export function resetStore(): DataStore {
  return initializeStore();
}
