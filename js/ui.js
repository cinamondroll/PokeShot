// === AIM ===
var aim = {
    x: canvas.width  / 2,
    y: canvas.height / 2
};

// === BUTTON ===
var button = {
    x: 380, y: 410, width: 200, height: 70, radius: 10,
    hover: false, scale: 1, targetScale: 1
};

var restartButton = {
    x: 310, y: 360, width: 160, height: 60, radius: 10,
    hover: false, scale: 1, targetScale: 1
};

var menuButton = {
    x: 490, y: 360, width: 160, height: 60, radius: 10,
    hover: false, scale: 1, targetScale: 1
};

var shootMobileButton = { cx: 100, cy: 450, r: 55 };

// === LOGO ANIMATION ===
var logoScale      = 1;
var logoScaleSpeed = 0.0008;

// === HELPER: rounded rect path ===
function drawRoundedPath(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x,     y + h, x,     y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x,     y,     x + r, y);
    ctx.closePath();
}

// === DRAW AIM ===
function drawAim() {
    var radius   = 20;
    var crossLen = 30;

    if (shotState.holding) {
        var pulse = (shotState.holdDuration % 30) / 30;
        ctx.lineWidth   = 1;
        ctx.strokeStyle = "rgba(255,200,0," + (1 - pulse) + ")";
        ctx.beginPath();
        ctx.arc(aim.x, aim.y, radius + pulse * 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.lineWidth   = 2;
    ctx.strokeStyle = shotState.holding ? "gold" : "rgba(200,120,255,0.9)";

    ctx.beginPath();
    ctx.arc(aim.x, aim.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(aim.x - crossLen, aim.y);
    ctx.lineTo(aim.x + crossLen, aim.y);
    ctx.moveTo(aim.x, aim.y - crossLen);
    ctx.lineTo(aim.x, aim.y + crossLen);
    ctx.stroke();
}

// === MOBILE SHOOT BUTTON ===
function drawMobileShootButton() {
    var btn       = shootMobileButton;
    var isHolding = shotState.holding;

    if (isHolding) {
        var pulse = (shotState.holdDuration % 30) / 30;
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = "rgba(255,200,0," + (1 - pulse) + ")";
        ctx.beginPath();
        ctx.arc(btn.cx, btn.cy, btn.r + pulse * 18, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.fillStyle = isHolding
        ? "rgba(140,50,255,0.35)"
        : "rgba(55,10,100,0.55)";
    ctx.beginPath();
    ctx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth     = 3;
    ctx.shadowBlur    = isHolding ? 18 : 8;
    ctx.shadowColor   = "rgba(180,90,255,0.8)";
    ctx.strokeStyle   = isHolding
        ? "rgba(210,150,255,1)"
        : "rgba(140,65,215,0.85)";
    ctx.beginPath();
    ctx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.textAlign = "center";
    ctx.font      = "600 17px 'Cinzel'";
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(200,120,255,0.9)";
    ctx.fillStyle   = isHolding
        ? "rgba(240,210,255,1)"
        : "rgba(195,160,245,0.9)";
    ctx.fillText(
        isHolding ? "RELEASE" : "SHOOT",
        btn.cx, btn.cy + 6
    );
    ctx.shadowBlur = 0;
}
