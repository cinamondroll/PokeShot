// === COLLISION ===
function rectsOverlap(a, b) {
    var acx = a.x + a.width  / 2;
    var acy = a.y + a.height / 2;
    var bcx = b.x + b.width  / 2;
    var bcy = b.y + b.height / 2;
    return Math.abs(acx - bcx) < (a.width  / 2 + b.width  / 2) &&
           Math.abs(acy - bcy) < (a.height / 2 + b.height / 2);
}
