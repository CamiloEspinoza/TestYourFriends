#!/usr/bin/env bash
# Blue-green zero-downtime deployment script for TestYourFriends.
# Usage: deploy.sh <image-tag>
# Called by GitHub Actions over SSH.
#
# Uses Traefik for routing — both blue and green stacks have identical
# Traefik labels. During transition, Traefik load-balances between both.
# After health check passes, the old stack is stopped.

set -euo pipefail

IMAGE_TAG="${1:-latest}"
TYF_DIR="/opt/tyf"
ACTIVE_FILE="$TYF_DIR/.active"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
die() { log "ERROR: $*" >&2; exit 1; }

# ─── 1. Determine colors ─────────────────────────────────────────────────────
if [[ -f "$ACTIVE_FILE" ]]; then
    ACTIVE=$(cat "$ACTIVE_FILE")
else
    ACTIVE="blue"
fi

if [[ "$ACTIVE" == "blue" ]]; then
    NEW="green"
else
    NEW="blue"
fi

log "Active: $ACTIVE → deploying to: $NEW"

cd "$TYF_DIR"

# ─── 2. Pull new images ───────────────────────────────────────────────────────
log "Pulling images for tag: $IMAGE_TAG"
export IMAGE_TAG
docker compose -p tyf-app -f "docker-compose.$NEW.yml" pull --ignore-pull-failures || true

# ─── 3. Start idle color ──────────────────────────────────────────────────────
log "Starting $NEW stack..."
docker compose -p tyf-app -f "docker-compose.$NEW.yml" up -d

# ─── 4. Run Prisma migrations ─────────────────────────────────────────────────
log "Running database migrations..."
docker exec "tyf-api-$NEW" sh -c "cd backend && pnpm prisma migrate deploy" || die "Prisma migration failed"

log "Running database seed..."
docker exec "tyf-api-$NEW" sh -c "cd backend && pnpm db:seed" || log "WARNING: Seed failed (non-fatal)"

# ─── 5. Health check (max 90 s) ───────────────────────────────────────────────
log "Waiting for $NEW API to be healthy..."
MAX_RETRIES=18
SLEEP_SEC=5
for i in $(seq 1 $MAX_RETRIES); do
    if docker exec "tyf-api-$NEW" wget -qO- http://localhost:3000/health > /dev/null 2>&1; then
        log "API health check passed (attempt $i)"
        break
    fi
    if [[ $i -eq $MAX_RETRIES ]]; then
        log "Health check failed after $((MAX_RETRIES * SLEEP_SEC))s — dumping API logs before rollback:"
        docker logs "tyf-api-$NEW" --tail 80 2>&1 || true
        docker compose -p tyf-app -f "docker-compose.$NEW.yml" down
        die "Deployment failed: $NEW API did not become healthy"
    fi
    log "  attempt $i/$MAX_RETRIES — waiting ${SLEEP_SEC}s..."
    sleep $SLEEP_SEC
done

# ─── 6. Record new active color ──────────────────────────────────────────────
echo "$NEW" > "$ACTIVE_FILE"
log "Active color updated to: $NEW"

# ─── 7. Drain and stop old color ─────────────────────────────────────────────
# Traefik auto-discovers via labels, so stopping old removes it from routing.
log "Waiting 15s for in-flight requests to complete before stopping $ACTIVE..."
sleep 15
docker compose -p tyf-app -f "docker-compose.$ACTIVE.yml" down
log "Stopped old $ACTIVE stack"

log "Deploy complete — running: $NEW | tag: $IMAGE_TAG"
