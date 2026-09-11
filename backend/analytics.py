import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from database import Product, Order, Return, Inventory, Supplier, Decision, Outcome

def get_business_metrics(db: Session):
    """
    Computes overall business metrics using Pandas dataframes.
    """
    products = db.query(Product).all()
    orders = db.query(Order).all()
    returns = db.query(Return).all()
    inventory = db.query(Inventory).all()
    suppliers = db.query(Supplier).all()

    if not orders:
        return {
            "total_revenue": 0.0,
            "total_profit": 0.0,
            "gross_margin_pct": 0.0,
            "total_inventory_value": 0.0,
            "overall_return_rate_pct": 0.0,
            "low_stock_skus": 0,
            "active_anomalies": 0,
            "products": [],
            "monthly_revenue_trend": [],
            "return_reasons_breakdown": []
        }

    # Convert to Pandas DataFrames
    df_orders = pd.DataFrame([{
        "id": o.id,
        "product_id": o.product_id,
        "quantity": o.quantity,
        "total_price": o.total_price,
        "status": o.status,
        "created_at": o.created_at
    } for o in orders])

    df_products = pd.DataFrame([{
        "id": p.id,
        "sku": p.sku,
        "name": p.name,
        "category": p.category,
        "price": p.price,
        "cost": p.cost,
        "stock_level": p.stock_level,
        "min_reorder_point": p.min_reorder_point,
        "image_url": p.image_url,
        "status": p.status
    } for p in products])

    df_returns = pd.DataFrame([{
        "id": r.id,
        "order_id": r.order_id,
        "product_id": r.product_id,
        "reason": r.reason,
        "created_at": r.created_at
    } for r in returns]) if returns else pd.DataFrame()

    # Calculations
    total_revenue = float(df_orders[df_orders['status'] == 'completed']['total_price'].sum())
    
    # Calculate COGS (Cost of Goods Sold)
    merged_orders = df_orders.merge(df_products, left_on='product_id', right_on='id', suffixes=('_order', '_product'))
    merged_orders['total_cost'] = merged_orders['cost'] * merged_orders['quantity']
    total_cost = float(merged_orders[merged_orders['status_order'] == 'completed']['total_cost'].sum())
    
    # Calculate Return Losses
    refunded_orders = merged_orders[merged_orders['status_order'] == 'returned']
    total_refund_loss = float(refunded_orders['total_price'].sum())

    total_profit = max(0.0, total_revenue - total_cost - (total_refund_loss * 0.5))
    gross_margin_pct = round((total_profit / total_revenue * 100), 2) if total_revenue > 0 else 0.0

    # Total Inventory Value
    df_products['inventory_val'] = df_products['stock_level'] * df_products['cost']
    total_inventory_value = float(df_products['inventory_val'].sum())

    # Overall Return Rate %
    total_order_count = len(df_orders)
    returned_order_count = len(refunded_orders)
    overall_return_rate_pct = round((returned_order_count / total_order_count * 100), 2) if total_order_count > 0 else 0.0

    # Low Stock SKUs
    low_stock_skus = int((df_products['stock_level'] <= df_products['min_reorder_point']).sum())

    # Anomaly Detection per SKU
    product_metrics = []
    active_anomalies = 0

    for _, p in df_products.iterrows():
        p_orders = df_orders[df_orders['product_id'] == p['id']]
        p_returns = df_returns[df_returns['product_id'] == p['id']] if not df_returns.empty else pd.DataFrame()
        
        p_order_count = len(p_orders)
        p_return_count = len(p_returns)
        p_return_rate = round((p_return_count / p_order_count * 100), 1) if p_order_count > 0 else 0.0
        
        # Determine status flag
        has_anomaly = False
        if p_return_rate > 10.0 or p['stock_level'] < p['min_reorder_point']:
            has_anomaly = True
            active_anomalies += 1

        product_metrics.append({
            "id": int(p['id']),
            "sku": p['sku'],
            "name": p['name'],
            "category": p['category'],
            "price": float(p['price']),
            "cost": float(p['cost']),
            "stock_level": int(p['stock_level']),
            "min_reorder_point": int(p['min_reorder_point']),
            "image_url": p['image_url'],
            "status": p['status'],
            "return_rate_pct": p_return_rate,
            "has_anomaly": has_anomaly
        })

    # Generate Revenue & Profit Trend for Recharts
    df_orders['month_year'] = pd.to_datetime(df_orders['created_at']).dt.strftime('%b %d')
    grouped_trend = df_orders.groupby('month_year')['total_price'].sum().reset_index()
    monthly_revenue_trend = []
    for idx, row in grouped_trend.tail(12).iterrows():
        rev = float(row['total_price'])
        prof = round(rev * 0.42, 2)
        monthly_revenue_trend.append({
            "date": str(row['month_year']),
            "revenue": rev,
            "profit": prof
        })

    # Return Reasons Breakdown for Recharts
    return_reasons_breakdown = []
    if not df_returns.empty and 'reason' in df_returns.columns:
        reason_counts = df_returns['reason'].value_counts()
        for reason, count in reason_counts.items():
            return_reasons_breakdown.append({
                "reason": str(reason),
                "count": int(count)
            })

    return {
        "total_revenue": round(total_revenue, 2),
        "total_profit": round(total_profit, 2),
        "gross_margin_pct": gross_margin_pct,
        "total_inventory_value": round(total_inventory_value, 2),
        "overall_return_rate_pct": overall_return_rate_pct,
        "low_stock_skus": low_stock_skus,
        "active_anomalies": active_anomalies,
        "products": product_metrics,
        "monthly_revenue_trend": monthly_revenue_trend,
        "return_reasons_breakdown": return_reasons_breakdown
    }

def run_scenario_simulation(
    price_change_pct: float = 0.0,
    recovery_rate_pct: float = 65.0,
    expedite_shipping_cost: float = 3500.0,
    reorder_quantity: int = 200
):
    """
    Simulates financial outcome metrics based on user parameter tweaks.
    """
    baseline_revenue = 48000.0
    baseline_return_loss = 38400.0
    
    # Financial Impact Calculations using NumPy
    price_factor = 1.0 + (price_change_pct / 100.0)
    recovered_revenue = baseline_return_loss * (recovery_rate_pct / 100.0)
    new_revenue = (baseline_revenue * price_factor) + recovered_revenue
    
    total_cost = expedite_shipping_cost + (reorder_quantity * 115.0 * 0.4)
    net_gain = new_revenue - total_cost
    simulated_roi = round(net_gain / max(1.0, total_cost), 2)
    
    stockout_risk_reduction_pct = min(95.0, round(25.0 + (reorder_quantity / 5.0), 1))
    
    return {
        "price_change_pct": price_change_pct,
        "recovery_rate_pct": recovery_rate_pct,
        "expedite_shipping_cost": expedite_shipping_cost,
        "reorder_quantity": reorder_quantity,
        "projected_revenue": round(new_revenue, 2),
        "total_cost": round(total_cost, 2),
        "net_gain": round(net_gain, 2),
        "simulated_roi": simulated_roi,
        "stockout_risk_reduction_pct": stockout_risk_reduction_pct
    }
