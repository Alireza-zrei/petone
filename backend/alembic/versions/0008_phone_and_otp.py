"""phone column on users + otp_codes table

Revision ID: 0008_phone_and_otp
Revises: 0007_refresh_tokens
Create Date: 2026-05-23

Notes:
- The phone column is added as NOT NULL with no default. This will fail on a
  database that already contains user rows; acceptable because Petone has no
  production users yet. For a future migration on a populated DB, split into
  (add nullable) -> (backfill) -> (alter NOT NULL).
"""
import sqlalchemy as sa

from alembic import op

revision = "0008_phone_and_otp"
down_revision = "0007_refresh_tokens"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("users") as batch:
        batch.add_column(sa.Column("phone", sa.String(length=10), nullable=False))
    op.create_index("ix_users_phone", "users", ["phone"], unique=True)

    op.create_table(
        "otp_codes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("mobile", sa.String(length=10), nullable=False),
        sa.Column("code_hash", sa.String(length=64), nullable=False),
        sa.Column("purpose", sa.String(length=20), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_otp_codes_mobile", "otp_codes", ["mobile"])
    op.create_index("ix_otp_codes_purpose", "otp_codes", ["purpose"])


def downgrade() -> None:
    op.drop_index("ix_otp_codes_purpose", table_name="otp_codes")
    op.drop_index("ix_otp_codes_mobile", table_name="otp_codes")
    op.drop_table("otp_codes")
    op.drop_index("ix_users_phone", table_name="users")
    with op.batch_alter_table("users") as batch:
        batch.drop_column("phone")
