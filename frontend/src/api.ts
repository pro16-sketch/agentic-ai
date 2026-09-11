import axios from 'axios';
import {
  BusinessStateResponse,
  InvestigationDetails,
  AgentEvent,
  ScenarioSimulationResult
} from './types';

const API_BASE = '/api';

export const fetchBusinessState = async (): Promise<BusinessStateResponse> => {
  const response = await axios.get<BusinessStateResponse>(`${API_BASE}/business-state`);
  return response.data;
};

export const fetchInvestigationDetails = async (id: number): Promise<InvestigationDetails> => {
  const response = await axios.get<InvestigationDetails>(`${API_BASE}/investigation/${id}`);
  return response.data;
};

export const triggerInvestigation = async (objective?: string): Promise<{ investigation_id: number }> => {
  const response = await axios.post<{ investigation_id: number }>(`${API_BASE}/investigate`, { objective });
  return response.data;
};

export const fetchAgentEvents = async (): Promise<{ agent_status: string; events: AgentEvent[] }> => {
  const response = await axios.get<{ agent_status: string; events: AgentEvent[] }>(`${API_BASE}/agent-events`);
  return response.data;
};

export const approveAction = async (decisionId: number): Promise<{ message: string; decision_id: number }> => {
  const response = await axios.post(`${API_BASE}/approve-action`, { decision_id: decisionId });
  return response.data;
};

export const rejectAction = async (decisionId: number, reason?: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_BASE}/reject-action`, { decision_id: decisionId, reason });
  return response.data;
};

export const runSimulation = async (params: {
  price_change_pct: number;
  recovery_rate_pct: number;
  expedite_cost: number;
  reorder_qty: number;
}): Promise<ScenarioSimulationResult> => {
  const response = await axios.post<ScenarioSimulationResult>(`${API_BASE}/simulate`, params);
  return response.data;
};

export const resetDemoData = async (): Promise<{ message: string }> => {
  const response = await axios.post(`${API_BASE}/reset-demo-data`);
  return response.data;
};
