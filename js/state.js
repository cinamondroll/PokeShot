// === SCENE ===
var currentScene = "menu";
var nextScene = "";

// === DEVICE ===
var isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// === GAME STATE ===
var gameState = {
    score:   0,
    lives:   3,
    wave:    1,
    hiScore: 0
};

var showTutorial       = false;
var showHexagonWarning = false;

function resetGameState() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.wave  = 1;
    enemies = [];
    waveState.enemiesPerWave  = 4;
    waveState.spawnInterval   = 120;
    waveState.spawnTimer      = 90;
    waveState.enemiesSpawned  = 0;
    shotState.holding     = false;
    shotState.holdDuration = 0;
    shotState.zoomScale   = 1;
    shotState.timeScale   = 1;
    shotState.missFlash   = 0;
    shotState.hitFlash    = 0;
    aimTouchId            = -1;
    shootTouchId          = -1;
    showHexagonWarning    = false;
    explosionParticles    = [];
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
