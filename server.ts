import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getStore, resetStore } from './server/store.js';
import { getBusinessMetrics, runScenarioSimulation } from './server/analytics.js';
import { runInvestigation } from './server/agent.js';
import { Outcome, AuditLog } from './server/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize in-memory data store
  getStore();

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
    if (p1) {
      p1.status = "active";
    }

    const p2 = store.products.find(p => p.id === 2);
    if (p2) {
      p2.stock_level += 200;
      p2.status = "active";
    }

    let existingOutcome = store.outcomes.find(o => o.decision_id === decision.id);
    if (!existingOutcome) {
      const outcome: Outcome = {
        id: store.nextIds.outcome++,
        decision_id: decision.id,
        actual_roi: Number((decision.projected_roi * 1.05).toFixed(2)),
        revenue_recovered: decision.projected_revenue_impact,
        status: "executed_successfully",
        summary: `Action '${decision.title}' approved and executed. Resolved return rate anomaly and replenished stock.`,
        recorded_at: new Date().toISOString()
      };
      store.outcomes.push(outcome);
    }

    const audit: AuditLog = {
      id: store.nextIds.auditLog++,
      action_type: "ACTION_APPROVED",
      performed_by: "Executive Decision Maker",
      details: `Approved strategy '${decision.title}' (ID #${decision.id}). Allocated $${decision.estimated_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} budget.`,
      timestamp: new Date().toISOString()
    };
    store.auditLogs.push(audit);

    res.json({
      message: `Action ID #${decision.id} successfully approved and executed.`,
      decision_id: decision.id,
      status: "approved",
      projected_revenue_recovered: decision.projected_revenue_impact
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
