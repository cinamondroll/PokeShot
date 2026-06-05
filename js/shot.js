// === SHOT MECHANICS ===
var shotState = {
    holding:        false,
    holdDuration:   0,
    zoomScale:      1,
    zoomTargetScale: 1.3,
    timeScale:      1,
    missFlash:      0,
    hitFlash:       0
};

function startHold() {
    if (shotState.holding) return;
    shotState.holding     = true;
    shotState.holdDuration = 0;
}

function releaseShot() {
    if (!shotState.holding) return;
    shotState.holding     = false;
    shotState.holdDuration = 0;
    fireShot();
}

function fireShot() {
    var hitSize = 30;
    var aimRect = {
        x:      aim.x - hitSize / 2,
        y:      aim.y - hitSize / 2,
        width:  hitSize,
        height: hitSize
    };

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive && rectsOverlap(aimRect, enemies[i])) {
            enemies[i].alive  = false;
            gameState.score  += enemies[i].points;
            shotState.hitFlash = 12;
            return;
        }
    }

    if (enemies.length > 0) {
        shotState.missFlash = 20;
        loseLife();
    } else {
        shotState.missFlash = 8;
    }
}

function updateShotMechanics() {
    if (shotState.holding) {
        shotState.holdDuration++;
        shotState.zoomScale +=
            (shotState.zoomTargetScale - shotState.zoomScale) * 0.05;
        shotState.timeScale +=
            (0.15 - shotState.timeScale) * 0.05;
    } else {
        shotState.zoomScale +=
            (1 - shotState.zoomScale) * 0.08;
        shotState.timeScale +=
            (1 - shotState.timeScale) * 0.08;
    }

    if (shotState.missFlash > 0) shotState.missFlash--;
    if (shotState.hitFlash  > 0) shotState.hitFlash--;
}

function drawZoomEffect(drawCallback) {
    ctx.save();
    var s  = shotState.zoomScale;
    var ox = aim.x;
    var oy = aim.y;
    ctx.translate(ox, oy);
    ctx.scale(s, s);
    ctx.translate(-ox, -oy);
    drawCallback();
    ctx.restore();
}

function drawShotFlash() {
    if (shotState.missFlash > 0) {
        ctx.fillStyle =
            "rgba(255,0,0," + (shotState.missFlash / 20 * 0.35) + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (shotState.hitFlash > 0) {
        ctx.fillStyle =
            "rgba(255,230,0," + (shotState.hitFlash / 12 * 0.3) + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}
