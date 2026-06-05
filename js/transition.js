// === TRANSITION ===
var isTransitioning  = false;
var transitionAlpha  = 0;
var transitionSpeed  = 0.03;
var transitionDirection = 1;

function startTransition(sceneName) {
    if (isTransitioning) return;
    if (sceneName == "gameplay") showTutorial = true;
    nextScene        = sceneName;
    isTransitioning  = true;
    transitionDirection = 1;
}

function drawTransition() {
    if (!isTransitioning) return;

    transitionAlpha += transitionSpeed * transitionDirection;

    if (transitionAlpha >= 1) {
        transitionAlpha     = 1;
        currentScene        = nextScene;
        transitionDirection = -1;
    }

    if (transitionAlpha <= 0) {
        transitionAlpha = 0;
        isTransitioning = false;
    }

    ctx.fillStyle = "rgba(0,0,0," + transitionAlpha + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
