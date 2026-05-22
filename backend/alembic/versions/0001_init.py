"""init — empty baseline migration

Revision ID: 0001_init
Revises:
Create Date: 2026-05-22

This baseline carries no schema changes. Domain tables (products, users,
orders) arrive in their own migrations in later phases.
"""

revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
