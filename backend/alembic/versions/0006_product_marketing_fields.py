"""product marketing fields

Revision ID: 0006_product_marketing_fields
Revises: 0005_payments
Create Date: 2026-05-22

"""
import sqlalchemy as sa
from alembic import op

revision = "0006_product_marketing_fields"
down_revision = "0005_payments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("brand", sa.String(length=255), nullable=False, server_default=""),
    )
    op.add_column(
        "products",
        sa.Column("discount_price", sa.Integer(), nullable=True),
    )
    op.add_column(
        "products",
        sa.Column("rating", sa.Float(), nullable=False, server_default="0"),
    )
    op.add_column(
        "products",
        sa.Column("reviews_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "products",
        sa.Column("is_new", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column(
        "products",
        sa.Column(
            "is_best_seller", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
    )


def downgrade() -> None:
    op.drop_column("products", "is_best_seller")
    op.drop_column("products", "is_new")
    op.drop_column("products", "reviews_count")
    op.drop_column("products", "rating")
    op.drop_column("products", "discount_price")
    op.drop_column("products", "brand")
