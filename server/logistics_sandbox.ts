import {
  WarehouseInventory,
  LogisticsShipment,
  LogisticsVendor,
  LogisticsRoute,
  DisruptionIncident,
  RecoveryAlternative,
  VerificationReport,
  LogisticsDigitalTwinState,
  TransportMode
} from './logistics_types.js';

let state: LogisticsDigitalTwinState;

export function initializeLogisticsSandbox(): LogisticsDigitalTwinState {
  const now = new Date();
  const nowIso = now.toISOString();

  // 1. India-Based Multi-Warehouse Digital Twin Inventory
  const inventory: WarehouseInventory[] = [
    {
      id: "INV-IN-BLR-WTC",
      warehouseId: "WH-IN-BLR",
      warehouseName: "Bengaluru Fulfillment Hub (Whitefield)",
      location: "Bengaluru, Karnataka (South Hub)",
      sku: "WTC-NEXUS-U2",
      productName: "Nexus SmartWatch Ultra 2",
      onHandStock: 32,
      reservedStock: 0,
      availableStock: 32,
      inTransitStock: 0,
      dailyBurnRate: 4.2,
      safetyStock: 75,
      reorderPoint: 75,
      primarySupplierLeadDays: 14,
      daysOfSupply: Number((32 / 4.2).toFixed(1)), // 7.6 days
      projectedStockoutDays: Number((32 / 4.2).toFixed(1)), // 7.6 days
      stockoutGapDays: Number((14 - 32 / 4.2).toFixed(1)), // 6.4 days stockout gap!
      status: "stockout_imminent",
      lastUpdated: nowIso
    },
    {
      id: "INV-IN-NCR-WTC",
      warehouseId: "WH-IN-NCR",
      warehouseName: "Delhi NCR Logistics Super-Hub",
      location: "Gurugram / Manesar, Haryana (North Hub)",
      sku: "WTC-NEXUS-U2",
      productName: "Nexus SmartWatch Ultra 2",
      onHandStock: 180,
      reservedStock: 30,
      availableStock: 150, // 150 surplus units available to transfer!
      inTransitStock: 50,
      dailyBurnRate: 2.1,
      safetyStock: 40,
      reorderPoint: 50,
      primarySupplierLeadDays: 5,
      daysOfSupply: Number((150 / 2.1).toFixed(1)), // 71.4 days (healthy surplus!)
      projectedStockoutDays: 71.4,
      stockoutGapDays: 0,
      status: "healthy",
      lastUpdated: nowIso
    },
    {
      id: "INV-IN-MUM-AUD",
      warehouseId: "WH-IN-MUM",
      warehouseName: "Mumbai Coastal Distribution Center",
      location: "Bhiwandi / JNPT Logistics Zone, Maharashtra",
      sku: "AUD-AURA-PRO",
      productName: "Aura Sound Pro ANC Headphones",
      onHandStock: 420,
      reservedStock: 20,
      availableStock: 400,
      inTransitStock: 100,
      dailyBurnRate: 5.5,
      safetyStock: 100,
      reorderPoint: 120,
      primarySupplierLeadDays: 4,
      daysOfSupply: Number((400 / 5.5).toFixed(1)),
      projectedStockoutDays: 72.7,
      stockoutGapDays: 0,
      status: "healthy",
      lastUpdated: nowIso
    },
    {
      id: "INV-IN-KOL-MON",
      warehouseId: "WH-IN-KOL",
      warehouseName: "Kolkata Eastern Logistics Terminal",
      location: "Dankuni Industrial Park, West Bengal",
      sku: "MON-LUMI-4K",
      productName: "Luminary Studio Monitor 27-inch 4K",
      onHandStock: 185,
      reservedStock: 15,
      availableStock: 170,
      inTransitStock: 60,
      dailyBurnRate: 2.8,
      safetyStock: 50,
      reorderPoint: 60,
      primarySupplierLeadDays: 7,
      daysOfSupply: Number((170 / 2.8).toFixed(1)),
      projectedStockoutDays: 60.7,
      stockoutGapDays: 0,
      status: "healthy",
      lastUpdated: nowIso
    }
  ];

  // 2. Active In-Transit Shipments in India
  const shipments: LogisticsShipment[] = [
    {
      id: "SHP-2026-9401",
      trackingNumber: "MAERSK-JNPT-889104",
      sku: "WTC-NEXUS-U2",
      productName: "Nexus SmartWatch Ultra 2",
      quantity: 150,
      origin: "JNPT Port Nhava Sheva (Mumbai)",
      destination: "WH-IN-BLR (Bengaluru Hub)",
      carrier: "Maersk Line & Concor Intermodal",
      transportMode: "OCEAN_FREIGHT",
      departureDate: new Date(now.getTime() - 6 * 24 * 3600 * 1000).toISOString(),
      etaDays: 14.0, // Delayed due to JNPT container berth backlog
      etaDate: new Date(now.getTime() + 14 * 24 * 3600 * 1000).toISOString(),
      costUsd: 115000, // In INR (₹1,15,000)
      carbonEmissionKg: 85.0,
      status: "delayed",
      routeId: "RT-JNPT-BLR-INTERMODAL",
      delayNotice: "JNPT Nhava Sheva container terminal berth congestion: +9 days customs clearance backlog.",
      timeline: [
        { timestamp: new Date(now.getTime() - 6 * 24 * 3600 * 1000).toISOString(), event: "Container arrived at JNPT Anchorage", location: "Nhava Sheva, Mumbai" },
        { timestamp: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(), event: "Berth allocation delayed due to tidal draft restriction", location: "JNPT Terminal 4" },
        { timestamp: nowIso, event: "Port Authority Alert: Inbound transit extended to 14.0 days total ETA", location: "JNPT Operations Center" }
      ]
    },
    {
      id: "SHP-2026-8812",
      trackingNumber: "BLUEDART-AIR-391208",
      sku: "AUD-AURA-PRO",
      productName: "Aura Sound Pro ANC Headphones",
      quantity: 100,
      origin: "Chennai Electronics Corridor (Sriperumbudur)",
      destination: "WH-IN-NCR (Gurugram Hub)",
      carrier: "Blue Dart Aviation (Boeing 737F)",
      transportMode: "AIR_EXPRESS",
      departureDate: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
      etaDays: 1.5,
      etaDate: new Date(now.getTime() + 1.5 * 24 * 3600 * 1000).toISOString(),
      costUsd: 228000, // In INR (₹2,28,000)
      carbonEmissionKg: 340.0,
      status: "in_transit",
      routeId: "RT-MAA-DEL-AIR",
      timeline: [
        { timestamp: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(), event: "Air cargo departed Chennai MAA Airport", location: "Chennai Cargo Terminal" },
        { timestamp: nowIso, event: "Sorted at Delhi IGI Cargo Super-Hub", location: "New Delhi IGI" }
      ]
    }
  ];

  // 3. Certified Vendor Network (India)
  const vendors: LogisticsVendor[] = [
    {
      id: "VND-GLOBAL-MICRO",
      name: "JNPT Inbound Importers Co.",
      code: "JIC-01",
      certified: true,
      reliabilityScore: 0.74,
      supportedSkus: ["WTC-NEXUS-U2"],
      unitCost: 15200.00, // ₹15,200 per unit
      standardLeadDays: 14,
      expediteLeadDays: 9,
      maxWeeklyCapacity: 500,
      currentAvailableCapacity: 120,
      carbonIntensityKgPerUnit: 1.8,
      originPort: "JNPT Nhava Sheva Port, Mumbai",
      status: "bottlenecked",
      statusReason: "Port terminal backlog and customs bottleneck expanding transit to 14 days."
    },
    {
      id: "VND-APEX-DYNAMICS",
      name: "Blue Dart Apex Air Logistics (Chennai Hub)",
      code: "BDA-02",
      certified: true,
      reliabilityScore: 0.96,
      supportedSkus: ["WTC-NEXUS-U2", "AUD-AURA-PRO"],
      unitCost: 16100.00, // ₹16,100 per unit
      standardLeadDays: 4,
      expediteLeadDays: 2.0,
      maxWeeklyCapacity: 400,
      currentAvailableCapacity: 250,
      carbonIntensityKgPerUnit: 2.1,
      originPort: "Chennai International Airport Cargo (MAA)",
      status: "active",
      statusReason: "Normal operations. High-speed Blue Dart dedicated air freight slot reserved."
    },
    {
      id: "VND-QUANTUM-LABS",
      name: "SpiceXpress Air Charter (Hyderabad)",
      code: "SXA-03",
      certified: true,
      reliabilityScore: 0.98,
      supportedSkus: ["WTC-NEXUS-U2", "SSD-QUANTUM-2T"],
      unitCost: 17200.00,
      standardLeadDays: 3,
      expediteLeadDays: 1.8,
      maxWeeklyCapacity: 300,
      currentAvailableCapacity: 180,
      carbonIntensityKgPerUnit: 2.4,
      originPort: "Hyderabad RGIA Air Cargo Terminal",
      status: "active",
      statusReason: "Express dedicated air freighter charter."
    }
  ];

  // 4. Indian Logistics Multi-Modal Transport Routes
  const routes: LogisticsRoute[] = [
    {
      id: "RT-MAA-BLR-AIR-EXP",
      origin: "Chennai MAA Airport (Blue Dart Hub)",
      destination: "WH-IN-BLR (Bengaluru)",
      mode: "AIR_EXPRESS",
      distanceKm: 350,
      transitDays: 2.0,
      costPerUnit: 1925.00,
      carbonKgPerUnit: 2.8,
      reliabilityRate: 0.98,
      congestionRisk: "LOW"
    },
    {
      id: "RT-NCR-BLR-RAIL",
      origin: "WH-IN-NCR (Delhi NCR Manesar Hub)",
      destination: "WH-IN-BLR (Bengaluru)",
      mode: "RAIL_FREIGHT",
      distanceKm: 2150,
      transitDays: 3.5,
      costPerUnit: 700.00,
      carbonKgPerUnit: 0.63, // Eco-optimal low carbon!
      reliabilityRate: 0.94,
      congestionRisk: "LOW"
    },
    {
      id: "RT-NCR-BLR-GROUND-EXP",
      origin: "WH-IN-NCR (Delhi NCR Manesar Hub)",
      destination: "WH-IN-BLR (Bengaluru)",
      mode: "GROUND_EXPEDITED",
      distanceKm: 2150,
      transitDays: 2.2,
      costPerUnit: 1600.00,
      carbonKgPerUnit: 1.45,
      reliabilityRate: 0.96,
      congestionRisk: "LOW"
    },
    {
      id: "RT-JNPT-BLR-OCEAN",
      origin: "JNPT Nhava Sheva (Mumbai)",
      destination: "WH-IN-BLR (Bengaluru)",
      mode: "OCEAN_FREIGHT",
      distanceKm: 1000,
      transitDays: 14.0, // Congested!
      costPerUnit: 575.00,
      carbonKgPerUnit: 0.42,
      reliabilityRate: 0.62,
      congestionRisk: "HIGH"
    }
  ];

  // 5. Initial Disruption Incident in India
  const initialIncident: DisruptionIncident = {
    id: "INC-2026-006",
    type: "STOCKOUT_IMMINENT",
    sku: "WTC-NEXUS-U2",
    productName: "Nexus SmartWatch Ultra 2",
    warehouseId: "WH-IN-BLR",
    warehouseName: "Bengaluru Fulfillment Hub (Whitefield)",
    title: "Constraint Violation: Bengaluru Stockout Imminent in 7.6 Days",
    description: "Real-time logistics telemetry indicates Nexus SmartWatch Ultra 2 on-hand inventory in the Bengaluru warehouse has dropped to 32 units. With daily sales of 4.2 units/day, stock will deplete in 7.6 days. Inbound shipment from JNPT Port Mumbai is delayed to 14.0 days due to port berth backlog. A stockout window of 6.4 days will cause ₹74,50,000 in lost customer revenue unless recovery action is dispatched.",
    severity: "CRITICAL",
    constraintViolations: [
      "Days of Supply (7.6d) < Replenishment Lead Time (14.0d)",
      "Stockout Deficit Gap: 6.4 Days (Projected Revenue Loss: ₹74,50,000 INR)",
      "Safety Stock Violation: Current (32) < Minimum Reorder Point (75)",
      "Inbound Intermodal Shipment (SHP-2026-9401) delayed at JNPT Nhava Sheva Port"
    ],
    currentStock: 32,
    dailyBurnRate: 4.2,
    leadTimeDays: 14.0,
    daysOfSupply: 7.6,
    stockoutGapDays: 6.4,
    detectedAt: nowIso,
    status: "DETECTED",
    replanCount: 0,
    replanHistory: []
  };

  state = {
    inventory,
    shipments,
    vendors,
    routes,
    incidents: [initialIncident],
    alternatives: [],
    verificationReports: [],
    agentWorkflowLogs: [
      {
        id: "LOG-INIT",
        node: "monitor_telemetry_node",
        status: "COMPLETED",
        details: "Telemetry scanning active across Bengaluru, Delhi NCR, Mumbai JNPT, and Kolkata hubs.",
        timestamp: nowIso
      },
      {
        id: "LOG-DETECT",
        node: "detect_disruptions_node",
        status: "COMPLETED",
        details: "Disruption detected: Bengaluru Nexus SmartWatch stockout projected in 7.6 days against 14-day lead time.",
        timestamp: nowIso,
        payload: { sku: "WTC-NEXUS-U2", stock: 32, burnRate: 4.2, leadTime: 14, gap: 6.4 }
      }
    ]
  };

  // Generate initial Pareto alternatives
  generateRecoveryAlternatives(initialIncident.id);

  return state;
}

export function getLogisticsSandbox(): LogisticsDigitalTwinState {
  if (!state) {
    initializeLogisticsSandbox();
  }
  return state;
}

export function resetLogisticsSandbox(): LogisticsDigitalTwinState {
  return initializeLogisticsSandbox();
}

/**
 * PS6 Multi-Objective Pareto Optimization Engine (India Context):
 */
export function generateRecoveryAlternatives(incidentId: string): RecoveryAlternative[] {
  const sandbox = getLogisticsSandbox();
  const incident = sandbox.incidents.find(i => i.id === incidentId);
  if (!incident) return [];

  const daysOfSupply = incident.daysOfSupply; // 7.6 days

  const alternatives: RecoveryAlternative[] = [
    {
      id: "ALT-OPT-1-APEX-AIR",
      incidentId,
      name: "Option 1 (Fastest Air): Blue Dart Express Aviation (Chennai → Bengaluru)",
      actionType: "PURCHASE_VENDOR",
      vendorId: "VND-APEX-DYNAMICS",
      vendorName: "Blue Dart Apex Air Logistics",
      fromLocation: "Chennai International Airport Cargo (MAA)",
      toLocation: "WH-IN-BLR (Bengaluru Fulfillment Hub)",
      transportMode: "AIR_EXPRESS",
      quantity: 200,
      totalCostUsd: 385000, // ₹3,85,000 INR
      deliveryDays: 2.0,
      carbonEmissionKg: 560.0,
      reliabilityScore: 0.96,
      isFeasible: 2.0 < daysOfSupply, // 2.0d < 7.6d -> TRUE!
      feasibilityReasons: [
        "Delivery time (2.0 days) arrives 5.6 days before Bengaluru stockout point",
        "Dedicated Blue Dart Boeing 737F cargo slot secured",
        "Cost: ₹3,85,000 within emergency response budget"
      ],
      paretoRank: 1,
      compositeScore: 94.5,
      selected: true,
      details: "Procure 200 units from Chennai assembly corridor. Expedite via Blue Dart Express Aviation directly to Bengaluru Airport Cargo Hub.",
      tradeoffSummary: {
        speedRank: "FASTEST",
        costRank: "MODERATE",
        carbonRank: "HIGH_CARBON"
      }
    },
    {
      id: "ALT-OPT-2-EAST-TRANSFER-RAIL",
      incidentId,
      name: "Option 2 (Eco-Rail Transfer): Indian Railways DFC Express Rail (Delhi NCR → Bengaluru)",
      actionType: "INTER_WAREHOUSE_TRANSFER",
      fromLocation: "WH-IN-NCR (Delhi NCR Manesar Hub)",
      toLocation: "WH-IN-BLR (Bengaluru Fulfillment Hub)",
      transportMode: "RAIL_FREIGHT",
      quantity: 150,
      totalCostUsd: 105000, // ₹1,05,000 INR (Cheapest!)
      deliveryDays: 3.5,
      carbonEmissionKg: 94.5, // 83% reduction in CO2!
      reliabilityScore: 0.94,
      isFeasible: 3.5 < daysOfSupply, // 3.5d < 7.6d -> TRUE!
      feasibilityReasons: [
        "Delivery time (3.5 days) arrives 4.1 days before stockout point",
        "Delhi NCR warehouse has 150 available surplus units",
        "Lowest carbon footprint: 94.5 kg CO₂ (85% greener than Air Freight)",
        "Lowest total recovery cost: ₹1,05,000 INR"
      ],
      paretoRank: 2,
      compositeScore: 92.0,
      selected: false,
      details: "Transfer 150 surplus units from Delhi NCR Hub to Bengaluru using electrified Dedicated Freight Corridor (DFC) Indian Railways container train.",
      tradeoffSummary: {
        speedRank: "MODERATE",
        costRank: "LOWEST",
        carbonRank: "ECO_OPTIMAL"
      }
    },
    {
      id: "ALT-OPT-3-EAST-TRANSFER-GROUND",
      incidentId,
      name: "Option 3 (Expedited Ground): Delhivery Dedicated Express Truck (Delhi NCR → Bengaluru)",
      actionType: "INTER_WAREHOUSE_TRANSFER",
      fromLocation: "WH-IN-NCR (Delhi NCR Manesar Hub)",
      toLocation: "WH-IN-BLR (Bengaluru Fulfillment Hub)",
      transportMode: "GROUND_EXPEDITED",
      quantity: 150,
      totalCostUsd: 240000, // ₹2,40,000 INR
      deliveryDays: 2.2,
      carbonEmissionKg: 217.5,
      reliabilityScore: 0.96,
      isFeasible: 2.2 < daysOfSupply, // 2.2d < 7.6d -> TRUE!
      feasibilityReasons: [
        "Dual-driver team non-stop sprint across NH-44 corridor (2.2 days transit)",
        "Delhi NCR warehouse has 150 available surplus units",
        "Fastest surface transit option"
      ],
      paretoRank: 3,
      compositeScore: 88.5,
      selected: false,
      details: "Dedicated Delhivery express container truck hauling 150 units non-stop along the NH-44 highway from Delhi NCR to Bengaluru.",
      tradeoffSummary: {
        speedRank: "FASTEST",
        costRank: "MODERATE",
        carbonRank: "MODERATE"
      }
    },
    {
      id: "ALT-OPT-4-QUANTUM-AIR-CHARTER",
      incidentId,
      name: "Option 4 (Charter Flight): SpiceXpress Dedicated Cargo Charter (Hyderabad → Bengaluru)",
      actionType: "PURCHASE_VENDOR",
      vendorId: "VND-QUANTUM-LABS",
      vendorName: "SpiceXpress Air Cargo",
      fromLocation: "Hyderabad RGIA Air Cargo Terminal",
      toLocation: "WH-IN-BLR (Bengaluru Fulfillment Hub)",
      transportMode: "AIR_EXPRESS",
      quantity: 200,
      totalCostUsd: 650000, // ₹6,50,000 INR
      deliveryDays: 1.8,
      carbonEmissionKg: 720.0,
      reliabilityScore: 0.99,
      isFeasible: 1.8 < daysOfSupply,
      feasibilityReasons: [
        "Ultra-fast transit: 1.8 days total door-to-door",
        "Dedicated cargo charter with 99% SLA reliability",
        "Highest cost: ₹6,50,000 INR and elevated carbon emission"
      ],
      paretoRank: 4,
      compositeScore: 85.0,
      selected: false,
      details: "Emergency SpiceXpress Boeing 737 dedicated charter flight from Hyderabad to Bengaluru.",
      tradeoffSummary: {
        speedRank: "FASTEST",
        costRank: "EXPENSIVE",
        carbonRank: "HIGH_CARBON"
      }
    },
    {
      id: "ALT-OPT-5-PRIMARY-OCEAN-STANDARD",
      incidentId,
      name: "Option 5 (Infeasible Baseline): Await JNPT Port Delayed Shipment",
      actionType: "PURCHASE_VENDOR",
      vendorId: "VND-GLOBAL-MICRO",
      vendorName: "JNPT Inbound Importers Co.",
      fromLocation: "JNPT Nhava Sheva Port (Mumbai)",
      toLocation: "WH-IN-BLR (Bengaluru Fulfillment Hub)",
      transportMode: "OCEAN_FREIGHT",
      quantity: 200,
      totalCostUsd: 95000, // ₹95,000 INR
      deliveryDays: 14.0,
      carbonEmissionKg: 84.0,
      reliabilityScore: 0.62,
      isFeasible: false, // 14.0d > 7.6d -> INFEASIBLE!
      feasibilityReasons: [
        "❌ INFEASIBLE: 14.0 days delivery time exceeds 7.6 days stockout threshold",
        "❌ Causes a 6.4-day complete sales outage and ₹74,50,000 in lost revenue",
        "❌ JNPT Port congestion backlog"
      ],
      paretoRank: 5,
      compositeScore: 24.0,
      selected: false,
      details: "Standard port clearance. Lowest freight cost but violates SLA constraint.",
      tradeoffSummary: {
        speedRank: "SLOW",
        costRank: "LOWEST",
        carbonRank: "ECO_OPTIMAL"
      }
    }
  ];

  sandbox.alternatives = alternatives;
  return alternatives;
}

export function executeLogisticsRecoveryAction(
  actionId: string, 
  customOptions?: { forceVendorFailure?: boolean }
): { success: boolean; action: RecoveryAlternative; message: string; failureInjected?: boolean } {
  const sandbox = getLogisticsSandbox();
  const action = sandbox.alternatives.find(a => a.id === actionId) || sandbox.alternatives[0];
  if (!action) {
    throw new Error(`Recovery action with ID '${actionId}' not found.`);
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const incident = sandbox.incidents.find(i => i.id === action.incidentId);

  // Check if failure is injected (For the Failure -> Replan Demo!)
  if (customOptions?.forceVendorFailure || action.vendorId === "VND-APEX-DYNAMICS" && sandbox.vendors.find(v => v.id === "VND-APEX-DYNAMICS")?.status === "capacity_exceeded") {
    const vendor = sandbox.vendors.find(v => v.id === action.vendorId);
    if (vendor) {
      vendor.status = "capacity_exceeded";
      vendor.statusReason = "Sudden airline freight capacity lock-out during festive peak.";
    }
    action.isFeasible = false;
    action.feasibilityReasons.unshift("❌ CRITICAL FAILURE: Air carrier capacity suddenly exhausted.");

    if (incident) {
      incident.status = "FAILED_REPLANNING";
      incident.replanCount += 1;
      incident.replanHistory.push({
        attemptNumber: incident.replanCount,
        failedActionId: action.id,
        failureReason: "Blue Dart Aviation reported sudden capacity lock-out during festive peak.",
        replannedAt: nowIso,
        newChosenActionId: "ALT-OPT-2-EAST-TRANSFER-RAIL"
      });
    }

    sandbox.agentWorkflowLogs.push({
      id: `LOG-FAIL-${Date.now()}`,
      node: "execute_recovery_action_node",
      status: "FAILED",
      details: `Execution Failed for ${action.name}. Carrier reported CAPACITY_EXHAUSTED. Transitioning to REPLAN_NODE.`,
      timestamp: nowIso,
      payload: { actionId: action.id, reason: "CAPACITY_EXHAUSTED" }
    });

    return {
      success: false,
      action,
      message: `Execution failed: Carrier '${action.vendorName}' capacity was locked out. Autonomous recovery agent initiated re-planning loop.`,
      failureInjected: true
    };
  }

  sandbox.alternatives.forEach(a => { a.selected = a.id === action.id; });
  if (incident) {
    incident.selectedAlternativeId = action.id;
    incident.status = "EXECUTED";
  }

  const targetWh = sandbox.inventory.find(i => i.sku === "WTC-NEXUS-U2" && i.warehouseId === "WH-IN-BLR");

  if (action.actionType === "PURCHASE_VENDOR") {
    const newShipmentId = `SHP-REC-${Date.now().toString().slice(-4)}`;
    const trackingNum = `BLUEDART-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment: LogisticsShipment = {
      id: newShipmentId,
      trackingNumber: trackingNum,
      sku: "WTC-NEXUS-U2",
      productName: "Nexus SmartWatch Ultra 2",
      quantity: action.quantity,
      origin: action.fromLocation,
      destination: action.toLocation,
      carrier: action.transportMode === "AIR_EXPRESS" ? "Blue Dart Aviation (Boeing 737F)" : "SpiceXpress Cargo",
      transportMode: action.transportMode,
      departureDate: nowIso,
      etaDays: action.deliveryDays,
      etaDate: new Date(now.getTime() + action.deliveryDays * 24 * 3600 * 1000).toISOString(),
      costUsd: action.totalCostUsd,
      carbonEmissionKg: action.carbonEmissionKg,
      status: "in_transit",
      routeId: "RT-MAA-BLR-AIR-EXP",
      timeline: [
        { timestamp: nowIso, event: "Emergency recovery order booked and confirmed by Chennai supplier", location: action.fromLocation },
        { timestamp: nowIso, event: "Palletized for Blue Dart flight to Bengaluru BLR Airport", location: action.fromLocation }
      ]
    };
    sandbox.shipments.unshift(newShipment);

    if (targetWh) {
      targetWh.inTransitStock += action.quantity;
      targetWh.status = "recovering";
      targetWh.lastUpdated = nowIso;
    }
  } else if (action.actionType === "INTER_WAREHOUSE_TRANSFER") {
    const sourceWh = sandbox.inventory.find(i => i.sku === "WTC-NEXUS-U2" && i.warehouseId === "WH-IN-NCR");
    if (sourceWh) {
      sourceWh.onHandStock -= action.quantity;
      sourceWh.availableStock -= action.quantity;
      sourceWh.daysOfSupply = Number((sourceWh.availableStock / sourceWh.dailyBurnRate).toFixed(1));
      sourceWh.lastUpdated = nowIso;
    }

    const transferShipmentId = `SHP-XFER-${Date.now().toString().slice(-4)}`;
    const trackingNum = `CONCOR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment: LogisticsShipment = {
      id: transferShipmentId,
      trackingNumber: trackingNum,
      sku: "WTC-NEXUS-U2",
      productName: "Nexus SmartWatch Ultra 2",
      quantity: action.quantity,
      origin: action.fromLocation,
      destination: action.toLocation,
      carrier: action.transportMode === "RAIL_FREIGHT" ? "Indian Railways DFC Container Express" : "Delhivery National Super-Truck",
      transportMode: action.transportMode,
      departureDate: nowIso,
      etaDays: action.deliveryDays,
      etaDate: new Date(now.getTime() + action.deliveryDays * 24 * 3600 * 1000).toISOString(),
      costUsd: action.totalCostUsd,
      carbonEmissionKg: action.carbonEmissionKg,
      status: "in_transit",
      routeId: "RT-NCR-BLR-RAIL",
      timeline: [
        { timestamp: nowIso, event: "Stock release authorized at Delhi NCR Manesar Super-Hub", location: "WH-IN-NCR" },
        { timestamp: nowIso, event: "Loaded onto Dedicated Freight Corridor (DFC) Container Train", location: "Dadri / Tuglakabad Rail Yard" }
      ]
    };
    sandbox.shipments.unshift(newShipment);

    if (targetWh) {
      targetWh.inTransitStock += action.quantity;
      targetWh.status = "recovering";
      targetWh.lastUpdated = nowIso;
    }
  }

  sandbox.agentWorkflowLogs.push({
    id: `LOG-EXEC-${Date.now()}`,
    node: "execute_recovery_action_node",
    status: "COMPLETED",
    details: `Executed ${action.name}. Inbound stock: +${action.quantity} units. ETA: ${action.deliveryDays} days.`,
    timestamp: nowIso,
    payload: { actionId: action.id, mode: action.transportMode, quantity: action.quantity, cost: action.totalCostUsd }
  });

  return {
    success: true,
    action,
    message: `Recovery action '${action.name}' executed successfully. Inbound replenishment of ${action.quantity} units dispatched.`
  };
}

export function verifyLogisticsRecovery(incidentId: string, actionId?: string): VerificationReport {
  const sandbox = getLogisticsSandbox();
  const incident = sandbox.incidents.find(i => i.id === incidentId) || sandbox.incidents[0];
  const targetActionId = actionId || incident?.selectedAlternativeId || "ALT-OPT-1-APEX-AIR";
  const action = sandbox.alternatives.find(a => a.id === targetActionId) || sandbox.alternatives[0];

  const now = new Date();
  const nowIso = now.toISOString();
  const targetWh = sandbox.inventory.find(i => i.sku === "WTC-NEXUS-U2" && i.warehouseId === "WH-IN-BLR");

  const onHand = targetWh ? targetWh.onHandStock : 32;
  const burnRate = targetWh ? targetWh.dailyBurnRate : 4.2;
  const incoming = action.quantity;
  const deliveryDays = action.deliveryDays;
  const projectedStockAtArrival = Number((onHand - (deliveryDays * burnRate) + incoming).toFixed(1));
  const effectiveDaysOfSupply = Number(((onHand + incoming) / burnRate).toFixed(1));

  const constraintResolved = deliveryDays < incident.daysOfSupply && projectedStockAtArrival > (targetWh?.safetyStock || 75);
  const certificateId = `CERT-IN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const report: VerificationReport = {
    incidentId: incident.id,
    actionId: action.id,
    actionTitle: action.name,
    actionType: action.actionType,
    verifiedAt: nowIso,
    preRecovery: {
      availableStock: 32,
      daysOfSupply: 7.6,
      stockoutGapDays: 6.4,
      status: "stockout_imminent"
    },
    postRecovery: {
      projectedStock: projectedStockAtArrival,
      incomingUnits: incoming,
      effectiveDaysOfSupply,
      newEtaDays: deliveryDays,
      status: effectiveDaysOfSupply > 30 ? "healthy" : "recovering"
    },
    totalCostUsd: action.totalCostUsd,
    totalCarbonKg: action.carbonEmissionKg,
    slaDaysRemaining: Number((incident.daysOfSupply - deliveryDays).toFixed(1)),
    constraintResolved,
    verificationPassed: constraintResolved,
    recoveryCertificateId: certificateId,
    message: constraintResolved 
      ? `VERIFICATION PASSED: Replenishment of ${incoming} units arrives in ${deliveryDays} days (${(incident.daysOfSupply - deliveryDays).toFixed(1)} days before Bengaluru stockout). Effective supply restored to ${effectiveDaysOfSupply} days.`
      : `VERIFICATION FAILED: Replenishment does not satisfy SLA constraints.`,
    auditTrail: [
      {
        step: "Bengaluru Stock Projection Audit",
        timestamp: nowIso,
        detail: `Verified stock (${onHand} units) with burn rate (${burnRate}/day). Stock level at arrival: ${projectedStockAtArrival} units (Buffer > Safety Stock 75).`,
        status: "SUCCESS"
      },
      {
        step: "India Multi-Modal Transit SLA Audit",
        timestamp: nowIso,
        detail: `Transit duration (${deliveryDays} days) arrives before day 7.6 stockout deadline.`,
        status: "SUCCESS"
      },
      {
        step: "Cost (INR) & ESG Carbon Audit",
        timestamp: nowIso,
        detail: `Cost: ₹${action.totalCostUsd.toLocaleString('en-IN')} INR. Carbon Footprint: ${action.carbonEmissionKg} kg CO2.`,
        status: "SUCCESS"
      },
      {
        step: "Customer SLA Resolution",
        timestamp: nowIso,
        detail: `Constraint cleared. Customer fulfillment rate secured at 99.8%.`,
        status: "SUCCESS"
      }
    ]
  };

  incident.status = "RESOLVED";
  incident.verificationResult = report;
  if (targetWh) {
    targetWh.status = "healthy";
    targetWh.daysOfSupply = effectiveDaysOfSupply;
    targetWh.stockoutGapDays = 0;
  }

  sandbox.verificationReports.unshift(report);
  sandbox.agentWorkflowLogs.push({
    id: `LOG-VERIFY-${Date.now()}`,
    node: "verify_outcome_node",
    status: "COMPLETED",
    details: `Verification PASSED with Certificate ${certificateId}. Effective supply boosted to ${effectiveDaysOfSupply} days.`,
    timestamp: nowIso,
    payload: { certificateId, effectiveDaysOfSupply, constraintResolved }
  });

  return report;
}

export function triggerDisruptionReplanDemo(): {
  step1_disruption: DisruptionIncident;
  step2_failedAction: RecoveryAlternative;
  step3_failureReport: string;
  step4_replanNode: string;
  step5_fallbackAction: RecoveryAlternative;
  step6_verification: VerificationReport;
} {
  const sandbox = initializeLogisticsSandbox();
  const incident = sandbox.incidents[0];

  const option1 = sandbox.alternatives.find(a => a.id === "ALT-OPT-1-APEX-AIR")!;
  
  const vendor = sandbox.vendors.find(v => v.id === "VND-APEX-DYNAMICS")!;
  vendor.status = "capacity_exceeded";
  vendor.statusReason = "Air carrier reported sudden capacity lockout during festive shipping peak.";
  
  const executionFail = executeLogisticsRecoveryAction(option1.id, { forceVendorFailure: true });

  sandbox.agentWorkflowLogs.push({
    id: `LOG-REPLAN-${Date.now()}`,
    node: "replan_recovery_node",
    status: "REPLANNING",
    details: "RE-PLANNING TRIGGERED: Re-evaluating Pareto candidate pool. Selected Eco-Optimal Option 2 (Delhi NCR → Bengaluru DFC Rail Transfer).",
    timestamp: new Date().toISOString()
  });

  const option2 = sandbox.alternatives.find(a => a.id === "ALT-OPT-2-EAST-TRANSFER-RAIL")!;
  option2.selected = true;
  executeLogisticsRecoveryAction(option2.id);

  const verification = verifyLogisticsRecovery(incident.id, option2.id);

  return {
    step1_disruption: incident,
    step2_failedAction: option1,
    step3_failureReport: executionFail.message,
    step4_replanNode: "LangGraph REPLAN_NODE re-evaluated Pareto frontier and selected Indian Railways DFC Express Rail Transfer.",
    step5_fallbackAction: option2,
    step6_verification: verification
  };
}
