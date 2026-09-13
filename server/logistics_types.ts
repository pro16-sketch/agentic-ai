export type TransportMode = 'AIR_EXPRESS' | 'AIR_STANDARD' | 'RAIL_FREIGHT' | 'OCEAN_FREIGHT' | 'GROUND_EXPEDITED';

export type ShipmentStatus = 'in_transit' | 'delayed' | 'port_congested' | 'rerouted' | 'delivered' | 'failed' | 'expedited';

export type InventoryStatus = 'healthy' | 'at_risk' | 'stockout_imminent' | 'recovering';

export type IncidentStatus = 
  | 'DETECTED' 
  | 'INVESTIGATING' 
  | 'OPTIMIZING' 
  | 'EXECUTED' 
  | 'VERIFIED' 
  | 'FAILED_REPLANNING' 
  | 'RESOLVED';

export interface WarehouseInventory {
  id: string;
  warehouseId: string;
  warehouseName: string;
  location: string; // e.g. "US-West (Reno)", "US-East (Allentown)", "EU-Central (Frankfurt)", "APAC (Singapore)"
  sku: string;
  productName: string;
  onHandStock: number;
  reservedStock: number;
  availableStock: number;
  inTransitStock: number;
  dailyBurnRate: number;
  safetyStock: number;
  reorderPoint: number;
  primarySupplierLeadDays: number;
  daysOfSupply: number; // calculated: availableStock / dailyBurnRate
  projectedStockoutDays: number; // calculated: daysOfSupply
  stockoutGapDays: number; // primarySupplierLeadDays - daysOfSupply (if > 0, stockout occurs before replenishment!)
  status: InventoryStatus;
  lastUpdated: string;
}

export interface LogisticsShipment {
  id: string;
  trackingNumber: string;
  sku: string;
  productName: string;
  quantity: number;
  origin: string;
  destination: string;
  carrier: string;
  transportMode: TransportMode;
  departureDate: string;
  etaDays: number;
  etaDate: string;
  costUsd: number;
  carbonEmissionKg: number;
  status: ShipmentStatus;
  routeId: string;
  delayNotice?: string;
  reroutedFrom?: string;
  timeline: Array<{ timestamp: string; event: string; location: string }>;
}

export interface LogisticsVendor {
  id: string;
  name: string;
  code: string;
  certified: boolean;
  reliabilityScore: number; // 0.0 - 1.0
  supportedSkus: string[];
  unitCost: number;
  standardLeadDays: number;
  expediteLeadDays: number;
  maxWeeklyCapacity: number;
  currentAvailableCapacity: number;
  carbonIntensityKgPerUnit: number;
  originPort: string;
  status: 'active' | 'bottlenecked' | 'offline' | 'capacity_exceeded';
  statusReason?: string;
}

export interface LogisticsRoute {
  id: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  distanceKm: number;
  transitDays: number;
  costPerUnit: number;
  carbonKgPerUnit: number;
  reliabilityRate: number;
  congestionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface DisruptionIncident {
  id: string;
  type: 'STOCKOUT_IMMINENT' | 'PORT_BOTTLENECK' | 'CARRIER_BREAKDOWN' | 'VENDOR_CAPACITY_CRUNCH' | 'DEMAND_SURGE';
  sku: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  constraintViolations: string[];
  currentStock: number;
  dailyBurnRate: number;
  leadTimeDays: number;
  daysOfSupply: number;
  stockoutGapDays: number;
  detectedAt: string;
  status: IncidentStatus;
  selectedAlternativeId?: string;
  executionResult?: Record<string, any>;
  verificationResult?: VerificationReport;
  replanCount: number;
  replanHistory: Array<{
    attemptNumber: number;
    failedActionId: string;
    failureReason: string;
    replannedAt: string;
    newChosenActionId: string;
  }>;
}

export interface RecoveryAlternative {
  id: string;
  incidentId: string;
  name: string;
  actionType: 'PURCHASE_VENDOR' | 'INTER_WAREHOUSE_TRANSFER' | 'REROUTE_SHIPMENT' | 'EXPEDITE_TRANSIT' | 'DYNAMIC_ALLOCATION';
  vendorId?: string;
  vendorName?: string;
  fromLocation: string;
  toLocation: string;
  transportMode: TransportMode;
  quantity: number;
  totalCostUsd: number;
  deliveryDays: number;
  carbonEmissionKg: number;
  reliabilityScore: number;
  isFeasible: boolean;
  feasibilityReasons: string[];
  paretoRank: number; // 1 = Best, 2, 3...
  compositeScore: number; // 0 - 100
  selected: boolean;
  details: string;
  tradeoffSummary: {
    speedRank: 'FASTEST' | 'MODERATE' | 'SLOW';
    costRank: 'LOWEST' | 'MODERATE' | 'EXPENSIVE';
    carbonRank: 'ECO_OPTIMAL' | 'MODERATE' | 'HIGH_CARBON';
  };
}

export interface VerificationReport {
  incidentId: string;
  actionId: string;
  actionTitle: string;
  actionType: string;
  verifiedAt: string;
  preRecovery: {
    availableStock: number;
    daysOfSupply: number;
    stockoutGapDays: number;
    status: InventoryStatus;
  };
  postRecovery: {
    projectedStock: number;
    incomingUnits: number;
    effectiveDaysOfSupply: number;
    newEtaDays: number;
    status: InventoryStatus;
  };
  totalCostUsd: number;
  totalCarbonKg: number;
  slaDaysRemaining: number;
  constraintResolved: boolean;
  verificationPassed: boolean;
  recoveryCertificateId: string;
  message: string;
  auditTrail: Array<{ step: string; timestamp: string; detail: string; status: 'SUCCESS' | 'WARNING' | 'FAILED' }>;
}

export interface LogisticsDigitalTwinState {
  inventory: WarehouseInventory[];
  shipments: LogisticsShipment[];
  vendors: LogisticsVendor[];
  routes: LogisticsRoute[];
  incidents: DisruptionIncident[];
  alternatives: RecoveryAlternative[];
  verificationReports: VerificationReport[];
  agentWorkflowLogs: Array<{
    id: string;
    node: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'REPLANNING';
    details: string;
    timestamp: string;
    payload?: any;
  }>;
}
