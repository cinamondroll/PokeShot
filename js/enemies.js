// === ENEMIES ===
var enemies = [];

function spawnEnemy() {
    var size     = 60;
    var speed    = 1.0 + gameState.wave * 0.25;
    var angle    = Math.random() * Math.PI * 2;
    var maxTimer = Math.max(120, 300 - gameState.wave * 20);

    enemies.push({
        x:            Math.random() * (canvas.width  - size * 2) + size,
        y:            Math.random() * (canvas.height - size * 2 - 80) + 80,
        width:        size,
        height:       size,
        speed:        speed,
        dirX:         Math.cos(angle),
        dirY:         Math.sin(angle),
        alive:        true,
        points:       10 * gameState.wave,
        threatTimer:  maxTimer,
        threatTimerMax: maxTimer
    });
}

function updateEnemies() {
    var ts = shotState.timeScale;

    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        if (!e.alive) continue;

        e.x += e.dirX * e.speed * ts;
        e.y += e.dirY * e.speed * ts;

        if (e.x < 0)                        { e.x = 0;                        e.dirX *= -1; }
        if (e.x + e.width  > canvas.width)  { e.x = canvas.width  - e.width;  e.dirX *= -1; }
        if (e.y < 60)                        { e.y = 60;                       e.dirY *= -1; }
        if (e.y + e.height > canvas.height) { e.y = canvas.height - e.height; e.dirY *= -1; }

        e.threatTimer -= ts;
        if (e.threatTimer <= 0) {
            e.alive = false;
            loseLife();
        }
    }

    enemies = enemies.filter(function (e) { return e.alive; });
}

function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];

        ctx.fillStyle = "rgba(180,30,30,0.9)";
        ctx.fillRect(e.x, e.y, e.width, e.height);

        ctx.lineWidth   = 2;
        ctx.strokeStyle = "darkred";
        ctx.strokeRect(e.x, e.y, e.width, e.height);

        var ratio = Math.max(0, e.threatTimer / e.threatTimerMax);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(e.x, e.y - 12, e.width, 7);
        ctx.fillStyle = ratio > 0.5 ? "lime" : ratio > 0.25 ? "orange" : "red";
        ctx.fillRect(e.x, e.y - 12, e.width * ratio, 7);
    }
}
