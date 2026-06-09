// === GAMEPLAY UPDATE ===
function updateGameplay() {
    if (isTransitioning || showTutorial || showHexagonWarning) return;
    updateShotMechanics();
    updateEnemies();
    updateWave();
    updateExplosions();
}

// === GAMEPLAY SCENE ===
function drawGameplay() {
    if (showTutorial) {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawTutorial();
        return;
    }

    if (showHexagonWarning) {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawHexagonWarning();
        return;
    }

    var zoomProgress =
        (shotState.zoomScale - 1) / (shotState.zoomTargetScale - 1);
    zoomProgress = Math.max(0, Math.min(1, zoomProgress));

    ctx.filter =
        "grayscale(" + Math.round(zoomProgress * 100) + "%)" +
        " brightness(" + (1 - zoomProgress * 0.15) + ")";

    drawZoomEffect(function () {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawEnemies();
        drawExplosions();
    });

    ctx.filter = "none";

    drawAim();
    if (isMobile) drawMobileShootButton();
    drawHUD();
    drawShotFlash();
}

// === TUTORIAL ===
function drawTutorial() {
    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var panelW = 600;
    var panelH = 290;
    var panelX = (canvas.width  - panelW) / 2;
    var panelY = (canvas.height - panelH) / 2;

    // Panel fill
    var grad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    grad.addColorStop(0, "rgba(20,5,45,0.97)");
    grad.addColorStop(1, "rgba(10,2,28,0.97)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 14);
    ctx.fill();

    // Panel border
    ctx.lineWidth   = 1.5;
    ctx.shadowBlur  = 12;
    ctx.shadowColor = "rgba(160,80,255,0.6)";
    ctx.strokeStyle = "rgba(150,75,255,0.55)";
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 14);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Title
    ctx.textAlign   = "center";
    ctx.font        = "700 22px 'Cinzel'";
    ctx.shadowBlur  = 14;
    ctx.shadowColor = "rgba(180,80,255,0.7)";
    ctx.fillStyle   = "rgba(215,180,255,1)";
    ctx.fillText("CARA BERMAIN", canvas.width / 2, panelY + 44);
    ctx.shadowBlur  = 0;

    // Divider top
    ctx.strokeStyle = "rgba(150,75,255,0.25)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 30, panelY + 60);
    ctx.lineTo(panelX + panelW - 30, panelY + 60);
    ctx.stroke();

    // Web section
    ctx.textAlign   = "left";
    ctx.font        = "600 15px 'Cinzel'";
    ctx.fillStyle   = "rgba(150,200,255,1)";
    ctx.fillText("Web", panelX + 36, panelY + 92);

    ctx.font      = "400 14px 'Cinzel'";
    ctx.fillStyle = "rgba(200,185,230,0.92)";
    ctx.fillText(
        "Klik dan tahan pada enemy, lepaskan untuk menembak",
        panelX + 36, panelY + 114
    );

    // Mobile section
    ctx.font      = "600 15px 'Cinzel'";
    ctx.fillStyle = "rgba(150,255,185,1)";
    ctx.fillText("Mobile", panelX + 36, panelY + 152);

    ctx.font      = "400 14px 'Cinzel'";
    ctx.fillStyle = "rgba(200,185,230,0.92)";
    ctx.fillText(
        "Drag aim ke enemy, tekan tombol SHOOT dan lepaskan untuk menembak",
        panelX + 36, panelY + 174
    );
    ctx.fillText(
        "(main dengan 2 jari)",
        panelX + 36, panelY + 196
    );

    // Divider bottom
    ctx.strokeStyle = "rgba(150,75,255,0.18)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 30, panelY + 216);
    ctx.lineTo(panelX + panelW - 30, panelY + 216);
    ctx.stroke();

    // Dismiss hint
    ctx.textAlign   = "center";
    ctx.font        = "400 13px 'Cinzel'";
    ctx.fillStyle   = "rgba(255,235,120,0.85)";
    ctx.fillText(
        "Klik / Tap di mana saja untuk mulai",
        canvas.width / 2, panelY + panelH - 18
    );
}

// === HEXAGON WARNING POPUP ===
function drawHexagonWarning() {
    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.70)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var panelW = 420;
    var panelH = 240;
    var panelX = (canvas.width  - panelW) / 2;
    var panelY = (canvas.height - panelH) / 2;

    // Panel fill
    var grad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    grad.addColorStop(0, "rgba(22,5,50,0.97)");
    grad.addColorStop(1, "rgba(10,2,28,0.97)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 14);
    ctx.fill();

    // Panel border glow
    ctx.lineWidth   = 1.5;
    ctx.shadowBlur  = 14;
    ctx.shadowColor = "rgba(255,90,90,0.55)";
    ctx.strokeStyle = "rgba(255,90,90,0.60)";
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, 14);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Title
    ctx.textAlign   = "center";
    ctx.font        = "700 20px 'Cinzel'";
    ctx.shadowBlur  = 16;
    ctx.shadowColor = "rgba(255,80,80,0.75)";
    ctx.fillStyle   = "rgba(255,160,140,1)";
    ctx.fillText("WAVE 4 — MUSUH BARU!", canvas.width / 2, panelY + 40);
    ctx.shadowBlur  = 0;

    // Divider
    ctx.strokeStyle = "rgba(255,90,90,0.22)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 30, panelY + 56);
    ctx.lineTo(panelX + panelW - 30, panelY + 56);
    ctx.stroke();

    // Draw hexagon illustration
    var hx = canvas.width / 2 - 80;
    var hy = panelY + 120;
    var hr = 32;
    var hRot = Math.PI / 6; // flat-top hexagon

    ctx.shadowBlur  = 22;
    ctx.shadowColor = "rgba(230,215,255,0.9)";
    ctx.fillStyle   = "rgba(235,220,255,0.16)";
    drawPolygon(hx, hy, hr, 6, hRot);
    ctx.fill();

    ctx.lineWidth   = 2;
    ctx.strokeStyle = "rgba(255,252,255,1)";
    drawPolygon(hx, hy, hr, 6, hRot);
    ctx.stroke();

    // Inner warning ring
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = "rgba(255,90,90,0.5)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(hx, hy, hr * 0.38, 0, Math.PI * 2);
    ctx.stroke();

    // Warning text next to hexagon
    ctx.textAlign   = "left";
    ctx.font        = "700 16px 'Cinzel'";
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(255,90,90,0.7)";
    ctx.fillStyle   = "rgba(255,140,120,1)";
    ctx.fillText("Jangan ditembak!", hx + hr + 16, hy - 10);
    ctx.shadowBlur  = 0;

    ctx.font      = "400 13px 'Cinzel'";
    ctx.fillStyle = "rgba(200,185,230,0.88)";
    ctx.fillText("Menembak hexagon ini", hx + hr + 16, hy + 12);
    ctx.fillText("mengurangi 1 nyawa.", hx + hr + 16, hy + 30);

    // Divider bottom
    ctx.strokeStyle = "rgba(255,90,90,0.15)";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 30, panelY + panelH - 38);
    ctx.lineTo(panelX + panelW - 30, panelY + panelH - 38);
    ctx.stroke();

    // Dismiss hint
    ctx.textAlign   = "center";
    ctx.font        = "400 13px 'Cinzel'";
    ctx.fillStyle   = "rgba(255,235,120,0.82)";
    ctx.fillText("Klik / Tap untuk lanjut", canvas.width / 2, panelY + panelH - 16);
}

// === HUD ===
function drawHUD() {
    ctx.font        = "600 22px 'Cinzel'";
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(160,80,255,0.65)";
    ctx.fillStyle   = "rgba(215,185,255,1)";

    // Score — left
    ctx.textAlign = "left";
    ctx.fillText("SCORE : " + gameState.score, 20, 35);

    // Wave — center
    ctx.textAlign = "center";
    ctx.fillText("WAVE " + gameState.wave, canvas.width / 2, 35);

    ctx.shadowBlur = 0;

    // Lives as hearts — right side
    var maxLives  = 3;
    var hSize     = 11;   // half-height of heart
    var hSpacing  = 28;
    // Rightmost heart ends at canvas.width - 14, then hearts go left
    var lastHx = canvas.width - 18;
    var hY     = 22;

    for (var i = maxLives - 1; i >= 0; i--) {
        var hx = lastHx - (maxLives - 1 - i) * hSpacing;
        if (i < gameState.lives) {
            ctx.shadowBlur  = 14;
            ctx.shadowColor = "rgba(255,80,180,0.85)";
            ctx.fillStyle   = "rgba(255,80,165,1)";
            drawHeart(hx, hY, hSize);
            ctx.fill();
            ctx.shadowBlur  = 0;
        } else {
            ctx.strokeStyle = "rgba(200,80,160,0.32)";
            ctx.lineWidth   = 1;
            drawHeart(hx, hY, hSize);
            ctx.stroke();
        }
    }

    // Aiming hint (desktop)
    if (shotState.holding && !isMobile) {
        ctx.textAlign   = "center";
        ctx.font        = "400 16px 'Cinzel'";
        ctx.shadowBlur  = 8;
        ctx.shadowColor = "rgba(200,180,50,0.7)";
        ctx.fillStyle   = "rgba(255,240,150,0.95)";
        ctx.fillText("[ AIMING — RELEASE TO SHOOT ]", canvas.width / 2, canvas.height - 20);
        ctx.shadowBlur  = 0;
    }
}
