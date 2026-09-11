import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(__file__))

from seed_data import seed_database
from database import SessionLocal, Product, Investigation, Decision
from analytics import get_business_metrics, run_scenario_simulation
from fastapi.testclient import TestClient
from main import app

def test_full_backend():
    print("--- 1. Testing Database Seeding ---")
    seed_database()
    db = SessionLocal()

    products_count = db.query(Product).count()
    print(f"Products count: {products_count}")
    assert products_count >= 8, "Expected at least 8 products"

    investigations_count = db.query(Investigation).count()
    print(f"Investigations count: {investigations_count}")
    assert investigations_count >= 1, "Expected at least 1 investigation"

    print("--- 2. Testing Analytics Module ---")
    metrics = get_business_metrics(db)
    print(f"Total Revenue: ${metrics['total_revenue']:,.2f}")
    print(f"Total Profit: ${metrics['total_profit']:,.2f}")
    print(f"Gross Margin: {metrics['gross_margin_pct']}%")
    print(f"Return Rate: {metrics['overall_return_rate_pct']}%")
    assert metrics['total_revenue'] > 0, "Revenue should be > 0"

    sim = run_scenario_simulation(price_change_pct=5.0, recovery_rate_pct=70.0)
    print(f"Simulation ROI: {sim['simulated_roi']}x")
    assert sim['simulated_roi'] > 0

    print("--- 3. Testing FastAPI REST Endpoints ---")
    client = TestClient(app)

    # GET /business-state
    res = client.get("/api/business-state")
    assert res.status_code == 200
    print("GET /business-state -> OK (200)")

    # POST /investigate
    res_inv = client.post("/api/investigate", json={"objective": "Test Investigation"})
    assert res_inv.status_code == 200
    inv_id = res_inv.json()["investigation_id"]
    print(f"POST /investigate -> OK (ID: {inv_id})")

    # GET /investigation/{id}
    res_det = client.get(f"/api/investigation/{inv_id}")
    assert res_det.status_code == 200
    print(f"GET /investigation/{inv_id} -> OK")

    # GET /agent-events
    res_ev = client.get("/api/agent-events")
    assert res_ev.status_code == 200
    print("GET /agent-events -> OK")

    # POST /approve-action
    dec_id = res_det.json()["decisions"][0]["id"]
    res_app = client.post("/api/approve-action", json={"decision_id": dec_id})
    assert res_app.status_code == 200
    print(f"POST /approve-action -> OK (Decision ID: {dec_id})")

    db.close()
    print("\nALL BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_backend()
