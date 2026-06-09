// === WAVE SYSTEM ===
var waveState = {
    enemiesPerWave: 4,
    spawnInterval:  120,
    spawnTimer:     90,
    enemiesSpawned: 0
};

function updateWave() {
    if (waveState.enemiesSpawned < waveState.enemiesPerWave) {
        waveState.spawnTimer--;
        if (waveState.spawnTimer <= 0) {
            spawnEnemy();
            waveState.enemiesSpawned++;
            waveState.spawnTimer = waveState.spawnInterval;
        }
    } else if (enemies.length === 0) {
        startNextWave();
    }
}

function startNextWave() {
    gameState.wave++;
    waveState.enemiesPerWave = Math.min(4 + gameState.wave, 12);
    waveState.spawnInterval  = Math.max(50, 120 - gameState.wave * 5);
    waveState.spawnTimer     = 90;
    waveState.enemiesSpawned = 0;

    // Show hexagon warning once when wave 4 begins
    if (gameState.wave === 4) {
        showHexagonWarning = true;
    }
}
