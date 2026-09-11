import datetime
from typing import Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import (
    init_db, get_db, Product, Order, Return, Inventory, Supplier, 
    Goal, Investigation, Hypothesis, ToolCall, Decision, Outcome, AuditLog
)
from analytics import get_business_metrics, run_scenario_simulation
from agent import ARGUSAgentEngine

# Initialize database tables on start
init_db()

app = FastAPI(
    title="ARGUS Enterprise Agent API",
    description="Autonomous AI Business Intelligence & Operations Agent Backend",
    version="1.0.0"
)

# Enable CORS for React Frontend (typically running on port 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "ARGUS AI Operations Platform",
        "version": "1.0.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# 1. GET /business-state
@app.get("/business-state")
@app.get("/api/business-state")
def read_business_state(db: Session = Depends(get_db)):
    """
    Returns high-level financial KPIs, SKU breakdown, return stats, and active alerts.
    """
    metrics = get_business_metrics(db)
    
    # Fetch active goal and investigation
    active_goal = db.query(Goal).order_by(Goal.id.desc()).first()
    active_investigation = db.query(Investigation).order_by(Investigation.id.desc()).first()

    return {
        "metrics": metrics,
        "active_goal": {
            "id": active_goal.id,
            "title": active_goal.title,
            "description": active_goal.description,
            "status": active_goal.status,
            "target_metric": active_goal.target_metric
        } if active_goal else None,
        "active_investigation_id": active_investigation.id if active_investigation else None
    }

# 2. POST /investigate
@app.post("/investigate")
@app.post("/api/investigate")
def trigger_investigation(
    payload: Dict[str, Any] = Body(default={}),
    db: Session = Depends(get_db)
):
    """
    Triggers an autonomous ARGUS investigation on a selected objective or anomaly metric.
    """
    objective = payload.get("objective", "Audit Return Rate Spike & Supply Chain Lead Times")
    engine = ARGUSAgentEngine(db)
    investigation = engine.run_investigation(objective)

    return {
        "message": "Investigation successfully initialized and completed by ARGUS Agent Engine.",
        "investigation_id": investigation.id,
        "status": investigation.status
    }

# 3. GET /investigation/{id}
@app.get("/investigation/{id}")
@app.get("/api/investigation/{id}")
def get_investigation_details(id: int, db: Session = Depends(get_db)):
    """
    Retrieves full details for a specific investigation including hypotheses, tool calls, and decisions.
    """
    investigation = db.query(Investigation).filter(Investigation.id == id).first()
    if not investigation:
        raise HTTPException(status_code=404, detail=f"Investigation with ID {id} not found.")

    hypotheses = db.query(Hypothesis).filter(Hypothesis.investigation_id == id).all()
    tool_calls = db.query(ToolCall).filter(ToolCall.investigation_id == id).all()
    decisions = db.query(Decision).filter(Decision.investigation_id == id).all()

    decisions_list = []
    for d in decisions:
        outcome = db.query(Outcome).filter(Outcome.decision_id == d.id).first()
        decisions_list.append({
            "id": d.id,
            "title": d.title,
            "strategy_type": d.strategy_type,
            "description": d.description,
            "estimated_cost": d.estimated_cost,
            "projected_revenue_impact": d.projected_revenue_impact,
            "projected_roi": d.projected_roi,
            "risk_level": d.risk_level,
            "status": d.status,
            "outcome": {
                "id": outcome.id,
                "actual_roi": outcome.actual_roi,
                "revenue_recovered": outcome.revenue_recovered,
                "status": outcome.status,
                "summary": outcome.summary
            } if outcome else None
        })

    return {
        "id": investigation.id,
        "metric_name": investigation.metric_name,
        "anomaly_score": investigation.anomaly_score,
        "status": investigation.status,
        "summary": investigation.summary,
        "root_cause": investigation.root_cause,
        "created_at": investigation.created_at.isoformat(),
        "hypotheses": [
            {
                "id": h.id,
                "hypothesis_text": h.hypothesis_text,
                "confidence_score": h.confidence_score,
                "validation_status": h.validation_status,
                "evidence": h.evidence
            } for h in hypotheses
        ],
        "tool_calls": [
            {
                "id": tc.id,
                "tool_name": tc.tool_name,
                "input_params": tc.input_params,
                "output_result": tc.output_result,
                "execution_time_ms": tc.execution_time_ms,
                "created_at": tc.created_at.isoformat()
            } for tc in tool_calls
        ],
        "decisions": decisions_list
    }

# 4. GET /agent-events
@app.get("/agent-events")
@app.get("/api/agent-events")
def get_agent_events(db: Session = Depends(get_db)):
    """
    Returns live chronological feed of ARGUS agent reasoning steps, tool calls, and audit logs.
    """
    audit_logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(20).all()
    tool_calls = db.query(ToolCall).order_by(ToolCall.created_at.desc()).limit(10).all()

    events = []
    for tc in tool_calls:
        events.append({
            "id": f"tc-{tc.id}",
            "type": "TOOL_EXECUTION",
            "title": f"Executed Tool: {tc.tool_name}",
            "details": f"Inputs: {tc.input_params} -> Execution time: {tc.execution_time_ms}ms",
            "timestamp": tc.created_at.isoformat()
        })

    for log in audit_logs:
        events.append({
            "id": f"log-{log.id}",
            "type": log.action_type,
            "title": f"Agent Action: {log.action_type.replace('_', ' ')}",
            "details": log.details,
            "timestamp": log.timestamp.isoformat()
        })

    # Sort combined events by timestamp
    events.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "agent_status": "MONITORING_ACTIVE",
        "active_threads": 1,
        "events": events[:25]
    }

# 5. POST /approve-action
@app.post("/approve-action")
@app.post("/api/approve-action")
def approve_action(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Approves a recommended decision strategy, commits state changes to DB, and records outcome metrics.
    """
    decision_id = payload.get("decision_id")
    if not decision_id:
        raise HTTPException(status_code=400, detail="decision_id is required.")

    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail=f"Decision ID {decision_id} not found.")

    # Mark Decision as Approved
    decision.status = "approved"
    decision.approved_at = datetime.datetime.utcnow()

    # Update parent investigation status
    if decision.investigation_id:
        investigation = db.query(Investigation).filter(Investigation.id == decision.investigation_id).first()
        if investigation:
            investigation.status = "resolved"

    # Execute DB product updates (e.g. resolve warning flag on Product #1, increase inventory on Product #2)
    p1 = db.query(Product).filter(Product.id == 1).first()
    if p1:
        p1.status = "active" # Reset warning flag to active

    p2 = db.query(Product).filter(Product.id == 2).first()
    if p2:
        p2.stock_level += 200 # Replenish stock via expedited shipment
        p2.status = "active"

    # Record Outcome
    existing_outcome = db.query(Outcome).filter(Outcome.decision_id == decision.id).first()
    if not existing_outcome:
        outcome = Outcome(
            decision_id=decision.id,
            actual_roi=decision.projected_roi * 1.05, # Slight positive performance boost
            revenue_recovered=decision.projected_revenue_impact,
            status="executed_successfully",
            summary=f"Action '{decision.title}' approved and executed. Resolved return rate anomaly and replenished stock."
        )
        db.add(outcome)

    # Log to Audit Trail
    audit = AuditLog(
        action_type="ACTION_APPROVED",
        performed_by="Executive Decision Maker",
        details=f"Approved strategy '{decision.title}' (ID #{decision.id}). Allocated ${decision.estimated_cost:,.2f} budget."
    )
    db.add(audit)
    db.commit()

    return {
        "message": f"Action ID #{decision.id} successfully approved and executed.",
        "decision_id": decision.id,
        "status": "approved",
        "projected_revenue_recovered": decision.projected_revenue_impact
    }

# 6. POST /reject-action
@app.post("/reject-action")
@app.post("/api/reject-action")
def reject_action(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Rejects a decision option and logs user feedback.
    """
    decision_id = payload.get("decision_id")
    reason = payload.get("reason", "Budget allocation constraints")

    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail=f"Decision ID {decision_id} not found.")

    decision.status = "rejected"
    
    audit = AuditLog(
        action_type="ACTION_REJECTED",
        performed_by="Executive Decision Maker",
        details=f"Rejected strategy '{decision.title}' (ID #{decision.id}). Reason: {reason}."
    )
    db.add(audit)
    db.commit()

    return {
        "message": f"Decision ID #{decision.id} rejected.",
        "decision_id": decision.id,
        "status": "rejected"
    }

# 7. POST /simulate-scenario (Scenario Simulation Helper)
@app.post("/simulate")
@app.post("/api/simulate")
def simulate_scenario(payload: Dict[str, Any] = Body(default={})):
    """
    Runs interactive financial simulation based on custom slider parameters.
    """
    price_change_pct = float(payload.get("price_change_pct", 0.0))
    recovery_rate_pct = float(payload.get("recovery_rate_pct", 65.0))
    expedite_cost = float(payload.get("expedite_cost", 3500.0))
    reorder_qty = int(payload.get("reorder_qty", 200))

    sim_results = run_scenario_simulation(
        price_change_pct=price_change_pct,
        recovery_rate_pct=recovery_rate_pct,
        expedite_shipping_cost=expedite_cost,
        reorder_quantity=reorder_qty
    )
    return sim_results

# 8. POST /reset-data (Helper to re-seed demo data if needed)
@app.post("/reset-demo-data")
@app.post("/api/reset-demo-data")
def reset_demo_data():
    from seed_data import seed_database
    seed_database()
    return {"message": "Database reset and re-seeded successfully."}
