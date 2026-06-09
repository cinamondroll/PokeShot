// === MENU SCENE ===
function drawMenu() {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // ======================
    // TITLE
    // ======================
    ctx.textAlign   = "center";
    ctx.font        = "700 44px 'Cinzel'";
    ctx.shadowBlur  = 22;
    ctx.shadowColor = "rgba(180,80,255,0.75)";
    ctx.fillStyle   = "rgba(220,185,255,1)";
    ctx.fillText("Main Menu", canvas.width / 2, 68);
    ctx.shadowBlur  = 0;

    // ======================
    // LOGO (canvas-drawn)
    // ======================
    drawLogo(canvas.width / 2, 215);

    // ======================
    // SUBTITLE
    // ======================
    ctx.textAlign   = "center";
    ctx.font        = "700 38px 'Cinzel'";
    ctx.shadowBlur  = 35;
    ctx.shadowColor = "rgba(210,100,255,1)";
    ctx.fillStyle   = "rgba(245,220,255,1)";
    ctx.fillText("Rune Hunter", canvas.width / 2, 358);
    // Second pass for stronger core
    ctx.shadowBlur  = 12;
    ctx.shadowColor = "rgba(255,255,255,0.7)";
    ctx.fillStyle   = "rgba(255,245,255,1)";
    ctx.fillText("Rune Hunter", canvas.width / 2, 358);
    ctx.shadowBlur  = 0;

    // ======================
    // BUTTON
    // ======================
    if (button.hover) button.targetScale = 1.08;
    else              button.targetScale = 1;
    button.scale += (button.targetScale - button.scale) * 0.12;

    var width  = button.width  * button.scale;
    var height = button.height * button.scale;
    var x      = button.x - (width  - button.width)  / 2;
    var y      = button.y - (height - button.height) / 2;
    var radius = button.radius;

    // Dark purple fill
    ctx.fillStyle = button.hover
        ? "rgba(55,12,110,0.88)"
        : "rgba(28,6,60,0.78)";
    drawRoundedPath(x, y, width, height, radius);
    ctx.fill();

    // Purple border with glow
    ctx.lineWidth   = 2;
    ctx.shadowBlur  = button.hover ? 22 : 8;
    ctx.shadowColor = "rgba(180,90,255,0.85)";
    ctx.strokeStyle = button.hover
        ? "rgba(210,150,255,1)"
        : "rgba(140,65,215,0.85)";
    drawRoundedPath(x, y, width, height, radius);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.font        = "600 32px 'Cinzel'";
    ctx.shadowBlur  = 15;
    ctx.shadowColor = "rgba(200,120,255,0.9)";
    ctx.fillStyle   = button.hover
        ? "rgba(240,210,255,1)"
        : "rgba(200,170,255,0.9)";
    ctx.fillText("START", canvas.width / 2, y + height / 2 + 11);
    ctx.shadowBlur  = 0;
}
