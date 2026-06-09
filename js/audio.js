// === AUDIO ===
var bgMusic       = new Audio("backsound.mp3");
bgMusic.loop      = true;
bgMusic.volume    = 0.45;

var shootSfx      = new Audio("shoot.mp3");
shootSfx.volume   = 0.70;

var audioUnlocked = false;

// Called on first user interaction to satisfy browser autoplay policy
function startAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    bgMusic.play().catch(function () {});
}

// Play shoot SFX — reset to start so rapid shots don't queue up
function playShoot() {
    shootSfx.currentTime = 0;
    shootSfx.play().catch(function () {});
}
