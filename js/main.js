// === IMAGE ===
var bg = new Image();
bg.src = "background.jpg";

// === GAME LOOP ===
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentScene == "menu") {
        drawMenu();
    } else if (currentScene == "gameplay") {
        updateGameplay();
        drawGameplay();
    } else if (currentScene == "gameOver") {
        drawGameOver();
    }

    drawTransition();
    requestAnimationFrame(gameLoop);
}

// === BOOT — wait for background image and fonts ===
bg.onload = function () {
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(gameLoop);
    } else {
        gameLoop();
    }
};
