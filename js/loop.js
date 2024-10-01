let c = canvas.getContext("2d");

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const BLOCKSIZE = 10;
const MAPSIZE = 4000;
const MAP_ARRSIZE = MAPSIZE / BLOCKSIZE;
const CAMERASIZE = canvas.width; // assume square
const CAMERA_ARRSIZE_X = Math.ceil(canvas.width / BLOCKSIZE);
const CAMERA_ARRSIZE_Y = Math.ceil(canvas.height / BLOCKSIZE);

let images = {};
let timerTimeoutId;
let upDown;
let downDown;
let leftDown;
let rightDown;
let activeDown;
let mapArr = [];
let paused;
let isRunning;
let isGameClear;
let isGameOver;
let isReady;
let cameraOffset;
let player;
let monsterSet;
let bossSet;
let expOrbSet;
let etcSet;
let lastBossSpawnMin;
let time;
let time_mili;
let timeRemaining;
let maxMonsterCount;
let framesToSpawnMonster;
let heartSpawnDelay;
let framesToSpawnHeart;
let worldLevel;

init();

async function stop() {
    isReady = false;
    await sleep(100);
    clearTimeout(timerTimeoutId);
    timerTimeoutId = null;

    upDown = false;
    downDown = false;
    leftDown = false;
    rightDown = false;
    activeDown = false;
    for (let x = 0; x < MAP_ARRSIZE; x++) {
        let arr = [];
        for (let y = 0; y < MAP_ARRSIZE; y++) {
            if (x === 0 || y === 0 || x === MAP_ARRSIZE - 1 || y === MAP_ARRSIZE - 1)
                arr.push(1);
            else
                arr.push(0);
        }
        mapArr.push(arr);

    }
    paused = false;
    isRunning = false;
    isGameClear = false;
    isGameOver = false;
    cameraOffset = [MAPSIZE / 2 - CAMERASIZE / 2, MAPSIZE / 2 - CAMERASIZE / 2];
    player = new Player(MAPSIZE / 2, MAPSIZE / 2);
    monsterSet = new Set();
    bossSet = new Set();
    expOrbSet = new Set();
    etcSet = new Set();
    lastBossSpawnMin = 0;
    time = 0;
    time_mili = 0;
    timeRemaining = 60;
    maxMonsterCount = Infinity;
    framesToSpawnMonster = EnvironmentVariable[1]["monsterSpawnDelay"];
    heartSpawnDelay = 640;
    framesToSpawnHeart = heartSpawnDelay;
    worldLevel = 1;

    renderAll();
    displayStatus();

    isReady = true;
}

async function start() {
    isRunning = true;
    escDown = false;
    let h = new WeaponSelector();
    h.constructor();
    await h.selectWeapon();
    h.destructor();
    startTimer();
    requestAnimationFrame(loop);
}


const targetFPS = 60;
const speedMultiplier = 2;
const timestep = 1000 / (targetFPS * speedMultiplier); // 16.67ms / speedMultiplier

async function loop() {
    checkWorldLevel();
    checkTimeAttack();
    calculatePlayer();
    calculateCamera();
    calculateMonster();
    calculateBoss();
    calculateExpOrb();
    calculateWeapon();
    calculateEtc();
    await checkPlayerLevel();
    renderAll();
    displayStatus();

    if (isGameClear) {
        gameClear();
        return;
    }
    if (isGameOver) {
        gameOver();
        return;
    }
    if (escDown) return;
    if (paused) {
        renderPlayerStatus();
        await pause();
    }
    await sleep(timestep);
    requestAnimationFrame(loop);
}
