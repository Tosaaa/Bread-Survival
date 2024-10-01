////////// Init //////////
async function init() {
    document.getElementById("note-title").innerHTML = "Bread Survival v1.4.1";
    document.getElementById("note-main").innerHTML = "Move: WASD / Arrow<br>Reset: ESC<br>Select: F / Enter<br>Active: Space / ControlRight<br>Pause: Tab<br><br>";
    document.getElementById("note-main").innerHTML += "\
    [Patch Note]<br>\
    v1.4.1<br>\
    - Player health rescaled<br>\
    - Player health now regens over time<br>\
    v1.4<br>\
    - Weapon damage is no more dealt per <br>frame. Instead, it's dealt once at the start of collision<br>\
    - Weapons, bosses rebalanced<br>\
    - Added new boss patterns<br>\
    - Weapon 'Sword' is now more like a sword<br>\
    - Clear condition changed:<br>\
    <b>You should kill all bosses <br>until 11 minutes to win the game</b><br>\
    - Many bug fixed<br>\
    <br>\
    v1.3<br>\
    - Sword can now attack all direction<br>\
    - <b>When using Arrow keys to move, you must use ContrlRight to use active.</b> \
    For some reason keyboard cannot recognize ArrowRight/Left, ArrowDown, Space at the same time.<br>\
    - Convenience Patch<br>\
    - Added new weapon 'Boomerang'<br>\
    - Nerfed Laser<br>\
    - Removed max monster capacity<br>\
    - New boss 'Sniper'<br>\
    <br>\
    v1.2<br>\
    - Heart now spawns at random place<br>\
    - Difficulty now scaled by internal world level<br>\
    - Added active skill<br>\
    - Added new weapon 'Sword'<br>\
    - Weapon damage balanced<br>\
    - Added pause button (Tab)<br>\
    - Added player status while pausing <br>\
    - Added weapon/upgrade tooltips <br>\
    <br>\
    v1.1<br>\
    - Code refactored<br>\
    - Player HP increased to 5";

    loadImages();
    await sleep(300);
    stop();
}

function loadImages() {
    let img = new Image();

    let path = img.baseURI.replace("index.html", "assets/");
    let background = new Image();
    let player_left = new Image();
    let player_right = new Image();
    let player_left_opaque = new Image();
    let player_right_opaque = new Image();
    let pattern1 = new Image();
    let boss_betrayer_left = new Image();
    let boss_betrayer_right = new Image();

    background.src = path + "background.png";
    player_left.src = path + "player_left.png";
    player_right.src = path + "player_right.png";
    player_left_opaque.src = path + "player_left_opaque.png";
    player_right_opaque.src = path + "player_right_opaque.png";
    pattern1.src = path + "pattern1.png";
    boss_betrayer_left.src = path + "boss_betrayer_left.png";
    boss_betrayer_right.src = path + "boss_betrayer_right.png";

    images.background = background;
    images.player_left = player_left;
    images.player_right = player_right;
    images.player_left_opaque = player_left_opaque;
    images.player_right_opaque = player_right_opaque;
    images.pattern1 = pattern1;
    images.boss_betrayer_left = boss_betrayer_left;
    images.boss_betrayer_right = boss_betrayer_right;
}
////////// Init //////////
////////// Game Endings //////////

function gameClear() {
    alert("Game Clear!");
    return;
}
function gameOver() {
    alert("Game Over");
    return;
}
////////// Game Endings //////////
////////// Loop Functions //////////
function startTimer() {
    if (!isRunning)
        return;
    timerTimeoutId = setTimeout(() => {
        time_mili += 100;
        startTimer();
    }
        , 100);
    time = Math.floor(time_mili / 1000);
}
function stopTimer() {
    if (!isRunning)
        return;
    clearTimeout(timerTimeoutId);
    timerTimeoutId = null;
}
function calculatePlayer() {
    getPlayerSpeed();
    movePlayer();
    checkPlayerBounds();
    player.checkPlayer_EntityCollision();
    checkPlayerInvincible();
    regenPlayerHealth();
    function getPlayerSpeed() {
        let v = [0, 0];
        // dx,dy
        const keySet = [upDown, downDown, leftDown, rightDown];

        if (keySet[0]) {
            v[1] += -1;
        }
        if (keySet[1]) {
            v[1] += 1;
        }
        if (keySet[2]) {
            v[0] += -1;
        }
        if (keySet[3]) {
            v[0] += 1;
        }

        if (v[0] * v[1] != 0) {
            v[0] /= Math.sqrt(2);
            v[1] /= Math.sqrt(2);
        }
        player.xVel = v[0] * player.currentSpeed;
        player.yVel = v[1] * player.currentSpeed;

        if (player.xVel < 0) {
            player.facingDirection = "left";
        } else if (player.xVel > 0) {
            player.facingDirection = "right";
        }
    }

    function movePlayer() {
        player.x += player.xVel;
        player.y += player.yVel;
    }

    function checkPlayerBounds() {
        if (player.x + player.size > MAPSIZE) {
            player.x = MAPSIZE - player.size;
            player.xVel *= -0.5;
        }
        if (player.x - player.size < 0) {
            player.x = 0 + player.size;
            player.xVel *= -0.5;
        }
        if (player.y + player.size > MAPSIZE) {
            player.y = MAPSIZE - player.size;
            player.yVel *= -0.5;
        }
        if (player.y + player.size > MAPSIZE) {
            player.y = MAPSIZE - player.size;
            player.yVel *= -0.5;
        }
        if (player.y - player.size < 0) {
            player.y = 0 + player.size;
            player.yVel *= -0.5;
        }
    }
    function checkPlayerInvincible() {
        if (!player.isInvincible)
            return;

        if (player.framesInvincible <= 0) {
            player.isInvincible = false;
            player.framesInvincible = 0;
            player.isOpaque = false;
        } else {
            player.isOpaque = Boolean(Math.ceil(player.framesInvincible / 8) % 2);
            player.framesInvincible--;
        }
    }
    function regenPlayerHealth() {
        if (player.currentFramesToRegenHealth > 0) {
            player.currentFramesToRegenHealth--;
        }
        if (player.currentFramesToRegenHealth === 0) {
            player.health = Math.min(player.health + player.healthRegenAmount, player.maxHealth);
        }
    }
}
function calculateCamera() {
    moveCamera();
    function moveCamera() {
        let [rx, ry] = getRelativeXY(player.x, player.y);
        let pivot = [CAMERASIZE / 2, CAMERASIZE / 2];
        let force = [(rx - pivot[0]) * 0.05, (ry - pivot[1]) * 0.05];
        [0, 1].forEach(i => {
            cameraOffset[i] += force[i];
            if (cameraOffset[i] < 0)
                cameraOffset[i] = 0;
            if (cameraOffset[i] > MAPSIZE - CAMERASIZE)
                cameraOffset[i] = MAPSIZE - CAMERASIZE;
        }
        );
    }
}
function calculateMonster() {
    spawnMonster();
    moveMonster();

    function spawnMonster() {
        if (monsterSet.size >= maxMonsterCount)
            return;
        if (framesToSpawnMonster > 0) {
            framesToSpawnMonster--;
            return;
        }
        framesToSpawnMonster = EnvironmentVariable[worldLevel]["monsterSpawnDelay"];
        let side = Math.floor(Math.random() * 4);
        let range = Math.floor(Math.random() * CAMERASIZE);
        ; let spawnPoint = [0, 0];
        let monster = new Monster(0, 0);
        switch (side) {
            case 0:
                // up
                spawnPoint = [cameraOffset[0] + range, cameraOffset[1] - monster.size];
                break;
            case 1:
                // right
                spawnPoint = [cameraOffset[0] + CAMERASIZE + monster.size, cameraOffset[1] + range];
                break;
            case 2:
                // down
                spawnPoint = [cameraOffset[0] + range, cameraOffset[1] + CAMERASIZE + monster.size];
                break;
            case 3:
                // left
                spawnPoint = [cameraOffset[0] - monster.size, cameraOffset[1] + range];
                break;
            default:
                alert("spawnMonster Error");
        }
        monster.x = spawnPoint[0];
        monster.y = spawnPoint[1];
        monsterSet.add(monster);
    }

    function moveMonster() {
        monsterSet.forEach(monster => {
            let d = getDistance(player.x, player.y, monster.x, monster.y);
            monster.xVel = (player.x - monster.x) / d * monster.currentSpeed;
            monster.yVel = (player.y - monster.y) / d * monster.currentSpeed;
            monster.x += monster.xVel;
            monster.y += monster.yVel;
        }
        );
    }
}

function calculateBoss() {
    spawnBoss();
    moveBoss();

    bossSet.forEach(boss => {
        switch (boss.name) {
            case "Giant Ball":
                let giant = boss;
                giant.health += giant.healthRegenAmount;
                if (giant.health > giant.maxHealth)
                    giant.health = giant.maxHealth;
                giant.size = Math.max(15, giant.health * 0.2);
                break;
            case "Biohazard":
                let bio = boss;
                if (bio.framesToTrail > 0) {
                    bio.framesToTrail--;
                } else {
                    let d = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
                    for (let i = 0; i < 4; i++) {
                        let trail = new Trap(bio.x, bio.y, "Trail");
                        trail.xVel = d[i][0] * trail.currentSpeed;
                        trail.yVel = d[i][1] * trail.currentSpeed;
                        etcSet.add(trail);
                    }
                    bio.framesToTrail = bio.trailDelay;
                }
                break;

            case "Sniper":
                let sniper = boss;
                if (sniper.framesToFire > 0) {
                    sniper.framesToFire--;
                } else {
                    etcSet.add(new Trap(sniper.x, sniper.y, "Bullet"));
                    sniper.framesToFire = sniper.fireDelay;
                }
        }
    }
    );

    function spawnBoss() {
        let min = Math.floor(time / 60);
        if (time % 60 === 0 && min > lastBossSpawnMin && timeRemaining > 0) {
            let side = Math.floor(Math.random() * 4);
            let range = Math.floor(Math.random() * CAMERASIZE);
            let spawnPoint = [0, 0];
            let boss = new Boss(0, 0);
            switch (side) {
                case 0:
                    // up
                    spawnPoint = [cameraOffset[0] + range, cameraOffset[1] - boss.size];
                    break;
                case 1:
                    // right
                    spawnPoint = [cameraOffset[0] + CAMERASIZE + boss.size, cameraOffset[1] + range];
                    break;
                case 2:
                    // down
                    spawnPoint = [cameraOffset[0] + range, cameraOffset[1] + CAMERASIZE + boss.size];
                    break;
                case 3:
                    // left
                    spawnPoint = [cameraOffset[0] - boss.size, cameraOffset[1] + range];
                    break;
                default:
                    alert("spawnBoss Error");
            }
            boss.x = spawnPoint[0];
            boss.y = spawnPoint[1];
            bossSet.add(boss);
            lastBossSpawnMin = min;
        }
    }

    function moveBoss() {
        bossSet.forEach(boss => {
            let d = getDistance(player.x, player.y, boss.x, boss.y);
            boss.xVel = (player.x - boss.x) / d * boss.currentSpeed;
            boss.yVel = (player.y - boss.y) / d * boss.currentSpeed;
            switch (boss.name) {
                case "Drunken Ball":
                    let dx = Math.cos(time) * 150;
                    let dy = Math.sin(time) * 150;
                    d = getDistance(player.x + dx, player.y + dy, boss.x, boss.y);
                    boss.xVel = (player.x + dx - boss.x) / d * boss.currentSpeed;
                    boss.yVel = (player.y + dy - boss.y) / d * boss.currentSpeed;
                    break;
            }
            boss.x += boss.xVel;
            boss.y += boss.yVel;
            if (boss.xVel < 0) {
                boss.facingDirection = "left";
            } else if (player.xVel > 0) {
                boss.facingDirection = "right";
            }
        }
        );
    }
}

function calculateExpOrb() {
    moveExpOrb();

    function moveExpOrb() {
        expOrbSet.forEach(expOrb => {
            let d = getDistance(player.x, player.y, expOrb.x, expOrb.y);
            if (d < player.expOrbMagneticRange) {
                expOrb.xVel = (player.x - expOrb.x) / d * expOrb.currentSpeed;
                expOrb.yVel = (player.y - expOrb.y) / d * expOrb.currentSpeed;
                expOrb.x += expOrb.xVel;
                expOrb.y += expOrb.yVel;
            }
        }
        );
    }
}

function calculateWeapon() {
    if (player.weapon instanceof Orbit) {
        let orbit = player.weapon;
        orbit.moveSatelites();
        orbit.checkActive();
        orbit.checkWeapon_AllEntityCollision();
    }
    if (player.weapon instanceof Laser) {
        let laser = player.weapon;
        laser.checkActive();
        if (activeDown) {
            clearEntityOnHit();
            laser.currentFramesToShoot = laser.framesToShoot;
            laser.currentFrameDuration = 0;
        } else {
            if (laser.currentFramesToShoot > 0) {
                laser.currentFramesToShoot--;
                if (laser.currentFramesToShoot === 0) {
                    laser.calculateDirection();
                    laser.currentFrameDuration = laser.frameDuration
                }
                clearEntityOnHit();
            } else if (laser.currentFrameDuration > 0) {
                laser.checkWeapon_AllEntityCollision();
                laser.currentFrameDuration--;
            } else {
                laser.currentFramesToShoot = laser.framesToShoot;
                clearEntityOnHit();
            }
        }
    }
    if (player.weapon instanceof Sword) {
        let sword = player.weapon;
        sword.checkActive();
        if (sword.swinging) {
            sword.checkWeapon_AllEntityCollision();
            sword.swingSword();
        } else {
            clearEntityOnHit();
        }
    }

    if (player.weapon instanceof Boomerang) {
        let boomerang = player.weapon;
        boomerang.checkActive();
        if (!boomerang.hasBoomerang) {
            boomerang.checkWeapon_AllEntityCollision();
            boomerang.moveBoomerang();
        } else {
            clearEntityOnHit();
        }
    }
}

function calculateEtc() {
    spawnHeart();
    etcSet.forEach(etc => {
        if (etc instanceof Trap) {
            if (etc.name === "Trail") {
                if (etc.framesToDisappear > 0) {
                    etc.framesToDisappear--;
                    etc.x += etc.xVel;
                    etc.y += etc.yVel;
                    if (etc.xVel > 0) {
                        etc.xVel = Math.max(0, etc.xVel - etc.decel);
                    } else if (etc.xVel < 0) {
                        etc.xVel = Math.min(0, etc.xVel + etc.decel);
                    }
                    if (etc.yVel > 0) {
                        etc.yVel = Math.max(0, etc.yVel - etc.decel);
                    } else if (etc.yVel < 0) {
                        etc.yVel = Math.min(0, etc.yVel + etc.decel);
                    }
                } else {
                    etcSet.delete(etc);
                }
            }
            if (etc.name === "Bullet") {
                etc.x += etc.xVel;
                etc.y += etc.yVel;
                if (etc.x < 0 || etc.y < 0 || etc.x > MAPSIZE || etc.y > MAPSIZE) {
                    etcSet.delete(etc);
                }
            }
        }
        if (etc instanceof Heart) {
            if (etc.framesToDisappear > 0) {
                etc.framesToDisappear--;
            } else {
                etcSet.delete(etc);
            }
        }
    });

    function spawnHeart() {
        if (framesToSpawnHeart > 0) {
            framesToSpawnHeart--;
            return;
        }
        framesToSpawnHeart = heartSpawnDelay;
        let heartSpawnCount = 1;
        for (let i = 0; i < heartSpawnCount; i++) {
            let x = (Math.random() * 0.8 + 0.1) * MAPSIZE;
            let y = (Math.random() * 0.8 + 0.1) * MAPSIZE;
            etcSet.add(new Heart(x, y));
        }
    }
}
function checkWorldLevel() {
    worldLevel = Math.min(Math.floor(time / 60) + 1, 10);
}

function checkTimeAttack() {
    if (time_mili >= 600100) {
        timeRemaining = 660000 - time_mili;
        if (timeRemaining <= 0) {
            isGameOver = true;
        }
        if (bossSet.size === 0) {
            isGameClear = true;
        }
    }
}

function displayStatus() {
    // document.getElementById("player-health").innerHTML = "? ".repeat(player.health);
    // document.getElementById("player-health-lost").innerHTML = "? ".repeat(player.maxHealth - player.health);
    let t = parseTime();
    document.getElementById("time").innerHTML = `${t[0]}:${t[1]}`;

}
function clearEntityOnHit() {
    doClear(monsterSet);
    doClear(bossSet);
    function doClear(entitySet) {
        entitySet.forEach(entity => {
            entity.onHit = false;
        }
        );
    }
}

function parseTime() {
    let min = Math.floor(time / 60);
    if (String(min).length === 1)
        min = "0" + min;
    let sec = time % 60;
    if (String(sec).length === 1)
        sec = "0" + sec;
    return [min, sec];
}

async function checkPlayerLevel() {
    let remainingExp = getRemainingExp();
    if (remainingExp <= 0) {
        player.level++;
        player.currentExp = -remainingExp;
        await levelUp();
    }
}

async function levelUp() {
    // console.log(*`Level Up!: ${player.level}`);
    stopTimer();
    let h = new LevelUpHandler();
    h.constructor();
    await h.selectUpgrade();
    h.destructor();
    startTimer();
}

async function pause() {
    stopTimer();
    while (1) {
        await sleep(50);
        if (!paused) {
            startTimer();
            return;
        }
    }
}

function getRemainingExp() {
    let requiredExp = player.level * 100;
    // depends on leveling model
    let currentExp = player.currentExp;
    return requiredExp - currentExp;
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getRelativeXY(x, y) {
    return [x - cameraOffset[0], y - cameraOffset[1]];
}

function getCameraCoordinates() {
    return [Math.floor(cameraOffset[0] / BLOCKSIZE), Math.floor(cameraOffset[1] / BLOCKSIZE)];
}

////////// Loop Functions //////////
////////// Util Functions //////////

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), time);
    }
    );

}

function roundTo(num, point) {
    let v = Math.pow(10, point);
    return Math.round(num * v) / v;
}
