import axios from 'axios';
import { 
  BusinessStateResponse, 
  InvestigationDetails, 
  AgentEvent,
  ScenarioSimulationResult,
  AskArgusResult,
  LogisticsDigitalTwinState,
  WarehouseInventory,
  LogisticsShipment,
  LogisticsVendor,
  LogisticsRoute,
  RecoveryAlternative,
  VerificationReport
} from './types';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBusinessState = async (): Promise<BusinessStateResponse> => {
  const res = await api.get<BusinessStateResponse>('/api/business-state');
  return res.data;
};

export const fetchInvestigationDetails = async (id: number): Promise<InvestigationDetails> => {
  const res = await api.get<InvestigationDetails>(`/api/investigation/${id}`);
  return res.data;
};

export const triggerInvestigation = async (objective?: string): Promise<{
  message: string;
  investigation_id: number;
  status: string;
}> => {
  const res = await api.post('/api/investigate', { objective });
  return res.data;
};

export const fetchAgentEvents = async (): Promise<{
  agent_status: string;
  active_threads: number;
  events: AgentEvent[];
}> => {
  const res = await api.get('/api/agent-events');
  return res.data;
};

export const approveAction = async (decisionId: number): Promise<any> => {
  const res = await api.post('/api/approve-action', { decision_id: decisionId });
  return res.data;
};

export const rejectAction = async (decisionId: number, reason: string): Promise<any> => {
  const res = await api.post('/api/reject-action', { decision_id: decisionId, reason });
  return res.data;
};

export const resetDemoData = async (): Promise<any> => {
  const res = await api.post('/api/reset-demo-data');
  return res.data;
};

export const runSimulation = async (params: {
  price_change_pct: number;
  recovery_rate_pct: number;
  expedite_cost: number;
  reorder_qty: number;
  expedite_shipping_cost?: number;
  reorder_quantity?: number;
}): Promise<ScenarioSimulationResult> => {
  const res = await api.post<ScenarioSimulationResult>('/api/simulate', params);
  return res.data;
};

export const askArgusApi = async (question: string): Promise<AskArgusResult> => {
  const res = await api.post<AskArgusResult>('/api/agent-ask', { question });
  return res.data;
};

export const injectScenarioApi = async (scenario: string, customPrompt?: string): Promise<{
  message: string;
  investigation_id: number;
  investigation: InvestigationDetails;
}> => {
  const res = await api.post('/api/inject-scenario', { scenario, custom_prompt: customPrompt });
  return res.data;
};

export const fetchAgentSitrep = async (id?: number): Promise<{ text: string; audioScript: string }> => {
  const url = id ? `/api/agent-sitrep/${id}` : '/api/agent-sitrep';
  const res = await api.get<{ text: string; audioScript: string }>(url);
  return res.data;
};

// =========================================================================
// PS6: AUTONOMOUS RETAIL SUPPLY CHAIN RECOVERY AGENT API CALLS
// =========================================================================

export const fetchLogisticsState = async (): Promise<LogisticsDigitalTwinState> => {
  const res = await api.get<LogisticsDigitalTwinState>('/api/logistics/state');
  return res.data;
};

export const fetchLogisticsInventory = async (sku?: string, warehouseId?: string): Promise<WarehouseInventory[]> => {
  const params: Record<string, string> = {};
  if (sku) params.sku = sku;
  if (warehouseId) params.warehouseId = warehouseId;
  const res = await api.get<WarehouseInventory[]>('/api/logistics/inventory', { params });
  return res.data;
};

export const fetchLogisticsShipments = async (): Promise<LogisticsShipment[]> => {
  const res = await api.get<LogisticsShipment[]>('/api/logistics/shipments');
  return res.data;
};

export const fetchLogisticsVendors = async (): Promise<LogisticsVendor[]> => {
  const res = await api.get<LogisticsVendor[]>('/api/logistics/vendors');
  return res.data;
};

export const fetchLogisticsRoutes = async (): Promise<LogisticsRoute[]> => {
  const res = await api.get<LogisticsRoute[]>('/api/logistics/routes');
  return res.data;
};

export const runDisruptionScan = async (): Promise<any> => {
  const res = await api.post('/api/logistics/monitor-detect');
  return res.data;
};

export const runParetoOptimization = async (incidentId?: string): Promise<{
  incident_id: string;
  total_candidates: number;
  alternatives: RecoveryAlternative[];
}> => {
  const res = await api.post('/api/logistics/investigate-optimize', { incident_id: incidentId });
  return res.data;
};

export const executeLogisticsAction = async (actionId: string, forceFailure: boolean = false): Promise<{
  success: boolean;
  action: RecoveryAlternative;
  message: string;
  failureInjected?: boolean;
}> => {
  const res = await api.post('/api/logistics/execute-action', { action_id: actionId, force_failure: forceFailure });
  return res.data;
};

export const verifyLogisticsRecoveryApi = async (incidentId?: string, actionId?: string): Promise<VerificationReport> => {
  const res = await api.post<VerificationReport>('/api/logistics/verify-recovery', {
    incident_id: incidentId,
    action_id: actionId
  });
  return res.data;
};

export const runLangGraphRecoveryApi = async (incidentId?: string, triggerReplanDemo?: boolean): Promise<{
  graph_execution: string;
  final_state: any;
  digital_twin: LogisticsDigitalTwinState;
}> => {
  const res = await api.post('/api/logistics/run-langgraph', {
    incident_id: incidentId,
    trigger_replan_demo: triggerReplanDemo
  });
  return res.data;
};

export const triggerReplanDemoApi = async (): Promise<{
  message: string;
  demo: {
    step1_disruption: any;
    step2_failedAction: any;
    step3_failureReport: string;
    step4_replanNode: string;
    step5_fallbackAction: any;
    step6_verification: VerificationReport;
  };
}> => {
  const res = await api.post('/api/logistics/trigger-replan-demo');
  return res.data;
};

export const resetLogisticsSandboxApi = async (): Promise<any> => {
  const res = await api.post('/api/logistics/reset');
  return res.data;
};

