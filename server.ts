import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getStore, resetStore } from './server/store.js';
import { getBusinessMetrics, runScenarioSimulation } from './server/analytics.js';
import { runInvestigation, askArgus, generateExecutiveSitrep } from './server/agent.js';
import { Outcome, AuditLog } from './server/types.js';
import {
  getLogisticsSandbox,
  resetLogisticsSandbox,
  generateRecoveryAlternatives,
  executeLogisticsRecoveryAction,
  verifyLogisticsRecovery,
  triggerDisruptionReplanDemo
} from './server/logistics_sandbox.js';
import { runAutonomousRecovery } from './server/langgraph_recovery_agent.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize in-memory data store & logistics sandbox
  getStore();
  getLogisticsSandbox();

  // Root health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      system: 'ARGUS AI Operations Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // 1. Business State: High-level financial KPIs, SKU breakdown, return stats, active alerts
  const handleBusinessState = (req: express.Request, res: express.Response) => {
    const store = getStore();
    const metrics = getBusinessMetrics();
    const activeGoal = store.goals[store.goals.length - 1] || null;
    const activeInvestigation = store.investigations[store.investigations.length - 1] || null;

    res.json({
      metrics,
      active_goal: activeGoal ? {
        id: activeGoal.id,
        title: activeGoal.title,
        description: activeGoal.description,
        status: activeGoal.status,
        target_metric: activeGoal.target_metric
      } : null,
      active_investigation_id: activeInvestigation ? activeInvestigation.id : null
    });
  };
  app.get('/business-state', handleBusinessState);
  app.get('/api/business-state', handleBusinessState);

  // 2. Trigger Investigation
  const handleInvestigate = (req: express.Request, res: express.Response) => {
    const objective = req.body?.objective || "Audit Return Rate Spike & Supply Chain Lead Times";
    const investigation = runInvestigation(objective);
    res.json({
      message: "Investigation successfully initialized and completed by ARGUS Agent Engine.",
      investigation_id: investigation.id,
      status: investigation.status
    });
  };
  app.post('/investigate', handleInvestigate);
  app.post('/api/investigate', handleInvestigate);

  // 3. Get Investigation Details
  const handleGetInvestigation = (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id, 10);
    const store = getStore();
    const investigation = store.investigations.find(inv => inv.id === id);

    if (!investigation) {
      return res.status(404).json({ detail: `Investigation with ID ${id} not found.` });
    }

    const hypotheses = store.hypotheses.filter(h => h.investigation_id === id);
    const toolCalls = store.toolCalls.filter(tc => tc.investigation_id === id);
    const decisions = store.decisions.filter(d => d.investigation_id === id);

    const decisionsList = decisions.map(d => {
      const outcome = store.outcomes.find(o => o.decision_id === d.id);
      return {
        id: d.id,
        title: d.title,
        strategy_type: d.strategy_type,
        description: d.description,
        estimated_cost: d.estimated_cost,
        projected_revenue_impact: d.projected_revenue_impact,
        projected_roi: d.projected_roi,
        risk_level: d.risk_level,
        status: d.status,
        outcome: outcome ? {
          id: outcome.id,
          actual_roi: outcome.actual_roi,
          revenue_recovered: outcome.revenue_recovered,
          status: outcome.status,
          summary: outcome.summary
        } : null
      };
    });

    res.json({
      id: investigation.id,
      metric_name: investigation.metric_name,
      anomaly_score: investigation.anomaly_score,
      status: investigation.status,
      summary: investigation.summary,
      root_cause: investigation.root_cause,
      created_at: investigation.created_at,
      hypotheses: hypotheses.map(h => ({
        id: h.id,
        hypothesis_text: h.hypothesis_text,
        confidence_score: h.confidence_score,
        validation_status: h.validation_status,
        evidence: h.evidence
      })),
      tool_calls: toolCalls.map(tc => ({
        id: tc.id,
        tool_name: tc.tool_name,
        input_params: tc.input_params,
        output_result: tc.output_result,
        execution_time_ms: tc.execution_time_ms,
        created_at: tc.created_at
      })),
      decisions: decisionsList
    });
  };
  app.get('/investigation/:id', handleGetInvestigation);
  app.get('/api/investigation/:id', handleGetInvestigation);

  // 4. Agent Events feed
  const handleAgentEvents = (req: express.Request, res: express.Response) => {
    const store = getStore();
    const events: Array<{ id: string; type: string; title: string; details: string; timestamp: string }> = [];

    store.toolCalls.forEach(tc => {
      events.push({
        id: `tc-${tc.id}`,
        type: "TOOL_EXECUTION",
        title: `Executed Tool: ${tc.tool_name}`,
        details: `Inputs: ${JSON.stringify(tc.input_params)} -> Execution time: ${tc.execution_time_ms}ms`,
        timestamp: tc.created_at
      });
    });

    store.auditLogs.forEach(log => {
      events.push({
        id: `log-${log.id}`,
        type: log.action_type,
        title: `Agent Action: ${log.action_type.replace(/_/g, ' ')}`,
        details: log.details,
        timestamp: log.timestamp
      });
    });

    // Sort descending by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      agent_status: "MONITORING_ACTIVE",
      active_threads: 1,
      events: events.slice(0, 25)
    });
  };
  app.get('/agent-events', handleAgentEvents);
  app.get('/api/agent-events', handleAgentEvents);

  // 5. Approve Action
  const handleApproveAction = (req: express.Request, res: express.Response) => {
    const decision_id = req.body?.decision_id;
    if (!decision_id) {
      return res.status(400).json({ detail: "decision_id is required." });
    }

    const store = getStore();
    const decision = store.decisions.find(d => d.id === decision_id);
    if (!decision) {
      return res.status(404).json({ detail: `Decision ID ${decision_id} not found.` });
    }

    // Mark this decision approved and ensure others for the same investigation are reset
    if (decision.investigation_id) {
      store.decisions
        .filter(d => d.investigation_id === decision.investigation_id && d.id !== decision.id && d.status === 'approved')
        .forEach(d => { d.status = 'pending'; });
    }

    decision.status = "approved";
    decision.approved_at = new Date().toISOString();

    if (decision.investigation_id) {
      const investigation = store.investigations.find(inv => inv.id === decision.investigation_id);
      if (investigation) {
        investigation.status = "resolved";
        investigation.updated_at = new Date().toISOString();
      }
    }

    const p1 = store.products.find(p => p.id === 1);
    const p2 = store.products.find(p => p.id === 2);

    if (decision.strategy_type === 'Conservative') {
      if (p1) p1.status = "quarantined";
    } else if (decision.strategy_type === 'Aggressive') {
      if (p1) {
        p1.price = 229.00;
        p1.status = "active";
      }
      if (p2) {
        p2.stock_level += 400;
        p2.status = "active";
      }
    } else {
      // Balanced / Default
      if (p1) p1.status = "active";
      if (p2) {
        p2.stock_level += 200;
        p2.status = "active";
      }
    }

    let existingOutcome = store.outcomes.find(o => o.decision_id === decision.id);
    if (!existingOutcome) {
      const outcome: Outcome = {
        id: store.nextIds.outcome++,
        decision_id: decision.id,
        actual_roi: Number((decision.projected_roi * 1.05).toFixed(2)),
        revenue_recovered: decision.projected_revenue_impact,
        status: "executed_successfully",
        summary: `Action '${decision.title}' approved and executed. Recovered $${decision.projected_revenue_impact.toLocaleString()} revenue on $${decision.estimated_cost.toLocaleString()} budget with ${decision.projected_roi}x ROI.`,
        recorded_at: new Date().toISOString()
      };
      store.outcomes.push(outcome);
    }

    const audit: AuditLog = {
      id: store.nextIds.auditLog++,
      action_type: "ACTION_APPROVED",
      performed_by: "Executive Decision Maker",
      details: `Approved strategy '${decision.title}' (ID #${decision.id}). Allocated $${decision.estimated_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} budget with projected recovery of $${decision.projected_revenue_impact.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      timestamp: new Date().toISOString()
    };
    store.auditLogs.push(audit);

    res.json({
      message: `Action ID #${decision.id} successfully approved and executed.`,
      decision_id: decision.id,
      status: "approved",
      projected_revenue_recovered: decision.projected_revenue_impact,
      estimated_cost: decision.estimated_cost,
      projected_roi: decision.projected_roi,
      net_recovered: decision.projected_revenue_impact - decision.estimated_cost,
      strategy_type: decision.strategy_type,
      title: decision.title
    });
  };
  app.post('/approve-action', handleApproveAction);
  app.post('/api/approve-action', handleApproveAction);

  // 6. Reject Action
  const handleRejectAction = (req: express.Request, res: express.Response) => {
    const decision_id = req.body?.decision_id;
    const reason = req.body?.reason || "Budget allocation constraints";

    if (!decision_id) {
      return res.status(400).json({ detail: "decision_id is required." });
    }

    const store = getStore();
    const decision = store.decisions.find(d => d.id === decision_id);
    if (!decision) {
      return res.status(404).json({ detail: `Decision ID ${decision_id} not found.` });
    }

    decision.status = "rejected";

    const audit: AuditLog = {
      id: store.nextIds.auditLog++,
      action_type: "ACTION_REJECTED",
      performed_by: "Executive Decision Maker",
      details: `Rejected strategy '${decision.title}' (ID #${decision.id}). Reason: ${reason}.`,
      timestamp: new Date().toISOString()
    };
    store.auditLogs.push(audit);

    res.json({
      message: `Decision ID #${decision.id} rejected.`,
      decision_id: decision.id,
      status: "rejected"
    });
  };
  app.post('/reject-action', handleRejectAction);
  app.post('/api/reject-action', handleRejectAction);

  // 7. Simulation scenario
  const handleSimulate = (req: express.Request, res: express.Response) => {
    const price_change_pct = parseFloat(req.body?.price_change_pct ?? 0.0);
    const recovery_rate_pct = parseFloat(req.body?.recovery_rate_pct ?? 65.0);
    const expedite_cost = parseFloat(req.body?.expedite_cost ?? req.body?.expedite_shipping_cost ?? 3500.0);
    const reorder_qty = parseInt(req.body?.reorder_qty ?? req.body?.reorder_quantity ?? 200, 10);

    const simResults = runScenarioSimulation(price_change_pct, recovery_rate_pct, expedite_cost, reorder_qty);
    res.json(simResults);
  };
  app.post('/simulate', handleSimulate);
  app.post('/api/simulate', handleSimulate);

  // 8. Reset Demo Data
  const handleResetData = (req: express.Request, res: express.Response) => {
    resetStore();
    res.json({ message: "Database reset and re-seeded successfully." });
  };
  app.post('/reset-demo-data', handleResetData);
  app.post('/api/reset-demo-data', handleResetData);

  // 9. Ask ARGUS AI Executive Copilot (Gemini powered)
  const handleAgentAsk = async (req: express.Request, res: express.Response) => {
    try {
      const question = req.body?.question || "Provide a summary of the active anomaly";
      const result = await askArgus(question);
      res.json(result);
    } catch (err: any) {
      console.error("Agent ask error:", err);
      res.status(500).json({ error: "Failed to process agent query" });
    }
  };
  app.post('/api/agent-ask', handleAgentAsk);

  // 10. Inject Scenario / Custom Incident Trigger
  const handleInjectScenario = (req: express.Request, res: express.Response) => {
    const scenario = req.body?.scenario || "firmware_leak";
    const customPrompt = req.body?.custom_prompt;
    const inv = runInvestigation(customPrompt, scenario);
    res.json({
      message: `Scenario '${scenario}' injected successfully.`,
      investigation_id: inv.id,
      investigation: inv
    });
  };
  app.post('/api/inject-scenario', handleInjectScenario);

  // 11. Agent Voice SITREP Briefing
  const handleAgentSitrep = (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id || '1', 10);
    const sitrep = generateExecutiveSitrep(id);
    res.json(sitrep);
  };
  app.get('/api/agent-sitrep/:id?', handleAgentSitrep);

  // =========================================================================
  // PS6: AUTONOMOUS RETAIL SUPPLY CHAIN RECOVERY AGENT REST ENDPOINTS
  // =========================================================================

  // 12. Full Logistics Digital Twin State (Inventory, Shipments, Vendors, Routes, Incidents, Alternatives)
  app.get('/api/logistics/state', (req, res) => {
    const sandbox = getLogisticsSandbox();
    res.json(sandbox);
  });

  // 13. Inventory Sub-API
  app.get('/api/logistics/inventory', (req, res) => {
    const sandbox = getLogisticsSandbox();
    const sku = req.query.sku as string;
    const warehouseId = req.query.warehouseId as string;
    let inv = sandbox.inventory;
    if (sku) inv = inv.filter(i => i.sku === sku);
    if (warehouseId) inv = inv.filter(i => i.warehouseId === warehouseId);
    res.json(inv);
  });

  // 14. Shipments Sub-API
  app.get('/api/logistics/shipments', (req, res) => {
    const sandbox = getLogisticsSandbox();
    res.json(sandbox.shipments);
  });

  // 15. Vendors Sub-API
  app.get('/api/logistics/vendors', (req, res) => {
    const sandbox = getLogisticsSandbox();
    res.json(sandbox.vendors);
  });

  // 16. Routes & Multi-Modal Transport Graph
  app.get('/api/logistics/routes', (req, res) => {
    const sandbox = getLogisticsSandbox();
    res.json(sandbox.routes);
  });

  // 17. Disruption Detection & Monitoring Scan
  app.post('/api/logistics/monitor-detect', (req, res) => {
    const sandbox = getLogisticsSandbox();
    const incident = sandbox.incidents[0];
    res.json({
      timestamp: new Date().toISOString(),
      monitored_nodes: {
        warehouses: sandbox.inventory.length,
        in_transit_shipments: sandbox.shipments.length,
        active_vendors: sandbox.vendors.length,
        routes: sandbox.routes.length
      },
      active_incidents: sandbox.incidents,
      disruption_detected: !!incident && incident.status !== 'RESOLVED'
    });
  });

  // 18. Multi-Alternative Pareto Optimization
  app.post('/api/logistics/investigate-optimize', (req, res) => {
    const incidentId = req.body?.incident_id || "INC-2026-006";
    const alternatives = generateRecoveryAlternatives(incidentId);
    res.json({
      incident_id: incidentId,
      total_candidates: alternatives.length,
      alternatives
    });
  });

  // 19. Execute State-Changing Logistics Action (Purchase, Transfer, Reroute, Expedite)
  app.post('/api/logistics/execute-action', (req, res) => {
    const actionId = req.body?.action_id || "ALT-OPT-1-APEX-AIR";
    const forceFailure = req.body?.force_failure === true;
    try {
      const result = executeLogisticsRecoveryAction(actionId, { forceVendorFailure: forceFailure });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // 20. Closed-Loop Verification & Certificate Generation
  app.post('/api/logistics/verify-recovery', (req, res) => {
    const incidentId = req.body?.incident_id || "INC-2026-006";
    const actionId = req.body?.action_id;
    try {
      const report = verifyLogisticsRecovery(incidentId, actionId);
      res.json(report);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // 21. Execute Full Autonomous Recovery LangGraph State Machine
  app.post('/api/logistics/run-langgraph', async (req, res) => {
    const incidentId = req.body?.incident_id || "INC-2026-006";
    const triggerReplan = req.body?.trigger_replan_demo === true;
    try {
      const graphResult = await runAutonomousRecovery(incidentId, triggerReplan);
      const sandbox = getLogisticsSandbox();
      res.json({
        graph_execution: "COMPLETED",
        final_state: graphResult,
        digital_twin: sandbox
      });
    } catch (err: any) {
      console.error("LangGraph error:", err);
      res.status(500).json({ error: "Failed to execute LangGraph recovery workflow", details: err.message });
    }
  });

  // 22. Interactive Disruption -> Failure -> Replan Demo (For Hackathon Judges!)
  app.post('/api/logistics/trigger-replan-demo', (req, res) => {
    try {
      const demoResult = triggerDisruptionReplanDemo();
      res.json({
        message: "PS6 Disruption -> Failure -> Re-plan Demo successfully completed.",
        demo: demoResult
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to run replan demo", details: err.message });
    }
  });

  // 23. Reset Logistics Sandbox
  app.post('/api/logistics/reset', (req, res) => {
    const freshState = resetLogisticsSandbox();
    res.json({
      message: "Logistics Digital Twin reset and re-seeded successfully.",
      state: freshState
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
