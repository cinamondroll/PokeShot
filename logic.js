var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ======================
// SCENE
// ======================

var currentScene = "menu";
var nextScene = "";

var isTransitioning = false;
var transitionAlpha = 0;
var transitionSpeed = 0.03;
var transitionDirection = 1;

// ======================
// DEVICE
// ======================

var isMobile =
    /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
    );

// ======================
// GAME STATE
// ======================

var gameState = {
    score: 0,
    lives: 3,
    wave: 1,
    hiScore: 0
};

function resetGameState() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.wave = 1;
    enemies = [];
    waveState.enemiesPerWave = 4;
    waveState.spawnInterval = 120;
    waveState.spawnTimer = 90;
    waveState.enemiesSpawned = 0;
    shotState.holding = false;
    shotState.holdDuration = 0;
    shotState.zoomScale = 1;
    shotState.timeScale = 1;
    shotState.missFlash = 0;
    shotState.hitFlash = 0;
    aimTouchId = -1;
    shootTouchId = -1;
}

function loseLife() {
    if (gameState.lives <= 0) return;
    gameState.lives--;
    if (gameState.lives <= 0) {
        if (gameState.score > gameState.hiScore) {
            gameState.hiScore = gameState.score;
        }
        startTransition("gameOver");
    }
}

// ======================
// SHOT MECHANICS
// ======================

var shotState = {
    holding: false,
    holdDuration: 0,
    zoomScale: 1,
    zoomTargetScale: 1.3,
    timeScale: 1,
    missFlash: 0,
    hitFlash: 0
};

function startHold() {
    if (shotState.holding) return;
    shotState.holding = true;
    shotState.holdDuration = 0;
}

function releaseShot() {
    if (!shotState.holding) return;
    shotState.holding = false;
    shotState.holdDuration = 0;
    fireShot();
}

function fireShot() {
    var hitSize = 30;
    var aimRect = {
        x: aim.x - hitSize / 2,
        y: aim.y - hitSize / 2,
        width: hitSize,
        height: hitSize
    };

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive && rectsOverlap(aimRect, enemies[i])) {
            enemies[i].alive = false;
            gameState.score += enemies[i].points;
            shotState.hitFlash = 12;
            return;
        }
    }

    // Miss — penalti hanya jika ada enemy di arena
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
    if (shotState.hitFlash > 0) shotState.hitFlash--;
}

function drawZoomEffect(drawCallback) {
    ctx.save();
    var s = shotState.zoomScale;
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

// ======================
// ENEMIES
// ======================

var enemies = [];

function spawnEnemy() {
    var size = 60;
    var speed = 1.0 + gameState.wave * 0.25;
    var angle = Math.random() * Math.PI * 2;
    var maxTimer = Math.max(120, 300 - gameState.wave * 20);

    enemies.push({
        x: Math.random() * (canvas.width - size * 2) + size,
        y: Math.random() * (canvas.height - size * 2 - 80) + 80,
        width: size,
        height: size,
        speed: speed,
        dirX: Math.cos(angle),
        dirY: Math.sin(angle),
        alive: true,
        points: 10 * gameState.wave,
        threatTimer: maxTimer,
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

        // Bounce off walls
        if (e.x < 0) { e.x = 0; e.dirX *= -1; }
        if (e.x + e.width > canvas.width) {
            e.x = canvas.width - e.width; e.dirX *= -1;
        }
        if (e.y < 60) { e.y = 60; e.dirY *= -1; }
        if (e.y + e.height > canvas.height) {
            e.y = canvas.height - e.height; e.dirY *= -1;
        }

        // Threat countdown
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

        // Body
        ctx.fillStyle = "rgba(180,30,30,0.9)";
        ctx.fillRect(e.x, e.y, e.width, e.height);

        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = "darkred";
        ctx.strokeRect(e.x, e.y, e.width, e.height);

        // Threat timer bar (above enemy)
        var ratio = Math.max(0, e.threatTimer / e.threatTimerMax);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(e.x, e.y - 12, e.width, 7);
        ctx.fillStyle = ratio > 0.5 ? "lime" : ratio > 0.25 ? "orange" : "red";
        ctx.fillRect(e.x, e.y - 12, e.width * ratio, 7);
    }
}

// ======================
// WAVE SYSTEM
// ======================

var waveState = {
    enemiesPerWave: 4,
    spawnInterval: 120,
    spawnTimer: 90,
    enemiesSpawned: 0
};

function updateWave() {
    if (waveState.enemiesSpawned < waveState.enemiesPerWave) {
        waveState.spawnTimer--;
        if (waveState.spawnTimer <= 0) {
            spawnEnemy();
            waveState.enemiesSpawned++;
            waveState.spawnTimer = waveState.spawnInterval;
        }
    } else if (enemies.length === 0) {
        startNextWave();
    }
}

function startNextWave() {
    gameState.wave++;
    waveState.enemiesPerWave = Math.min(4 + gameState.wave, 12);
    waveState.spawnInterval = Math.max(50, 120 - gameState.wave * 5);
    waveState.spawnTimer = 90;
    waveState.enemiesSpawned = 0;
}

// ======================
// COLLISION
// ======================

function rectsOverlap(a, b) {
    var acx = a.x + a.width / 2;
    var acy = a.y + a.height / 2;
    var bcx = b.x + b.width / 2;
    var bcy = b.y + b.height / 2;
    return Math.abs(acx - bcx) < (a.width / 2 + b.width / 2) &&
        Math.abs(acy - bcy) < (a.height / 2 + b.height / 2);
}

// ======================
// AIM
// ======================

var aim = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// ======================
// BUTTON
// ======================

var button = {
    x: 380,
    y: 410,
    width: 200,
    height: 70,
    radius: 10,
    hover: false,
    scale: 1,
    targetScale: 1
};

var restartButton = {
    x: 310,
    y: 360,
    width: 160,
    height: 60,
    radius: 10,
    hover: false,
    scale: 1,
    targetScale: 1
};

var menuButton = {
    x: 490,
    y: 360,
    width: 160,
    height: 60,
    radius: 10,
    hover: false,
    scale: 1,
    targetScale: 1
};

// Mobile-only shoot button (circular, bottom-right)
var shootMobileButton = {
    cx: 860,
    cy: 450,
    r: 55
};

// ======================
// LOGO ANIMATION
// ======================

var logoScale = 1;
var logoScaleSpeed = 0.0008;

// ======================
// IMAGE
// ======================

var bg = new Image();
bg.src = "background.jpg";

var logo = new Image();
logo.src = "logo.png";

// ======================
// GAME LOOP
// ======================

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ======================
    // DRAW SCENE
    // ======================

    if (currentScene == "menu") {
        drawMenu();
    }
    else if (currentScene == "gameplay") {
        updateGameplay();
        drawGameplay();
    }
    else if (currentScene == "gameOver") {
        drawGameOver();
    }

    // ======================
    // TRANSITION
    // ======================

    drawTransition();

    requestAnimationFrame(gameLoop);
}

// ======================
// GAMEPLAY UPDATE
// ======================

function updateGameplay() {
    if (isTransitioning) return;
    updateShotMechanics();
    updateEnemies();
    updateWave();
}

// ======================
// MENU SCENE
// ======================

function drawMenu() {
    // Background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Text Style
    ctx.textAlign = "center";
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "black";

    // ======================
    // TITLE
    // ======================

    ctx.font = "45px Poppins";
    ctx.strokeText("Main Menu", canvas.width / 2, 70);

    // ======================
    // LOGO ANIMATION
    // ======================

    logoScale += logoScaleSpeed;

    if (logoScale >= 1.03 || logoScale <= 0.97) {
        logoScaleSpeed *= -1;
    }

    var logoWidth = 200 * logoScale;
    var logoHeight = 200 * logoScale;

    var logoX = 480 - logoWidth / 2;
    var logoY = 210 - logoHeight / 2;

    // Draw Logo
    ctx.drawImage(
        logo,
        logoX,
        logoY,
        logoWidth,
        logoHeight
    );

    // ======================
    // SUBTITLE
    // ======================

    ctx.font = "30px Poppins";
    ctx.strokeText("Example Game", canvas.width / 2, 360);

    // ======================
    // BUTTON
    // ======================

    if (button.hover) {
        button.targetScale = 1.08;
    }
    else {
        button.targetScale = 1;
    }

    // Smooth Scale
    button.scale +=
        (button.targetScale - button.scale) * 0.12;

    var width = button.width * button.scale;
    var height = button.height * button.scale;

    var x =
        button.x - (width - button.width) / 2;

    var y =
        button.y - (height - button.height) / 2;

    var radius = button.radius;

    // ======================
    // BUTTON GLOW
    // ======================

    if (button.hover) {
        ctx.globalCompositeOperation = "lighter";

        ctx.fillStyle = "rgba(255,255,255,0.08)";

        ctx.beginPath();

        ctx.roundRect(
            x - 15,
            y - 15,
            width + 30,
            height + 30,
            radius + 10
        );

        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
    }

    // ======================
    // BUTTON BORDER
    // ======================

    ctx.lineWidth = 2;

    if (button.hover) {
        ctx.strokeStyle = "white";
    }
    else {
        ctx.strokeStyle = "black";
    }

    // Rounded Button
    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(x + radius, y + height);

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(x, y + radius);

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

    ctx.stroke();

    // ======================
    // START TEXT
    // ======================

    ctx.font = "36px Poppins";

    if (button.hover) {
        ctx.strokeStyle = "white";
    }
    else {
        ctx.strokeStyle = "darkgreen";
    }

    ctx.strokeText(
        "START",
        canvas.width / 2,
        y + height / 2 + 12
    );
}

// ======================
// GAMEPLAY SCENE
// ======================

function drawGameplay() {
    // Grayscale progress (0 = normal, 1 = full B&W) tied to zoom level
    var zoomProgress =
        (shotState.zoomScale - 1) / (shotState.zoomTargetScale - 1);
    zoomProgress = Math.max(0, Math.min(1, zoomProgress));

    // Apply grayscale + slight brightness drop on zoomed layer
    ctx.filter =
        "grayscale(" + Math.round(zoomProgress * 100) + "%)" +
        " brightness(" + (1 - zoomProgress * 0.15) + ")";

    // Background + enemies together inside zoom transform
    drawZoomEffect(function () {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawEnemies();
    });

    // Reset filter — UI layer always full color
    ctx.filter = "none";

    drawAim();
    if (isMobile) drawMobileShootButton();
    drawHUD();
    drawShotFlash();
}

// ======================
// HUD
// ======================

function drawHUD() {
    ctx.lineWidth = 1.5;
    ctx.font = "24px Poppins";

    // Score - left
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText("SCORE: " + gameState.score, 20, 35);
    ctx.strokeText("SCORE: " + gameState.score, 20, 35);

    // Wave - center
    ctx.textAlign = "center";
    ctx.fillText("WAVE " + gameState.wave, canvas.width / 2, 35);
    ctx.strokeText("WAVE " + gameState.wave, canvas.width / 2, 35);

    // Lives - right
    ctx.textAlign = "right";
    ctx.fillText("LIVES: " + gameState.lives, canvas.width - 20, 35);
    ctx.strokeText("LIVES: " + gameState.lives, canvas.width - 20, 35);

    // Aiming indicator (desktop only — mobile has shoot button)
    if (shotState.holding && !isMobile) {
        ctx.textAlign = "center";
        ctx.font = "18px Poppins";
        ctx.fillStyle = "rgba(255,240,150,0.95)";
        ctx.fillText("[ AIMING — RELEASE TO SHOOT ]", canvas.width / 2, canvas.height - 20);
    }
}

// ======================
// GAMEOVER SCENE
// ======================

function drawGameOver() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.lineWidth = 1.5;

    // Title
    ctx.font = "60px Poppins";
    ctx.strokeStyle = "darkred";
    ctx.strokeText("GAME OVER", canvas.width / 2, 140);

    // Score info
    ctx.font = "30px Poppins";
    ctx.strokeStyle = "black";
    ctx.strokeText("SCORE: " + gameState.score, canvas.width / 2, 220);
    ctx.strokeText("BEST:  " + gameState.hiScore, canvas.width / 2, 265);

    // Buttons
    drawSceneButton(restartButton, "RESTART", "darkgreen");
    drawSceneButton(menuButton, "MENU", "navy");
}

function drawSceneButton(btn, label, textColor) {
    if (btn.hover) {
        btn.targetScale = 1.08;
    } else {
        btn.targetScale = 1;
    }

    btn.scale += (btn.targetScale - btn.scale) * 0.12;

    var width = btn.width * btn.scale;
    var height = btn.height * btn.scale;
    var x = btn.x - (width - btn.width) / 2;
    var y = btn.y - (height - btn.height) / 2;
    var radius = btn.radius;

    // Glow
    if (btn.hover) {
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 10, width + 20, height + 20, radius + 8);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
    }

    // Border
    ctx.lineWidth = 2;
    ctx.strokeStyle = btn.hover ? "white" : "black";
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();

    // Label
    ctx.font = "28px Poppins";
    ctx.strokeStyle = btn.hover ? "white" : textColor;
    ctx.strokeText(label, btn.x + btn.width / 2, y + height / 2 + 10);
}

// ======================
// DRAW AIM
// ======================

function drawAim() {
    var radius = 20;
    var crossLen = 30;

    // Pulsing ring while holding
    if (shotState.holding) {
        var pulse = (shotState.holdDuration % 30) / 30;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,200,0," + (1 - pulse) + ")";
        ctx.beginPath();
        ctx.arc(aim.x, aim.y, radius + pulse * 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = shotState.holding ? "gold" : "red";

    // Circle
    ctx.beginPath();
    ctx.arc(aim.x, aim.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair
    ctx.beginPath();
    ctx.moveTo(aim.x - crossLen, aim.y);
    ctx.lineTo(aim.x + crossLen, aim.y);
    ctx.moveTo(aim.x, aim.y - crossLen);
    ctx.lineTo(aim.x, aim.y + crossLen);
    ctx.stroke();
}

// ======================
// MOBILE SHOOT BUTTON
// ======================

function drawMobileShootButton() {
    var btn = shootMobileButton;
    var isHolding = shotState.holding;

    // Pulsing outer ring while holding
    if (isHolding) {
        var pulse = (shotState.holdDuration % 30) / 30;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255,200,0," + (1 - pulse) + ")";
        ctx.beginPath();
        ctx.arc(btn.cx, btn.cy, btn.r + pulse * 18, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Fill
    ctx.fillStyle = isHolding
        ? "rgba(255,200,0,0.22)"
        : "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.lineWidth = 3;
    ctx.strokeStyle = isHolding ? "gold" : "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI * 2);
    ctx.stroke();

    // Label
    ctx.textAlign = "center";
    ctx.font = "18px Poppins";
    ctx.fillStyle = isHolding ? "gold" : "rgba(255,255,255,0.9)";
    ctx.fillText(
        isHolding ? "RELEASE" : "SHOOT",
        btn.cx,
        btn.cy + 6
    );
}

// ======================
// TRANSITION
// ======================

function startTransition(sceneName) {
    if (isTransitioning) return;

    if (
        currentScene == "menu" &&
        sceneName == "gameplay"
    ) {
        resetGameState();
    }

    nextScene = sceneName;

    isTransitioning = true;

    transitionDirection = 1;
}

function drawTransition() {
    if (!isTransitioning) return;

    transitionAlpha +=
        transitionSpeed * transitionDirection;

    // Fade Out selesai
    if (transitionAlpha >= 1) {
        transitionAlpha = 1;

        currentScene = nextScene;

        transitionDirection = -1;
    }

    // Fade In selesai
    if (transitionAlpha <= 0) {
        transitionAlpha = 0;

        isTransitioning = false;
    }

    // Draw Fade
    ctx.fillStyle =
        "rgba(0,0,0," + transitionAlpha + ")";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// ======================
// MOUSE MOVE
// ======================

canvas.addEventListener(
    "mousemove",
    function (event) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var mouseX = (event.clientX - rect.left) * scaleX;
        var mouseY = (event.clientY - rect.top) * scaleY;

        // Menu hover
        if (currentScene == "menu") {
            button.hover =
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height;
        }

        // Gameplay aim (desktop)
        if (currentScene == "gameplay" && !isMobile) {
            aim.x = mouseX;
            aim.y = mouseY;
        }

        // Game over button hover
        if (currentScene == "gameOver") {
            restartButton.hover =
                mouseX > restartButton.x &&
                mouseX < restartButton.x + restartButton.width &&
                mouseY > restartButton.y &&
                mouseY < restartButton.y + restartButton.height;

            menuButton.hover =
                mouseX > menuButton.x &&
                mouseX < menuButton.x + menuButton.width &&
                mouseY > menuButton.y &&
                mouseY < menuButton.y + menuButton.height;
        }
    });

// ======================
// MOUSE DOWN / UP
// ======================

canvas.addEventListener("mousedown", function () {
    if (currentScene == "menu" && button.hover) {
        startTransition("gameplay");
    }
    if (currentScene == "gameplay") {
        startHold();
    }
});

canvas.addEventListener("mouseup", function () {
    if (currentScene == "gameplay") {
        releaseShot();
    }
    if (currentScene == "gameOver") {
        if (restartButton.hover) {
            resetGameState();
            startTransition("gameplay");
        }
        if (menuButton.hover) {
            startTransition("menu");
        }
    }
});

// ======================
// MOBILE TOUCH
// ======================

// Track which touch controls aim drag vs. shoot button
var aimTouchId = -1;
var shootTouchId = -1;
var aimLastX = 0;
var aimLastY = 0;

canvas.addEventListener(
    "touchstart",
    function (event) {
        if (!isMobile) return;

        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var tx = (touch.clientX - rect.left) * scaleX;
            var ty = (touch.clientY - rect.top) * scaleY;

            if (currentScene == "gameplay") {
                event.preventDefault();

                // Shoot button takes priority
                var dx = tx - shootMobileButton.cx;
                var dy = ty - shootMobileButton.cy;
                if (shootTouchId === -1 &&
                    Math.sqrt(dx * dx + dy * dy) <= shootMobileButton.r) {
                    shootTouchId = touch.identifier;
                    startHold();
                    continue;
                }

                // Aim drag — any touch outside shoot button controls the aim
                if (aimTouchId === -1) {
                    aimTouchId = touch.identifier;
                    aimLastX = touch.clientX;
                    aimLastY = touch.clientY;
                }
                continue;
            }

            if (currentScene == "menu") {
                if (
                    tx > button.x && tx < button.x + button.width &&
                    ty > button.y && ty < button.y + button.height
                ) {
                    startTransition("gameplay");
                }
            }

            if (currentScene == "gameOver") {
                if (
                    tx > restartButton.x &&
                    tx < restartButton.x + restartButton.width &&
                    ty > restartButton.y &&
                    ty < restartButton.y + restartButton.height
                ) {
                    resetGameState();
                    startTransition("gameplay");
                }
                if (
                    tx > menuButton.x &&
                    tx < menuButton.x + menuButton.width &&
                    ty > menuButton.y &&
                    ty < menuButton.y + menuButton.height
                ) {
                    startTransition("menu");
                }
            }
        }
    }, { passive: false });

canvas.addEventListener(
    "touchmove",
    function (event) {
        if (!isMobile) return;
        if (currentScene != "gameplay") return;

        event.preventDefault();

        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier !== aimTouchId) continue;

            // Aim moves by drag delta (relative)
            aim.x += (touch.clientX - aimLastX) * scaleX;
            aim.y += (touch.clientY - aimLastY) * scaleY;
            aimLastX = touch.clientX;
            aimLastY = touch.clientY;

            aim.x = Math.max(0, Math.min(canvas.width, aim.x));
            aim.y = Math.max(0, Math.min(canvas.height, aim.y));
        }
    }, { passive: false });

canvas.addEventListener(
    "touchend",
    function (event) {
        if (!isMobile) return;
        if (currentScene != "gameplay") return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === aimTouchId) {
                aimTouchId = -1;
            }
            if (touch.identifier === shootTouchId) {
                shootTouchId = -1;
                releaseShot();
            }
        }
    });

canvas.addEventListener(
    "touchcancel",
    function (event) {
        if (!isMobile) return;
        if (currentScene != "gameplay") return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === aimTouchId) aimTouchId = -1;
            if (touch.identifier === shootTouchId) {
                shootTouchId = -1;
                releaseShot();
            }
        }
    });

// ======================
// LOAD IMAGE
// ======================

bg.onload = function () {
    logo.onload = function () {
        gameLoop();
    };
};
