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
var logoTime    = 0;   // increments each drawLogo call
var aimRotation = 0;   // increments each drawAim call

// === DRAW LOGO (canvas-drawn scope) ===
function drawLogo(cx, cy) {
    logoTime++;
    var t = logoTime;

    // === CORNER TRIANGLES (rotate + pulse) ===
    var dist   = 66;
    var sides  = [[-1,-1],[1,-1],[-1,1],[1,1]];
    var tSize  = 11 + Math.sin(t * 0.038) * 5;   // pulse 6–16px

    for (var i = 0; i < sides.length; i++) {
        var tx  = cx + sides[i][0] * dist;
        var ty  = cy + sides[i][1] * dist;
        var dir = (i % 2 === 0) ? 1 : -1;
        var rot = t * 0.013 * dir;

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(rot);

        ctx.shadowBlur  = 8;
        ctx.shadowColor = "rgba(30,90,180,0.55)";
        ctx.fillStyle   = "rgba(12,18,40,0.92)";
        ctx.beginPath();
        ctx.moveTo(0, -tSize);
        ctx.lineTo( tSize * 0.866,  tSize * 0.5);
        ctx.lineTo(-tSize * 0.866,  tSize * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.restore();
    }

    // === OUTER RING + TICKS (rotates slowly) ===
    var outerR = 52;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.010);

    ctx.lineWidth   = 2;
    ctx.strokeStyle = "rgba(12,18,40,0.80)";
    ctx.beginPath();
    ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    ctx.stroke();

    // Cardinal ticks
    ctx.lineWidth   = 2.5;
    ctx.strokeStyle = "rgba(12,18,40,0.90)";
    for (var j = 0; j < 4; j++) {
        var ang = j * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * outerR,        Math.sin(ang) * outerR);
        ctx.lineTo(Math.cos(ang) * (outerR - 13), Math.sin(ang) * (outerR - 13));
        ctx.stroke();
    }
    // Diagonal minor ticks
    ctx.lineWidth   = 1.2;
    ctx.strokeStyle = "rgba(12,18,40,0.45)";
    for (var j = 0; j < 4; j++) {
        var ang = j * Math.PI / 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * outerR,       Math.sin(ang) * outerR);
        ctx.lineTo(Math.cos(ang) * (outerR - 7), Math.sin(ang) * (outerR - 7));
        ctx.stroke();
    }
    ctx.restore();

    // === ROTATING ARCS (counter-direction) ===
    var arcR = 35;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-t * 0.020);

    ctx.lineWidth   = 3.5;
    ctx.strokeStyle = "rgba(12,18,40,0.88)";
    ctx.beginPath();
    ctx.arc(0, 0, arcR, 0.30, 1.20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, arcR, Math.PI + 0.30, Math.PI + 1.20);
    ctx.stroke();
    ctx.restore();

    // === STATIC CROSSHAIR ===
    ctx.save();
    ctx.translate(cx, cy);

    var crossLen = 28;
    var gap      = 12;

    ctx.strokeStyle = "rgba(12,18,40,0.92)";
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.moveTo(-crossLen, 0); ctx.lineTo(-gap, 0);
    ctx.moveTo( gap, 0);      ctx.lineTo( crossLen, 0);
    ctx.moveTo(0, -crossLen); ctx.lineTo(0, -gap);
    ctx.moveTo(0,  gap);      ctx.lineTo(0,  crossLen);
    ctx.stroke();

    // Inner ring
    ctx.lineWidth   = 1.5;
    ctx.strokeStyle = "rgba(12,18,40,0.65)";
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(12,18,40,0.95)";
    ctx.fill();

    ctx.restore();
}

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

// === DRAW HEART (for lives HUD) ===
// Heart centered at (cx, cy), size parameter s ≈ half-height
// Path defined in local coords [-10,10] scaled by s/10
function drawHeart(cx, cy, s) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s / 10, s / 10);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(0, -10, -10, -10, -10, -3);
    ctx.bezierCurveTo(-10, 4, 0, 9, 0, 13);
    ctx.bezierCurveTo(0, 9, 10, 4, 10, -3);
    ctx.bezierCurveTo(10, -10, 0, -10, 0, -3);
    ctx.closePath();
    ctx.restore();
}

// === DRAW AIM ===
function drawAim() {
    aimRotation += 0.018;
    var radius   = 20;
    var crossLen = 30;
    var color    = shotState.holding ? "gold" : "rgba(200,120,255,0.9)";
    var colorHalf = shotState.holding ? "rgba(255,200,0,0.45)" : "rgba(200,120,255,0.40)";

    // Rotating outer tick marks
    ctx.save();
    ctx.translate(aim.x, aim.y);
    ctx.rotate(aimRotation);
    ctx.lineWidth   = 1.5;
    ctx.strokeStyle = colorHalf;
    for (var i = 0; i < 4; i++) {
        var ang = i * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * (radius + 5),  Math.sin(ang) * (radius + 5));
        ctx.lineTo(Math.cos(ang) * (radius + 13), Math.sin(ang) * (radius + 13));
        ctx.stroke();
    }
    ctx.restore();

    if (shotState.holding) {
        var pulse = (shotState.holdDuration % 30) / 30;
        ctx.lineWidth   = 1;
        ctx.strokeStyle = "rgba(255,200,0," + (1 - pulse) + ")";
        ctx.beginPath();
        ctx.arc(aim.x, aim.y, radius + pulse * 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.lineWidth   = 2;
    ctx.strokeStyle = color;

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
