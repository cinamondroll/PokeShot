// === ENEMIES ===
var enemies = [];

// Draw a regular polygon (n sides) centered at (cx,cy) with circumradius r
function drawPolygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (var i = 0; i < sides; i++) {
        var angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + rotation;
        var px = cx + r * Math.cos(angle);
        var py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else         ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function spawnEnemy() {
    var size     = 60;
    var speed    = 1.0 + gameState.wave * 0.25;
    var angle    = Math.random() * Math.PI * 2;
    var maxTimer = Math.max(120, 300 - gameState.wave * 20);
    // Hexagon only from wave 4 onwards; 72% pentagon, 28% hexagon
    var type = (gameState.wave >= 4 && Math.random() >= 0.72) ? "hexagon" : "pentagon";

    enemies.push({
        x:            Math.random() * (canvas.width  - size * 2) + size,
        y:            Math.random() * (canvas.height - size * 2 - 80) + 80,
        width:        size,
        height:       size,
        speed:        speed,
        dirX:         Math.cos(angle),
        dirY:         Math.sin(angle),
        alive:        true,
        type:         type,
        points:       type === "pentagon" ? 10 * gameState.wave : 0,
        threatTimer:  maxTimer,
        threatTimerMax: maxTimer,
        rotation:     Math.random() * Math.PI * 2,
        rotSpeed:     (0.016 + Math.random() * 0.018) * (Math.random() < 0.5 ? 1 : -1),
        particles:    []
    });
}

function updateEnemies() {
    var ts = shotState.timeScale;

    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        if (!e.alive) continue;

        // Movement
        e.x += e.dirX * e.speed * ts;
        e.y += e.dirY * e.speed * ts;

        // Bounce off walls
        if (e.x < 0)                        { e.x = 0;                        e.dirX *= -1; }
        if (e.x + e.width  > canvas.width)  { e.x = canvas.width  - e.width;  e.dirX *= -1; }
        if (e.y < 60)                        { e.y = 60;                       e.dirY *= -1; }
        if (e.y + e.height > canvas.height) { e.y = canvas.height - e.height; e.dirY *= -1; }

        // Continuous rotation
        e.rotation += e.rotSpeed * ts;

        // Threat countdown
        e.threatTimer -= ts;
        if (e.threatTimer <= 0) {
            e.alive = false;
            // Hexagon despawns silently — only pentagon punishes on expiry
            if (e.type === "pentagon") loseLife();
            continue;
        }

        // Spawn aura particles
        var cx = e.x + e.width  / 2;
        var cy = e.y + e.height / 2;
        if (e.particles.length < 30 && Math.random() < 0.5) {
            var pAngle = Math.random() * Math.PI * 2;
            var pDist  = Math.random() * (e.width * 0.38);
            e.particles.push({
                ox:   Math.cos(pAngle) * pDist,
                oy:   Math.sin(pAngle) * pDist,
                vx:   Math.cos(pAngle) * (0.45 + Math.random() * 0.9),
                vy:   Math.sin(pAngle) * (0.45 + Math.random() * 0.9),
                life: 1.0,
                size: 1.2 + Math.random() * 2.4
            });
        }

        // Update aura particles
        var aliveParticles = [];
        for (var j = 0; j < e.particles.length; j++) {
            var p = e.particles[j];
            p.ox   += p.vx;
            p.oy   += p.vy;
            p.vx   *= 0.94;
            p.vy   *= 0.94;
            p.life -= 0.046;
            if (p.life > 0) aliveParticles.push(p);
        }
        e.particles = aliveParticles;
    }

    // Remove dead enemies
    var surviving = [];
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) surviving.push(enemies[i]);
    }
    enemies = surviving;
}

function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var e   = enemies[i];
        var r   = (e.width / 2) * 0.82;
        var cx  = e.x + e.width  / 2;
        var cy  = e.y + e.height / 2;
        var sides = e.type === "pentagon" ? 5 : 6;

        // === AURA PARTICLES (behind shape) ===
        for (var j = 0; j < e.particles.length; j++) {
            var p = e.particles[j];
            ctx.beginPath();
            ctx.arc(cx + p.ox, cy + p.oy, p.size, 0, Math.PI * 2);
            if (e.type === "pentagon") {
                ctx.fillStyle = "rgba(185,85,255," + (p.life * 0.72) + ")";
            } else {
                ctx.fillStyle = "rgba(225,210,255," + (p.life * 0.55) + ")";
            }
            ctx.fill();
        }

        // === POLYGON FILL + GLOW ===
        if (e.type === "pentagon") {
            ctx.shadowBlur  = 24;
            ctx.shadowColor = "rgba(175,75,255,0.95)";
            ctx.fillStyle   = "rgba(115,22,195,0.84)";
        } else {
            ctx.shadowBlur  = 28;
            ctx.shadowColor = "rgba(235,220,255,0.98)";
            ctx.fillStyle   = "rgba(235,220,255,0.16)";
        }
        drawPolygon(cx, cy, r, sides, e.rotation);
        ctx.fill();

        // === POLYGON STROKE ===
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = e.type === "pentagon"
            ? "rgba(215,145,255,1)"
            : "rgba(255,252,255,1)";
        drawPolygon(cx, cy, r, sides, e.rotation);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // === DECOY WARNING (hexagon inner ring) ===
        if (e.type === "hexagon") {
            ctx.strokeStyle = "rgba(255,90,90,0.45)";
            ctx.lineWidth   = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
            ctx.stroke();
        }

        // === THREAT TIMER BAR ===
        var ratio = Math.max(0, e.threatTimer / e.threatTimerMax);
        var barH  = 5;
        var barY  = e.y - 13;

        // Track background
        ctx.fillStyle = "rgba(10,2,30,0.65)";
        ctx.fillRect(e.x, barY, e.width, barH);

        // Bar color + glow based on urgency
        var barColor, glowColor;
        if (ratio > 0.55) {
            barColor  = "rgba(185,90,255,1)";
            glowColor = "rgba(185,90,255,0.75)";
        } else if (ratio > 0.28) {
            barColor  = "rgba(215,130,255,1)";
            glowColor = "rgba(215,130,255,0.65)";
        } else {
            barColor  = "rgba(255,80,150,1)";
            glowColor = "rgba(255,80,150,0.80)";
        }

        ctx.shadowBlur  = 7;
        ctx.shadowColor = glowColor;
        ctx.fillStyle   = barColor;
        ctx.fillRect(e.x, barY, e.width * ratio, barH);
        ctx.shadowBlur  = 0;

        // Thin bright top edge for glass effect
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(e.x, barY, e.width * ratio, 1);
    }
}

// === EXPLOSION PARTICLES ===
var explosionParticles = [];

function spawnExplosion(cx, cy, type) {
    var isPent = type === "pentagon";
    var count  = 20;
    for (var i = 0; i < count; i++) {
        var angle  = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        var speed  = 2.5 + Math.random() * 4.5;
        explosionParticles.push({
            x:    cx,
            y:    cy,
            vx:   Math.cos(angle) * speed,
            vy:   Math.sin(angle) * speed,
            life: 1.0,
            size: 2.5 + Math.random() * 4.5,
            r:    isPent ? 195 :  235,
            g:    isPent ?  85 :  215,
            b:    isPent ? 255 :  255
        });
    }
}

function updateExplosions() {
    var alive = [];
    for (var i = 0; i < explosionParticles.length; i++) {
        var p = explosionParticles[i];
        p.x   += p.vx;
        p.y   += p.vy;
        p.vx  *= 0.90;
        p.vy  *= 0.90;
        p.life -= 0.038;
        if (p.life > 0) alive.push(p);
    }
    explosionParticles = alive;
}

function drawExplosions() {
    for (var i = 0; i < explosionParticles.length; i++) {
        var p    = explosionParticles[i];
        var size = Math.max(0.3, p.size * p.life);
        var a    = p.life * 0.88;
        ctx.shadowBlur  = size * 3;
        ctx.shadowColor = "rgba(" + p.r + "," + p.g + "," + p.b + "," + a + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.r + "," + p.g + "," + p.b + "," + (a * 0.88) + ")";
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}
