"""create chunks table

Revision ID: 001
Revises:
Create Date: 2026-06-05
"""

import sqlalchemy as sa

from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "chunks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("source", sa.Text, nullable=False),
        sa.Column("embedding", sa.Text, nullable=False),
    )
    op.execute(
        "ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector"
    )


def downgrade():
    op.drop_table("chunks")
    op.execute("DROP EXTENSION IF EXISTS vector")
