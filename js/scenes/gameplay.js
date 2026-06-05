// === GAMEPLAY UPDATE ===
function updateGameplay() {
    if (isTransitioning || showTutorial) return;
    updateShotMechanics();
    updateEnemies();
    updateWave();
}

// === GAMEPLAY SCENE ===
function drawGameplay() {
    if (showTutorial) {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawTutorial();
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

// === HUD ===
function drawHUD() {
    ctx.lineWidth   = 1;
    ctx.font        = "600 22px 'Cinzel'";
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(160,80,255,0.65)";
    ctx.fillStyle   = "rgba(215,185,255,1)";

    ctx.textAlign = "left";
    ctx.fillText("SCORE : " + gameState.score, 20, 35);

    ctx.textAlign = "center";
    ctx.fillText("WAVE " + gameState.wave, canvas.width / 2, 35);

    ctx.textAlign = "right";
    ctx.fillText("LIVES : " + gameState.lives, canvas.width - 20, 35);

    ctx.shadowBlur = 0;

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
