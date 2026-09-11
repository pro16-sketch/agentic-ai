import datetime
from database import SessionLocal, init_db, Product, Order, Customer, Inventory, Supplier, Return, Goal, Investigation, Hypothesis, ToolCall, Decision, Outcome, AuditLog

def seed_database():
    init_db()
    db = SessionLocal()

    # Clear existing data to allow fresh seed
    db.query(AuditLog).delete()
    db.query(Outcome).delete()
    db.query(Decision).delete()
    db.query(ToolCall).delete()
    db.query(Hypothesis).delete()
    db.query(Investigation).delete()
    db.query(Goal).delete()
    db.query(Return).delete()
    db.query(Order).delete()
    db.query(Inventory).delete()
    db.query(Supplier).delete()
    db.query(Customer).delete()
    db.query(Product).delete()
    db.commit()

    print("Seeding Suppliers...")
    suppliers = [
        Supplier(id=1, name="AuraTech Components", contact_email="supply@auratech.com", reliability_score=0.96, avg_lead_time_days=4),
        Supplier(id=2, name="Global Microelectronics Co.", contact_email="ops@globalmicro.io", reliability_score=0.82, avg_lead_time_days=12), # Bottleneck supplier
        Supplier(id=3, name="Quantum Memory Labs", contact_email="orders@quantumlabs.com", reliability_score=0.98, avg_lead_time_days=3),
        Supplier(id=4, name="Apex Dynamics Assembly", contact_email="logistics@apexdynamics.com", reliability_score=0.91, avg_lead_time_days=6),
    ]
    db.add_all(suppliers)
    db.commit()

    print("Seeding Products...")
    products = [
        Product(
            id=1, sku="AUD-AURA-PRO", name="Aura Sound Pro ANC Headphones",
            category="Audio & Wearables", price=299.00, cost=115.00, stock_level=420, min_reorder_point=100,
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60", status="warning"
        ),
        Product(
            id=2, sku="WTC-NEXUS-U2", name="Nexus SmartWatch Ultra 2",
            category="Wearables", price=449.00, cost=190.00, stock_level=32, min_reorder_point=75,
            image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", status="low_stock"
        ),
        Product(
            id=3, sku="KB-VORTEX-RGB", name="Vortex Pro Wireless Mechanical Keyboard",
            category="Peripherals", price=179.00, cost=68.00, stock_level=680, min_reorder_point=150,
            image_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60", status="active"
        ),
        Product(
            id=4, sku="SSD-QUANTUM-2T", name="Quantum SSD 2TB NVMe Gen4",
            category="Storage", price=199.00, cost=85.00, stock_level=510, min_reorder_point=120,
            image_url="https://images.unsplash.com/photo-1597872250970-482a0b127599?w=500&auto=format&fit=crop&q=60", status="active"
        ),
        Product(
            id=5, sku="MON-LUMI-4K", name="Luminary Studio Monitor 27-inch 4K",
            category="Displays", price=649.00, cost=290.00, stock_level=185, min_reorder_point=50,
            image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60", status="active"
        ),
        Product(
            id=6, sku="CHR-STARLIGHT", name="Starlight Ergonomic Mesh Desk Chair",
            category="Furniture", price=529.00, cost=210.00, stock_level=94, min_reorder_point=40,
            image_url="https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&auto=format&fit=crop&q=60", status="active"
        ),
        Product(
            id=7, sku="DRN-APEX-4K", name="Apex Pro Cinema Drone 4K",
            category="Electronics", price=899.00, cost=410.00, stock_level=45, min_reorder_point=30,
            image_url="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=60", status="active"
        ),
        Product(
            id=8, sku="PWR-SOLARIS-25", name="Solaris PowerBank 25000mAh 100W",
            category="Accessories", price=89.00, cost=32.00, stock_level=820, min_reorder_point=200,
            image_url="https://images.unsplash.com/photo-1609592424074-297d0fd979ef?w=500&auto=format&fit=crop&q=60", status="active"
        ),
    ]
    db.add_all(products)
    db.commit()

    print("Seeding Inventory Records...")
    inventory_items = [
        Inventory(product_id=1, warehouse_location="US-East-Primary", reorder_lead_time_days=4, supplier_id=1),
        Inventory(product_id=2, warehouse_location="US-West-Central", reorder_lead_time_days=14, supplier_id=2), # Delayed lead time
        Inventory(product_id=3, warehouse_location="US-East-Primary", reorder_lead_time_days=5, supplier_id=1),
        Inventory(product_id=4, warehouse_location="US-East-Primary", reorder_lead_time_days=3, supplier_id=3),
        Inventory(product_id=5, warehouse_location="EU-Central-1", reorder_lead_time_days=7, supplier_id=4),
        Inventory(product_id=6, warehouse_location="US-West-Central", reorder_lead_time_days=8, supplier_id=4),
        Inventory(product_id=7, warehouse_location="US-East-Primary", reorder_lead_time_days=6, supplier_id=4),
        Inventory(product_id=8, warehouse_location="US-East-Primary", reorder_lead_time_days=3, supplier_id=1),
    ]
    db.add_all(inventory_items)
    db.commit()

    print("Seeding Customers & Orders...")
    customers = [
        Customer(id=1, name="Apex Enterprise Logistics", email="procurement@apexlog.com", segment="Enterprise", lifetime_value=48200.00),
        Customer(id=2, name="Horizon Design Studio", email="tech@horizondesign.co", segment="VIP", lifetime_value=19500.00),
        Customer(id=3, name="Sarah Jenkins", email="s.jenkins@gmail.com", segment="Standard", lifetime_value=1240.00),
        Customer(id=4, name="Marcus Vance", email="mvance@techcorp.io", segment="VIP", lifetime_value=8450.00),
        Customer(id=5, name="Elena Rostova", email="elena@rostovadesign.com", segment="Standard", lifetime_value=2100.00),
    ]
    db.add_all(customers)
    db.commit()

    now = datetime.datetime.utcnow()
    orders = []
    order_id_counter = 1000

    # Generate recent 30-day realistic order mix
    for i in range(120):
        prod = products[i % len(products)]
        cust = customers[i % len(customers)]
        created_date = now - datetime.timedelta(days=(120 - i) * 0.25)
        qty = 1 if prod.price > 300 else (2 if i % 3 == 0 else 1)
        total = prod.price * qty
        
        status = "completed"
        # Create higher return rate for product 1 (Aura Headphones) to trigger anomaly engine!
        if prod.id == 1 and i % 4 == 0:
            status = "returned"
        elif prod.id == 2 and i % 15 == 0:
            status = "returned"

        order_id_counter += 1
        orders.append(
            Order(
                id=i+1,
                order_number=f"ORD-2026-{order_id_counter}",
                customer_id=cust.id,
                product_id=prod.id,
                quantity=qty,
                total_price=total,
                status=status,
                created_at=created_date
            )
        )
    db.add_all(orders)
    db.commit()

    print("Seeding Return Records...")
    # Add detailed return records for Product 1 (Aura Headphones)
    returns = [
        Return(
            order_id=4, product_id=1, reason="Firmware Bluetooth Disconnect",
            customer_feedback="Headphones disconnect every 10 minutes following recent v2.4 firmware update.",
            status="processed", created_at=now - datetime.timedelta(days=2)
        ),
        Return(
            order_id=8, product_id=1, reason="Firmware Bluetooth Disconnect",
            customer_feedback="ANC drops out and audio stutters when paired with iPhone 16 Pro.",
            status="processed", created_at=now - datetime.timedelta(days=3)
        ),
        Return(
            order_id=12, product_id=1, reason="Firmware Bluetooth Disconnect",
            customer_feedback="Unusable audio lag after update. Requesting full refund.",
            status="processed", created_at=now - datetime.timedelta(days=4)
        ),
        Return(
            order_id=16, product_id=1, reason="Defective Hardware",
            customer_feedback="Right ear cushion came loose right out of the box.",
            status="processed", created_at=now - datetime.timedelta(days=5)
        ),
        Return(
            order_id=20, product_id=1, reason="Firmware Bluetooth Disconnect",
            customer_feedback="Firmware update v2.4 bricked the left earbud connectivity.",
            status="processed", created_at=now - datetime.timedelta(days=6)
        ),
    ]
    db.add_all(returns)
    db.commit()

    print("Seeding Initial ARGUS Goal & Active Investigation...")
    goal = Goal(
        id=1,
        title="Maintain Net Margin > 35% & Protect Customer Satisfaction Score",
        description="Monitor quarterly return rate variances, stockout risks, and supplier lead times across all premium SKUs.",
        status="investigating",
        target_metric="Gross Profit Margin & Return Rate %"
    )
    db.add(goal)
    db.commit()

    investigation = Investigation(
        id=1,
        goal_id=1,
        metric_name="Return Rate Spike & Gross Margin Compression (SKU: AUD-AURA-PRO)",
        anomaly_score=8.7, # Severe anomaly
        status="action_pending",
        summary="ARGUS detected an unusual 14.8% return rate spike on 'Aura Sound Pro ANC Headphones' (baseline 2.1%) following the v2.4 firmware release, creating a projected $38,400 monthly profit loss and inventory stockout risk for SKU WTC-NEXUS-U2 due to supplier lead time delay.",
        root_cause="Bluetooth LE audio stack regression in firmware v2.4 causing connection drops, compounded by Global Microelectronics Co. component shipping delay (14 days vs 5 days avg)."
    )
    db.add(investigation)
    db.commit()

    hypotheses = [
        Hypothesis(
            id=1, investigation_id=1,
            hypothesis_text="Hardware batch acoustic transducer defect in Q3 manufacturing run.",
            confidence_score=0.15, validation_status="rejected",
            evidence="Hardware failure diagnostics show 98.4% component pass rate. Issue did not exist prior to firmware update v2.4."
        ),
        Hypothesis(
            id=2, investigation_id=1,
            hypothesis_text="Firmware v2.4 BLE audio stack buffer overflow causing connection drops on modern mobile OS.",
            confidence_score=0.92, validation_status="confirmed",
            evidence="82% of return comments explicitly cite 'Bluetooth disconnection after v2.4 update'. Automated regression test confirms packet drop under high bandwidth."
        ),
        Hypothesis(
            id=3, investigation_id=1,
            hypothesis_text="Supplier lead time delay from Global Microelectronics Co. threatens stockout for Nexus Watch Ultra 2.",
            confidence_score=0.88, validation_status="confirmed",
            evidence="Inventory count is 32 units against reorder point of 75 units. Supplier lead time expanded from 5 to 14 days without notice."
        ),
    ]
    db.add_all(hypotheses)
    db.commit()

    tool_calls = [
        ToolCall(
            id=1, investigation_id=1, tool_name="query_database_returns",
            input_params={"sku": "AUD-AURA-PRO", "timeframe_days": 30},
            output_result={"total_returns": 30, "return_rate": 0.148, "primary_reason": "Firmware Bluetooth Disconnect", "reason_percentage": 0.833},
            execution_time_ms=145
        ),
        ToolCall(
            id=2, investigation_id=1, tool_name="calculate_variance_metrics",
            input_params={"metric": "Gross_Margin", "product_id": 1},
            output_result={"baseline_margin": 0.615, "current_margin": 0.442, "variance_pct": -28.1, "monthly_profit_loss": 38400.0},
            execution_time_ms=98
        ),
        ToolCall(
            id=3, investigation_id=1, tool_name="simulate_supply_chain_leadtime",
            input_params={"supplier_id": 2, "sku": "WTC-NEXUS-U2"},
            output_result={"current_stock": 32, "daily_burn_rate": 4.2, "days_to_stockout": 7.6, "supplier_lead_days": 14, "projected_stockout_days": 6.4},
            execution_time_ms=210
        ),
    ]
    db.add_all(tool_calls)
    db.commit()

    decisions = [
        Decision(
            id=1, investigation_id=1,
            title="Option A (Recommended): Emergency Firmware Patch v2.4.1 + Expedited Air Freight for Nexus Watch",
            strategy_type="Balanced",
            description="1. Deploy over-the-air hotfix firmware v2.4.1 resolving BLE audio buffer issue.\n2. Automatically trigger $25 store credit to affected return customers to recover 65% of returns.\n3. Expedite air shipment for Nexus Watch Ultra 2 from secondary supplier to eliminate 6.4 day stockout gap.",
            estimated_cost=8400.00,
            projected_revenue_impact=46200.00,
            projected_roi=5.5,
            risk_level="Low",
            status="pending"
        ),
        Decision(
            id=2, investigation_id=1,
            title="Option B: Full Product Recall & Sales Freeze on Aura Sound Pro",
            strategy_type="Conservative",
            description="Halt all sales of Aura Sound Pro ANC Headphones immediately, issue full refunds for all customer returns, and await physical hardware audit.",
            estimated_cost=24500.00,
            projected_revenue_impact=18000.00,
            projected_roi=0.73,
            risk_level="High",
            status="pending"
        ),
        Decision(
            id=3, investigation_id=1,
            title="Option C: Aggressive Price Discount & Air-Freight Bulk Replenishment",
            strategy_type="Aggressive",
            description="Reduce Aura Sound Pro price from $299 to $229 to liquidate inventory while releasing hotfix v2.4.1. Double reorder quantity for Nexus Watch Ultra via expedited shipping.",
            estimated_cost=15200.00,
            projected_revenue_impact=54000.00,
            projected_roi=3.55,
            risk_level="Medium",
            status="pending"
        ),
    ]
    db.add_all(decisions)
    db.commit()

    audit_logs = [
        AuditLog(
            action_type="SYSTEM_INITIALIZED",
            performed_by="ARGUS System",
            details="Database populated with enterprise telemetry data and initial active anomaly investigation ID #1."
        )
    ]
    db.add_all(audit_logs)
    db.commit()

    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
