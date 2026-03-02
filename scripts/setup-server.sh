#!/usr/bin/env bash
# One-time server setup for TestYourFriends production deployment.
# Run as root or with sudo.
# Usage: sudo bash scripts/setup-server.sh

set -euo pipefail

TYF_DIR="/opt/tyf"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "Setting up TestYourFriends production environment..."

# ─── 1. Create directory structure ────────────────────────────────────────────
mkdir -p "$TYF_DIR/scripts"
log "Created $TYF_DIR"

# ─── 2. Copy compose files ───────────────────────────────────────────────────
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cp "$REPO_DIR/docker-compose.blue.yml" "$TYF_DIR/"
cp "$REPO_DIR/docker-compose.green.yml" "$TYF_DIR/"
cp "$REPO_DIR/docker-compose.infra.yml" "$TYF_DIR/"
cp "$REPO_DIR/scripts/deploy.sh" "$TYF_DIR/scripts/"
chmod +x "$TYF_DIR/scripts/deploy.sh"
log "Copied compose and deploy files"

# ─── 3. Create .env.production if it doesn't exist ──────────────────────────
if [[ ! -f "$TYF_DIR/.env.production" ]]; then
    cat > "$TYF_DIR/.env.production" <<'EOF'
# ── Database ──
DATABASE_URL=postgresql://tyf:CHANGE_ME@tyf-postgres:5432/testyourfriends?schema=public
POSTGRES_USER=tyf
POSTGRES_PASSWORD=CHANGE_ME
POSTGRES_DB=testyourfriends

# ── Redis ──
REDIS_HOST=tyf-redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME

# ── Auth ──
JWT_SECRET=CHANGE_ME
JWT_EXPIRATION=7d

# ── App ──
CORS_ORIGINS=https://testyourfriends.com
APP_BASE_URL=https://testyourfriends.com

# ── AWS SES (optional) ──
AWS_REGION=
AWS_SMTP_USER=
AWS_SMTP_PASS=
SES_FROM_EMAIL=
EOF
    log "Created .env.production template — EDIT IT before deploying!"
else
    log ".env.production already exists, skipping"
fi

# ─── 4. Create tyf-infra network ─────────────────────────────────────────────
if ! docker network inspect tyf-infra &>/dev/null; then
    docker network create tyf-infra
    log "Created tyf-infra Docker network"
else
    log "tyf-infra network already exists"
fi

# ─── 5. Start infrastructure ─────────────────────────────────────────────────
cd "$TYF_DIR"
docker compose -f docker-compose.infra.yml --env-file .env.production up -d
log "Started PostgreSQL and Redis"

# ─── 6. Set initial active color ─────────────────────────────────────────────
if [[ ! -f "$TYF_DIR/.active" ]]; then
    echo "blue" > "$TYF_DIR/.active"
    log "Set initial active color to blue"
fi

log ""
log "Setup complete!"
log "Next steps:"
log "  1. Edit $TYF_DIR/.env.production with real credentials"
log "  2. Add GitHub secrets: SERVER_HOST, SERVER_USER, SERVER_SSH_KEY, GHCR_TOKEN, NEXT_PUBLIC_API_URL"
log "  3. Push to main branch to trigger first deploy"
