"""add role to user

Revision ID: 9fc7e6e05a91
Revises: e6712069a8b0
Create Date: 2026-01-06 11:17:06.671629

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9fc7e6e05a91'
down_revision = 'e6712069a8b0'
branch_labels = None
depends_on = None


def upgrade():
    # ✅ role 컬럼 추가 (기존 유저들에 기본값 USER 채우기 위해 server_default 사용)
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('role', sa.String(length=20), nullable=False, server_default='USER')
        )


def downgrade():
    # ✅ role 컬럼 제거
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('role')
