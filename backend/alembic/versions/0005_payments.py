"""payments table

Revision ID: 0005_payments
Revises: 0004_carts_orders
Create Date: 2026-05-22

"""
import sqlalchemy as sa
from alembic import op

revision = "0005_payments"
down_revision = "0004_carts_orders"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False
        ),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("gateway", sa.String(length=50), nullable=False),
        sa.Column("authority", sa.String(length=255), nullable=False),
        sa.Column("ref_id", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_payments_order_id", "payments", ["order_id"])
    op.create_index("ix_payments_authority", "payments", ["authority"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_payments_authority", table_name="payments")
    op.drop_index("ix_payments_order_id", table_name="payments")
    op.drop_table("payments")
