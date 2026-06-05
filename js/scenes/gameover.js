// === GAMEOVER SCENE ===
function drawGameOver() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    // Title
    ctx.font        = "900 56px 'Cinzel'";
    ctx.shadowBlur  = 28;
    ctx.shadowColor = "rgba(200,50,255,0.75)";
    ctx.fillStyle   = "rgba(230,160,255,1)";
    ctx.fillText("GAME OVER", canvas.width / 2, 136);
    ctx.shadowBlur  = 0;

    // Score info
    ctx.font        = "600 28px 'Cinzel'";
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(160,80,255,0.6)";
    ctx.fillStyle   = "rgba(200,170,255,0.95)";
    ctx.fillText("SCORE : " + gameState.score,   canvas.width / 2, 218);
    ctx.fillText("BEST  : " + gameState.hiScore, canvas.width / 2, 262);
    ctx.shadowBlur  = 0;

    drawSceneButton(restartButton, "RESTART");
    drawSceneButton(menuButton,    "MENU");
}

function drawSceneButton(btn, label) {
    if (btn.hover) btn.targetScale = 1.08;
    else           btn.targetScale = 1;
    btn.scale += (btn.targetScale - btn.scale) * 0.12;

    var width  = btn.width  * btn.scale;
    var height = btn.height * btn.scale;
    var x      = btn.x - (width  - btn.width)  / 2;
    var y      = btn.y - (height - btn.height) / 2;
    var radius = btn.radius;

    // Dark purple fill
    ctx.fillStyle = btn.hover
        ? "rgba(55,12,110,0.88)"
        : "rgba(28,6,60,0.78)";
    drawRoundedPath(x, y, width, height, radius);
    ctx.fill();

    // Purple border with glow
    ctx.lineWidth   = 2;
    ctx.shadowBlur  = btn.hover ? 22 : 8;
    ctx.shadowColor = "rgba(180,90,255,0.85)";
    ctx.strokeStyle = btn.hover
        ? "rgba(210,150,255,1)"
        : "rgba(140,65,215,0.85)";
    drawRoundedPath(x, y, width, height, radius);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.font        = "600 27px 'Cinzel'";
    ctx.shadowBlur  = 14;
    ctx.shadowColor = "rgba(200,120,255,0.9)";
    ctx.fillStyle   = btn.hover
        ? "rgba(240,210,255,1)"
        : "rgba(200,170,255,0.9)";
    ctx.fillText(label, btn.x + btn.width / 2, y + height / 2 + 10);
    ctx.shadowBlur  = 0;
}
