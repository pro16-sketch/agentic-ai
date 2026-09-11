import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DB_PATH = os.path.join(os.path.dirname(__file__), "argus.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Business Data Models ---

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    stock_level = Column(Integer, default=0)
    min_reorder_point = Column(Integer, default=50)
    image_url = Column(String, nullable=True)
    status = Column(String, default="active") # active, low_stock, warning

    orders = relationship("Order", back_populates="product")
    returns = relationship("Return", back_populates="product")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="completed") # completed, returned, pending
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    segment = Column(String, default="Standard") # VIP, Standard, Enterprise
    lifetime_value = Column(Float, default=0.0)

    orders = relationship("Order", back_populates="customer")

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    warehouse_location = Column(String, default="US-East-Primary")
    reorder_lead_time_days = Column(Integer, default=7)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    reliability_score = Column(Float, default=0.95) # 0.0 to 1.0
    avg_lead_time_days = Column(Integer, default=5)

class Return(Base):
    __tablename__ = "returns"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    reason = Column(String, nullable=False) # Defective Hardware, Firmware Failure, Shipping Delay, Changed Mind
    customer_feedback = Column(Text, nullable=True)
    status = Column(String, default="processed") # pending, processed, refunded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="returns")

# --- Agent State Models ---

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="active") # active, achieved, investigating
    target_metric = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Investigation(Base):
    __tablename__ = "investigations"
    
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=True)
    metric_name = Column(String, nullable=False)
    anomaly_score = Column(Float, default=0.0) # 0.0 to 10.0
    status = Column(String, default="in_progress") # in_progress, completed, action_pending, resolved
    summary = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    hypotheses = relationship("Hypothesis", back_populates="investigation", cascade="all, delete-orphan")
    tool_calls = relationship("ToolCall", back_populates="investigation", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="investigation", cascade="all, delete-orphan")

class Hypothesis(Base):
    __tablename__ = "hypotheses"
    
    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    hypothesis_text = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.5) # 0.0 to 1.0
    validation_status = Column(String, default="testing") # testing, confirmed, rejected
    evidence = Column(Text, nullable=True)

    investigation = relationship("Investigation", back_populates="hypotheses")

class ToolCall(Base):
    __tablename__ = "tool_calls"
    
    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    tool_name = Column(String, nullable=False) # e.g. SQL_Query, Calculate_Variance, Supply_Chain_Sim
    input_params = Column(JSON, nullable=True)
    output_result = Column(JSON, nullable=True)
    execution_time_ms = Column(Integer, default=120)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    investigation = relationship("Investigation", back_populates="tool_calls")

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    investigation_id = Column(Integer, ForeignKey("investigations.id"))
    title = Column(String, nullable=False)
    strategy_type = Column(String, nullable=False) # Aggressive, Balanced, Conservative
    description = Column(Text, nullable=False)
    estimated_cost = Column(Float, default=0.0)
    projected_revenue_impact = Column(Float, default=0.0)
    projected_roi = Column(Float, default=0.0) # e.g. 3.4x
    risk_level = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="pending") # pending, approved, rejected, executed
    approved_at = Column(DateTime, nullable=True)

    investigation = relationship("Investigation", back_populates="decisions")
    outcome = relationship("Outcome", uselist=False, back_populates="decision")

class Outcome(Base):
    __tablename__ = "outcomes"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("decisions.id"))
    actual_roi = Column(Float, default=0.0)
    revenue_recovered = Column(Float, default=0.0)
    status = Column(String, default="simulated_success")
    summary = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    decision = relationship("Decision", back_populates="outcome")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String, nullable=False) # INVESTIGATION_STARTED, ACTION_APPROVED, ACTION_REJECTED
    performed_by = Column(String, default="ARGUS System")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
