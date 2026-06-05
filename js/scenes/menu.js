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
    // LOGO ANIMATION
    // ======================
    logoScale += logoScaleSpeed;
    if (logoScale >= 1.03 || logoScale <= 0.97) logoScaleSpeed *= -1;

    var logoWidth  = 200 * logoScale;
    var logoHeight = 200 * logoScale;
    var logoX      = 480 - logoWidth  / 2;
    var logoY      = 210 - logoHeight / 2;

    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

    // ======================
    // SUBTITLE
    // ======================
    ctx.font        = "400 27px 'Cinzel'";
    ctx.shadowBlur  = 14;
    ctx.shadowColor = "rgba(140,60,220,0.65)";
    ctx.fillStyle   = "rgba(180,145,240,0.9)";
    ctx.fillText("Example Game", canvas.width / 2, 356);
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
