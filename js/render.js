function renderAll() {
    renderClear();
    // renderBackgroundImage();
    renderBackground();
    renderMapBorder();
    // renderRing();
    renderWeapon();
    renderMonster();
    renderBoss();
    renderPlayer();
    renderExpOrb();
    renderEtc();
    renderPlayerHealth();
    renderPlayerLevel();
    if (time >= 600) {
        renderRemainingTime();
    }
}

function renderPlayer() {
    c.save();
    let img;
    if (player.isOpaque) {
        if (player.facingDirection === "right")
            img = images.player_right_opaque;
        else if (player.facingDirection === "left")
            img = images.player_left_opaque;
    } else {
        if (player.facingDirection === "right")
            img = images.player_right;
        else if (player.facingDirection === "left")
            img = images.player_left;
    }
    c.beginPath();
    c.drawImage(img, player.x - cameraOffset[0] - player.size, player.y - cameraOffset[1] - player.size, 2 * player.size, 2 * player.size);
    c.closePath();
    c.restore();
}

function renderMonster() {
    c.save();
    monsterSet.forEach(monster => {
        c.fillStyle = monster.color;
        c.beginPath();
        c.arc(monster.x - cameraOffset[0], monster.y - cameraOffset[1], monster.size, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    });
    c.restore();
}

function renderBoss() {
    c.save();
    bossSet.forEach(boss => {
        switch (boss.name) {
            case "Giant Ball":
                c.beginPath();
                c.fillStyle = "black";
                c.strokeStyle = "white";
                c.lineWidth = 3;
                c.arc(boss.x - cameraOffset[0], boss.y - cameraOffset[1], boss.size, 0, Math.PI * 2);
                c.fill();
                c.stroke();
                c.closePath();
                break;
            case "Drunken Ball":
                c.beginPath();
                c.fillStyle = "red";
                c.arc(boss.x - cameraOffset[0], boss.y - cameraOffset[1], boss.size, 0, Math.PI * 2);
                c.fill();
                c.closePath();
                break;
            case "Betrayer":
                let img;
                if (boss.facingDirection === "right")
                    img = images.boss_betrayer_right;
                else if (boss.facingDirection === "left")
                    img = images.boss_betrayer_left;
                c.beginPath();
                c.drawImage(img, boss.x - cameraOffset[0] - boss.size, boss.y - cameraOffset[1] - boss.size, 2 * boss.size, 2 * boss.size);
                c.closePath();
                break;
            case "Biohazard":
                c.beginPath();
                c.fillStyle = "green";
                c.arc(boss.x - cameraOffset[0], boss.y - cameraOffset[1], boss.size, 0, Math.PI * 2);
                c.fill();
                c.closePath();
                break;
            case "Sniper":
                c.beginPath();
                c.fillStyle = "white";
                c.arc(boss.x - cameraOffset[0], boss.y - cameraOffset[1], boss.size, 0, Math.PI * 2);
                c.fill();
                c.closePath();
        }
        c.fillStyle = "black";
        c.fillRect(boss.x - cameraOffset[0] - boss.size, boss.y - cameraOffset[1] + boss.size + 5, 2 * boss.size, 4);
        c.fillStyle = "red";
        let len = (boss.health / boss.maxHealth) * 2 * boss.size;
        c.fillRect(boss.x - cameraOffset[0] - boss.size, boss.y - cameraOffset[1] + boss.size + 5, len, 4);
    });
    c.restore();
}

function renderExpOrb() {
    c.save();
    c.fillStyle = "rgb(153, 217, 255)";
    c.strokeStyle = "blue"
    c.lineWidth = 1;
    expOrbSet.forEach(expOrb => {
        c.beginPath();
        c.arc(expOrb.x - cameraOffset[0], expOrb.y - cameraOffset[1], expOrb.size, 0, Math.PI * 2);
        c.fill();
        c.stroke();
        c.closePath();
    });
    c.restore();
}

function renderWeapon() {
    c.save();
    if (player.weapon instanceof Orbit) {
        c.fillStyle = "orange";
        c.strokeStyle = "red";
        c.lineWidth = 2;
        let orbit = player.weapon;
        orbit.sateliteSet.forEach(satelite => {
            c.beginPath();
            c.arc(satelite.x - cameraOffset[0], satelite.y - cameraOffset[1], orbit.size, 0, Math.PI * 2);
            c.fill();
            c.stroke();
            c.closePath();
        });
    }
    if (player.weapon instanceof Laser) {
        let laser = player.weapon;
        if (activeDown) {
            c.fillStyle = `rgba(255, 255, 0, ${(laser.activeCharge / laser.fullCharge)})`;
            c.strokeStyle = "yellow";
            c.beginPath();
            c.arc(player.x - cameraOffset[0], player.y - cameraOffset[1], (laser.activeCharge / laser.fullCharge) * laser.activeRange, 0, Math.PI * 2);
            c.fill();
            c.stroke();
            c.closePath();
        }
        if (laser.currentFrameDuration) {
            c.strokeStyle = "rgba(255, 255, 0, 0.7)";
            c.lineWidth = laser.width;
            c.beginPath();
            c.moveTo(player.x - cameraOffset[0], player.y - cameraOffset[1]);
            c.lineTo(laser.x - cameraOffset[0], laser.y - cameraOffset[1]);
            c.stroke();
            c.closePath();
        }
    }
    if (player.weapon instanceof Sword) {
        let sword = player.weapon;
        if (sword.swinging) {
            c.strokeStyle = "rgba(153, 217, 234, 1)";
            c.lineWidth = sword.width;
            c.beginPath();
            c.moveTo(player.x - cameraOffset[0], player.y - cameraOffset[1]);
            c.lineTo(sword.x - (sword.x - player.x) * (sword.width / (2 * sword.length)) - cameraOffset[0], sword.y - (sword.y - player.y) * (sword.width / (2 * sword.length)) - cameraOffset[1]);
            c.stroke();
            c.closePath();

            c.fillStyle = "rgba(153, 217, 234, 1)"
            c.lineWidth = 0.1;
            c.beginPath();
            c.moveTo(sword.x - cameraOffset[0], sword.y - cameraOffset[1]);
            c.lineTo(sword.x - (sword.width / Math.sqrt(2)) * Math.cos(Math.PI / 4 + sword.theta) - cameraOffset[0], sword.y - (sword.width / Math.sqrt(2)) * Math.sin(Math.PI / 4 + sword.theta) - cameraOffset[1]);
            c.lineTo(sword.x - (sword.width / Math.sqrt(2)) * Math.cos(Math.PI / 4 - sword.theta) - cameraOffset[0], sword.y + (sword.width / Math.sqrt(2)) * Math.sin(Math.PI / 4 - sword.theta) - cameraOffset[1]);
            c.lineTo(sword.x - cameraOffset[0], sword.y - cameraOffset[1]);
            c.fill();
            c.stroke();
            c.closePath();

            c.strokeStyle = "rgba(209, 238, 245, 1)";
            c.lineWidth = sword.width / 2;
            c.beginPath();
            c.moveTo(player.x + (sword.width / 4) * Math.sin(sword.theta) - cameraOffset[0], player.y - (sword.width / 4) * Math.cos(sword.theta) - cameraOffset[1]);
            c.lineTo(player.x + (sword.width / 4) * Math.sin(sword.theta) + (sword.length - sword.width / 2) * Math.cos(sword.theta) - cameraOffset[0], player.y - (sword.width / 4) * Math.cos(sword.theta) + (sword.length - sword.width / 2) * Math.sin(sword.theta) - cameraOffset[1]);
            c.stroke();
            c.closePath();

            c.fillStyle = "rgba(209, 238, 245, 1)";
            c.beginPath();
            c.moveTo(sword.x - cameraOffset[0], sword.y - cameraOffset[1]);
            c.lineTo(sword.x - (sword.width / Math.sqrt(2)) * Math.cos(Math.PI / 4 + sword.theta) - cameraOffset[0], sword.y - (sword.width / Math.sqrt(2)) * Math.sin(Math.PI / 4 + sword.theta) - cameraOffset[1]);
            c.lineTo(player.x + (sword.length - sword.width / 2) * Math.cos(sword.theta) - cameraOffset[0], player.y + (sword.length - sword.width / 2) * Math.sin(sword.theta) - cameraOffset[1]);
            c.lineTo(sword.x - cameraOffset[0], sword.y - cameraOffset[1]);
            c.fill();
            c.closePath();

            c.strokeStyle = "blue";
            c.lineWidth = 0.3;
            c.beginPath();
            c.moveTo(player.x + 20 * Math.cos(sword.theta) - cameraOffset[0], player.y + 20 * Math.sin(sword.theta) - cameraOffset[1]);
            c.lineTo(sword.x - cameraOffset[0], sword.y - cameraOffset[1]);
            c.stroke();
            c.closePath();

            c.strokeStyle = "rgba(0, 162, 232, 1)";
            c.lineWidth = 6;
            c.beginPath();
            c.moveTo(player.x + sword.width * Math.sin(sword.theta) + 20 * Math.cos(sword.theta) - cameraOffset[0], player.y - sword.width * Math.cos(sword.theta) + 20 * Math.sin(sword.theta) - cameraOffset[1]);
            c.lineTo(player.x - sword.width * Math.sin(sword.theta) + 20 * Math.cos(sword.theta) - cameraOffset[0], player.y + sword.width * Math.cos(sword.theta) + 20 * Math.sin(sword.theta) - cameraOffset[1]);
            c.stroke();
            c.closePath();
        }
    }
    if (player.weapon instanceof Boomerang) {
        let boomerang = player.weapon;
        if (!boomerang.hasBoomerang) {
            c.fillStyle = "beige";
            c.beginPath();
            c.arc(boomerang.x - cameraOffset[0], boomerang.y - cameraOffset[1], boomerang.size, 0, Math.PI * 2);
            c.fill();
            c.closePath();
        }
    }
    c.restore();
}

function renderEtc() {
    c.save();
    etcSet.forEach(etc => {
        if (etc instanceof Trap) {
            switch (etc.name) {
                case "Trail":
                    c.beginPath();
                    c.fillStyle = etc.color;
                    c.arc(etc.x - cameraOffset[0], etc.y - cameraOffset[1], etc.size, 0, Math.PI * 2);
                    c.fill();
                    c.closePath();
                    break;
                case "Bullet":
                    c.beginPath();
                    c.fillStyle = etc.color;
                    c.arc(etc.x - cameraOffset[0], etc.y - cameraOffset[1], etc.size, 0, Math.PI * 2);
                    c.fill();
                    c.closePath();
                    break;
            }
        }
        if (etc instanceof Heart) {
            c.beginPath();
            c.fillStyle = "red"
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "40px Consolas"
            c.fillText("❤", etc.x - cameraOffset[0], etc.y - cameraOffset[1])
            c.closePath();
        }
    });
    c.restore();
}

function renderBackgroundImage() {
    c.save();
    let xRatio = images.background.naturalWidth / MAPSIZE;
    let yRatio = images.background.naturalHeight / MAPSIZE;
    c.drawImage(images.background, xRatio * cameraOffset[0], yRatio * cameraOffset[1], xRatio * CAMERASIZE, yRatio * CAMERASIZE, 0, 0, CAMERASIZE, CAMERASIZE);
    c.restore();
}

function renderBackground() {
    c.save();
    for (let x = Math.floor(cameraOffset[0]) - 5 * BLOCKSIZE; x < Math.floor(cameraOffset[0]) + CAMERASIZE + 5 * BLOCKSIZE; x++) {
        for (let y = Math.floor(cameraOffset[1]) - 5 * BLOCKSIZE; y < Math.floor(cameraOffset[1]) + CAMERASIZE + 5 * BLOCKSIZE; y++) {
            if (x % 50 === 0 && y % 50 === 0) {
                c.beginPath();
                c.drawImage(images.pattern1, x - cameraOffset[0], y - cameraOffset[1], 5 * BLOCKSIZE, 5 * BLOCKSIZE);
                c.closePath();
            }
        }
    }
    c.restore();
}

function renderMapBorder() {
    c.save();
    let [cx, cy] = getCameraCoordinates();
    for (let x = cx; x < cx + CAMERA_ARRSIZE_X; x++) {
        for (let y = cy; y < cy + CAMERA_ARRSIZE_Y; y++) {
            if (mapArr[x][y] === 1) {
                c.fillStyle = "black";
                c.fillRect((x - cx) * BLOCKSIZE, (y - cy) * BLOCKSIZE, (x - cx + 1) * BLOCKSIZE, (y - cy + 1) * BLOCKSIZE);
            }
        }
    }
    c.restore();
}

function renderGrid() {
    c.save();
    c.strokeStyle = "grey"
    c.lineWidth = "1";
    for (let x = Math.floor(cameraOffset[0]) - 5 * BLOCKSIZE; x < Math.floor(cameraOffset[0]) + CAMERASIZE + 5 * BLOCKSIZE; x++) {
        for (let y = Math.floor(cameraOffset[1]) - 5 * BLOCKSIZE; y < Math.floor(cameraOffset[1]) + CAMERASIZE + 5 * BLOCKSIZE; y++) {
            if (x % 50 === 0 && y % 50 === 0) {
                c.beginPath();
                c.rect(x - cameraOffset[0], y - cameraOffset[1], 5 * BLOCKSIZE, 5 * BLOCKSIZE);
                c.stroke();
                c.closePath();
            }
        }
    }
    c.restore();

}

function renderRing() {
    c.save();
    c.strokeStyle = "blue";
    c.lineWidth = 3;
    c.beginPath();
    c.arc(CAMERASIZE / 2, CAMERASIZE / 2, 150, 0, Math.PI * 2);
    c.stroke();
    c.closePath();
    c.restore();
}

function renderClear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

function renderPlayerHealth() {
    c.save();
    ///// Health Bar /////
    c.fillStyle = "rgba(220, 220, 220, 1)";
    c.fillRect(0, canvas.height - 16, canvas.width, 8);
    c.fillStyle = "red";
    let len = player.health / player.maxHealth * canvas.width;
    c.fillRect(0, canvas.height - 16, len, 8);

    c.strokeStyle = "red";
    c.lineWidth = 2;
    c.beginPath();
    c.rect(1, canvas.height - 16, canvas.width - 2, 7);
    c.stroke();
    c.closePath();
    ///// Health Bar /////

    c.restore();
}

function renderPlayerLevel() {
    c.save();
    // c.fillStyle = "rgba(100, 100, 255, 0.8)";
    ///// Exp Bar /////
    c.fillStyle = "rgba(220, 220, 220, 1)";
    c.fillRect(0, canvas.height - 8, canvas.width, 8);
    c.fillStyle = "blue";
    let len = player.currentExp / (player.currentExp + getRemainingExp()) * canvas.width;
    c.fillRect(0, canvas.height - 8, len, 8);

    c.strokeStyle = "blue";
    c.lineWidth = 2;
    c.beginPath();
    c.rect(1, canvas.height - 8, canvas.width - 2, 7);
    c.stroke();
    c.closePath();
    ///// Exp Bar /////

    ///// Level /////
    c.font = "25px Consolas";
    c.fillStyle = "black";
    c.fillText(`Level: ${player.level}`, 2, canvas.height - 24);
    ///// Level /////

    c.restore();

}

function renderPlayerStatus() {
    c.save();
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "rgba(255, 255, 255, 1)";
    c.strokeStyle = "rgba(255, 201, 14, 1)";
    c.lineWidth = 5;
    c.beginPath();
    c.rect(100, 60, 300, 380);
    c.fill();
    c.stroke();
    c.closePath();
    c.font = "bold 30px Consolas";
    c.textAlign = "center";
    c.fillStyle = "black";
    c.fillText("Player Status", canvas.width / 2, 100);
    c.font = "15px Consolas";
    c.textAlign = "left";
    c.fillStyle = "black";
    let y = 140;
    c.fillText(`Elapsed Time: ${time}`, 130, y);
    c.fillText(`Player Level: ${player.level}`, 130, y += 20);
    c.fillText(`Exp: ${player.currentExp}/${player.currentExp + getRemainingExp()}`, 130, y += 20);
    c.fillText(`World Level: ${worldLevel}`, 130, y += 20);
    c.fillText(`Player Movement Speed: ${roundTo(player.currentSpeed, 1)}`, 130, y += 20);
    c.fillText(`Player Exp Magnegic Range: ${player.expOrbMagneticRange}`, 130, y += 20);
    c.fillText(`Player Weapon: ${player.weapon.name}`, 130, y += 20);
    c.fillText(`${player.weapon.name} Damage: ${roundTo(player.weapon.damage, 1)}`, 130, y += 20);
    switch (player.weapon.name) {
        case "Orbit":
            c.fillText(`${player.weapon.name} Rotating Speed: ${roundTo(player.weapon.rotatingSpeed, 3)}`, 130, y += 20);
            c.fillText(`${player.weapon.name} Size: ${player.weapon.size}`, 130, y += 20);
            break;
        case "Laser":
            c.fillText(`${player.weapon.name} Width: ${player.weapon.width}`, 130, y += 20);
            c.fillText(`${player.weapon.name} Length: ${player.weapon.length}`, 130, y += 20);
            break;
        case "Sword":
            c.fillText(`${player.weapon.name} Length: ${player.weapon.length}`, 130, y += 20);
            c.fillText(`${player.weapon.name} Angle: ${roundTo(player.weapon.swingAngle, 3)}`, 130, y += 20);
            break;
        case "Boomerang":
            c.fillText(`${player.weapon.name} Size: ${player.weapon.size}`, 130, y += 20);
            c.fillText(`${player.weapon.name} Power: ${player.weapon.currentPower}`, 130, y += 20);
            break;
    }
    c.font = "bold 60px Consolas";
    c.textAlign = "center";
    c.fillStyle = "blue";
    c.fillText("PAUSED", canvas.width / 2, 400);
    c.restore();
}

function renderRemainingTime() {
    c.save();
    c.fillStyle = "rgba(255, 0, 0, 1)";
    c.font = "bold 40px Consolas";
    c.textAlign = "center";
    let t = String(timeRemaining / 1000);
    if (!t.includes(".")) t = t + ".0";
    c.fillText(`${t}`, canvas.width / 2, 50);
    c.restore();
}