// === INPUT — MOUSE MOVE ===
canvas.addEventListener("mousemove", function (event) {
    var rect   = canvas.getBoundingClientRect();
    var scaleX = canvas.width  / rect.width;
    var scaleY = canvas.height / rect.height;
    var mouseX = (event.clientX - rect.left) * scaleX;
    var mouseY = (event.clientY - rect.top)  * scaleY;

    if (currentScene == "menu") {
        button.hover =
            mouseX > button.x &&
            mouseX < button.x + button.width &&
            mouseY > button.y &&
            mouseY < button.y + button.height;
    }

    if (currentScene == "gameplay" && !isMobile) {
        aim.x = mouseX;
        aim.y = mouseY;
    }

    if (currentScene == "gameOver") {
        restartButton.hover =
            mouseX > restartButton.x &&
            mouseX < restartButton.x + restartButton.width &&
            mouseY > restartButton.y &&
            mouseY < restartButton.y + restartButton.height;

        menuButton.hover =
            mouseX > menuButton.x &&
            mouseX < menuButton.x + menuButton.width &&
            mouseY > menuButton.y &&
            mouseY < menuButton.y + menuButton.height;
    }
});

// === INPUT — MOUSE DOWN / UP ===
canvas.addEventListener("mousedown", function () {
    if (currentScene == "menu" && button.hover) {
        startTransition("gameplay");
    }
    if (currentScene == "gameplay") {
        if (showTutorial) { showTutorial = false; return; }
        startHold();
    }
});

canvas.addEventListener("mouseup", function () {
    if (currentScene == "gameplay") {
        releaseShot();
    }
    if (currentScene == "gameOver") {
        if (restartButton.hover) {
            resetGameState();
            startTransition("gameplay");
        }
        if (menuButton.hover) {
            resetGameState();
            startTransition("menu");
        }
    }
});

// === INPUT — MOBILE TOUCH ===
var aimTouchId   = -1;
var shootTouchId = -1;
var aimLastX     = 0;
var aimLastY     = 0;

canvas.addEventListener("touchstart", function (event) {
    if (!isMobile) return;

    var rect   = canvas.getBoundingClientRect();
    var scaleX = canvas.width  / rect.width;
    var scaleY = canvas.height / rect.height;

    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        var tx = (touch.clientX - rect.left) * scaleX;
        var ty = (touch.clientY - rect.top)  * scaleY;

        if (currentScene == "gameplay") {
            event.preventDefault();

            if (showTutorial) { showTutorial = false; continue; }

            var dx = tx - shootMobileButton.cx;
            var dy = ty - shootMobileButton.cy;
            if (shootTouchId === -1 &&
                Math.sqrt(dx * dx + dy * dy) <= shootMobileButton.r) {
                shootTouchId = touch.identifier;
                startHold();
                continue;
            }

            if (aimTouchId === -1) {
                aimTouchId = touch.identifier;
                aimLastX   = touch.clientX;
                aimLastY   = touch.clientY;
            }
            continue;
        }

        if (currentScene == "menu") {
            if (tx > button.x && tx < button.x + button.width &&
                ty > button.y && ty < button.y + button.height) {
                startTransition("gameplay");
            }
        }

        if (currentScene == "gameOver") {
            if (tx > restartButton.x &&
                tx < restartButton.x + restartButton.width &&
                ty > restartButton.y &&
                ty < restartButton.y + restartButton.height) {
                resetGameState();
                startTransition("gameplay");
            }
            if (tx > menuButton.x &&
                tx < menuButton.x + menuButton.width &&
                ty > menuButton.y &&
                ty < menuButton.y + menuButton.height) {
                resetGameState();
                startTransition("menu");
            }
        }
    }
}, { passive: false });

canvas.addEventListener("touchmove", function (event) {
    if (!isMobile) return;
    if (currentScene != "gameplay") return;

    event.preventDefault();

    var rect   = canvas.getBoundingClientRect();
    var scaleX = canvas.width  / rect.width;
    var scaleY = canvas.height / rect.height;

    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        if (touch.identifier !== aimTouchId) continue;

        aim.x += (touch.clientX - aimLastX) * scaleX;
        aim.y += (touch.clientY - aimLastY) * scaleY;
        aimLastX = touch.clientX;
        aimLastY = touch.clientY;

        aim.x = Math.max(0, Math.min(canvas.width,  aim.x));
        aim.y = Math.max(0, Math.min(canvas.height, aim.y));
    }
}, { passive: false });

canvas.addEventListener("touchend", function (event) {
    if (!isMobile) return;
    if (currentScene != "gameplay") return;

    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        if (touch.identifier === aimTouchId)   aimTouchId = -1;
        if (touch.identifier === shootTouchId) {
            shootTouchId = -1;
            releaseShot();
        }
    }
});

canvas.addEventListener("touchcancel", function (event) {
    if (!isMobile) return;
    if (currentScene != "gameplay") return;

    for (var i = 0; i < event.changedTouches.length; i++) {
        var touch = event.changedTouches[i];
        if (touch.identifier === aimTouchId)   aimTouchId = -1;
        if (touch.identifier === shootTouchId) {
            shootTouchId = -1;
            releaseShot();
        }
    }
});
