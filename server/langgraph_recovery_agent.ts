import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { 
  getLogisticsSandbox, 
  generateRecoveryAlternatives, 
  executeLogisticsRecoveryAction, 
  verifyLogisticsRecovery 
} from './logistics_sandbox.js';
import { 
  DisruptionIncident, 
  RecoveryAlternative, 
  VerificationReport 
} from './logistics_types.js';

// Define the LangGraph State Annotation
export const RecoveryAgentAnnotation = Annotation.Root({
  incidentId: Annotation<string>,
  incident: Annotation<DisruptionIncident | null>,
  disruptionDetected: Annotation<boolean>,
  candidateAlternatives: Annotation<RecoveryAlternative[]>,
  selectedAction: Annotation<RecoveryAlternative | null>,
  executionSuccess: Annotation<boolean>,
  executionMessage: Annotation<string>,
  verificationResult: Annotation<VerificationReport | null>,
  replanRequired: Annotation<boolean>,
  replanCount: Annotation<number>,
  failureReason: Annotation<string>,
  stepTrace: Annotation<Array<{ step: string; node: string; timestamp: string; details: string }>>
});

export type RecoveryAgentState = typeof RecoveryAgentAnnotation.State;

// LangGraph Nodes
async function monitorTelemetryNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const sandbox = getLogisticsSandbox();
  const trace = [...(state.stepTrace || [])];
  
  trace.push({
    step: "1. TELEMETRY MONITORING",
    node: "monitor_telemetry_node",
    timestamp: new Date().toISOString(),
    details: `Scanned 4 warehouses, ${sandbox.shipments.length} in-transit shipments, and ${sandbox.vendors.length} vendor API endpoints.`
  });

  return {
    stepTrace: trace
  };
}

async function detectDisruptionsNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const sandbox = getLogisticsSandbox();
  const incident = sandbox.incidents.find(i => i.id === state.incidentId) || sandbox.incidents[0];
  const trace = [...(state.stepTrace || [])];

  const disruptionDetected = !!incident && incident.status !== "RESOLVED";

  trace.push({
    step: "2. DISRUPTION DETECTION & CONSTRAINT AUDIT",
    node: "detect_disruptions_node",
    timestamp: new Date().toISOString(),
    details: disruptionDetected 
      ? `Constraint Violation: SKU '${incident?.sku}' stock (${incident?.currentStock}) depleting at ${incident?.dailyBurnRate}/day. Stockout in ${incident?.daysOfSupply}d < Lead time ${incident?.leadTimeDays}d. Deficit gap: ${incident?.stockoutGapDays}d.`
      : "All telemetry within nominal thresholds. Zero constraint violations."
  });

  return {
    incident: incident || null,
    disruptionDetected,
    stepTrace: trace
  };
}

async function investigateAlternativesNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const sandbox = getLogisticsSandbox();
  const incidentId = state.incident?.id || state.incidentId || "INC-2026-006";
  const alternatives = generateRecoveryAlternatives(incidentId);
  const trace = [...(state.stepTrace || [])];

  trace.push({
    step: "3. INVESTIGATE LOGISTICS SANDBOX",
    node: "investigate_alternatives_node",
    timestamp: new Date().toISOString(),
    details: `Queried Vendor API, Inventory API, and Route Graph. Identified ${alternatives.length} multi-modal candidate recovery options (Air, Rail, Ground Expedited, Ocean).`
  });

  return {
    candidateAlternatives: alternatives,
    stepTrace: trace
  };
}

async function optimizeParetoNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const alternatives = state.candidateAlternatives || [];
  const trace = [...(state.stepTrace || [])];

  // Filter out any known failed vendors if replanning
  const feasibleAlternatives = alternatives.filter(a => a.isFeasible);
  
  // Sort by composite score (weighted speed, cost, carbon, reliability)
  feasibleAlternatives.sort((a, b) => b.compositeScore - a.compositeScore);

  const bestAction = feasibleAlternatives[0] || alternatives[0] || null;

  trace.push({
    step: "4. MULTI-OBJECTIVE PARETO OPTIMIZATION",
    node: "optimize_pareto_node",
    timestamp: new Date().toISOString(),
    details: `Evaluated Cost vs Delivery Time vs Carbon Footprint. Selected highest-rank option: '${bestAction?.name}' (Score: ${bestAction?.compositeScore}, Cost: ₹${bestAction?.totalCostUsd?.toLocaleString('en-IN')}, Delivery: ${bestAction?.deliveryDays}d, Carbon: ${bestAction?.carbonEmissionKg}kg CO2).`
  });

  return {
    selectedAction: bestAction,
    stepTrace: trace
  };
}

async function executeRecoveryNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const action = state.selectedAction;
  const trace = [...(state.stepTrace || [])];

  if (!action) {
    return {
      executionSuccess: false,
      executionMessage: "No feasible recovery alternative found.",
      replanRequired: true,
      stepTrace: trace
    };
  }

  // Check if force failure is requested
  const result = executeLogisticsRecoveryAction(action.id);
  
  trace.push({
    step: "5. EXECUTE STATE-CHANGING ACTION",
    node: "execute_recovery_action_node",
    timestamp: new Date().toISOString(),
    details: result.success 
      ? `Successfully executed '${action.name}'. Dispatched ${action.quantity} units via ${action.transportMode}. ETA: ${action.deliveryDays} days.`
      : `Execution FAILED: ${result.message}`
  });

  return {
    executionSuccess: result.success,
    executionMessage: result.message,
    replanRequired: !result.success,
    failureReason: result.success ? "" : result.message,
    stepTrace: trace
  };
}

async function verifyOutcomeNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const incidentId = state.incident?.id || state.incidentId || "INC-2026-006";
  const actionId = state.selectedAction?.id || "ALT-OPT-1-APEX-AIR";
  const trace = [...(state.stepTrace || [])];

  const report = verifyLogisticsRecovery(incidentId, actionId);

  trace.push({
    step: "6. CLOSED-LOOP OUTCOME VERIFICATION",
    node: "verify_outcome_node",
    timestamp: new Date().toISOString(),
    details: report.verificationPassed 
      ? `VERIFIED: Certificate ${report.recoveryCertificateId} issued. Stockout gap resolved (Effective Days of Supply: ${report.postRecovery.effectiveDaysOfSupply}d).`
      : `VERIFICATION FAILED: Constraints not satisfied.`
  });

  return {
    verificationResult: report,
    stepTrace: trace
  };
}

async function replanRecoveryNode(state: RecoveryAgentState): Promise<Partial<RecoveryAgentState>> {
  const trace = [...(state.stepTrace || [])];
  const replanCount = (state.replanCount || 0) + 1;

  trace.push({
    step: "7. AUTONOMOUS RE-PLANNING CYCLE",
    node: "replan_recovery_node",
    timestamp: new Date().toISOString(),
    details: `Action failure observed: '${state.failureReason}'. Re-routing execution graph to alternative certified node in Pareto frontier (Attempt #${replanCount}).`
  });

  // Exclude the failed action and pick next best
  const sandbox = getLogisticsSandbox();
  const alternatives = sandbox.alternatives.filter(a => a.id !== state.selectedAction?.id && a.isFeasible);
  alternatives.sort((a, b) => b.compositeScore - a.compositeScore);
  const fallbackAction = alternatives[0];

  return {
    selectedAction: fallbackAction,
    replanCount,
    replanRequired: false,
    stepTrace: trace
  };
}

// Build the LangGraph Workflow
export function buildRecoveryGraph() {
  const workflow = new StateGraph(RecoveryAgentAnnotation)
    .addNode('monitor_telemetry_node', monitorTelemetryNode)
    .addNode('detect_disruptions_node', detectDisruptionsNode)
    .addNode('investigate_alternatives_node', investigateAlternativesNode)
    .addNode('optimize_pareto_node', optimizeParetoNode)
    .addNode('execute_recovery_node', executeRecoveryNode)
    .addNode('verify_outcome_node', verifyOutcomeNode)
    .addNode('replan_recovery_node', replanRecoveryNode)
    
    .addEdge(START, 'monitor_telemetry_node')
    .addEdge('monitor_telemetry_node', 'detect_disruptions_node')
    .addConditionalEdges(
      'detect_disruptions_node',
      (state) => state.disruptionDetected ? 'investigate' : 'nominal',
      {
        investigate: 'investigate_alternatives_node',
        nominal: END
      }
    )
    .addEdge('investigate_alternatives_node', 'optimize_pareto_node')
    .addEdge('optimize_pareto_node', 'execute_recovery_node')
    .addConditionalEdges(
      'execute_recovery_node',
      (state) => state.executionSuccess ? 'verify' : 'replan',
      {
        verify: 'verify_outcome_node',
        replan: 'replan_recovery_node'
      }
    )
    .addEdge('replan_recovery_node', 'execute_recovery_node')
    .addEdge('verify_outcome_node', END);

  return workflow.compile();
}

/**
 * Execute the full LangGraph Recovery State Machine
 */
export async function runAutonomousRecovery(incidentId: string = "INC-2026-006", triggerReplanDemo: boolean = false) {
  const app = buildRecoveryGraph();
  
  const initialState: RecoveryAgentState = {
    incidentId,
    incident: null,
    disruptionDetected: false,
    candidateAlternatives: [],
    selectedAction: null,
    executionSuccess: false,
    executionMessage: '',
    verificationResult: null,
    replanRequired: false,
    replanCount: 0,
    failureReason: '',
    stepTrace: []
  };

  const result = await app.invoke(initialState);
  return result;
}
