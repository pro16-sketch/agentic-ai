import axios from 'axios';
import { 
  BusinessStateResponse, 
  InvestigationDetails, 
  AgentEvent,
  ScenarioSimulationResult 
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
}): Promise<ScenarioSimulationResult> => {
  const res = await api.post<ScenarioSimulationResult>('/api/simulate', params);
  return res.data;
};
