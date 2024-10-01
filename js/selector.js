function WeaponSelector() {
    function handleArrowKey(e) {
        if (e.code === "KeyA" || e.code === "ArrowLeft") if (this.entryCursor > 0) this.entryCursor--;
        if (e.code === "KeyD" || e.code === "ArrowRight") if (this.entryCursor < this.entryCount - 1) this.entryCursor++;
        if (e.code === "KeyF" || e.code === "Enter") this.selectKeyPressed = true;
    }
    this.constructor = function () {
        this.entryCount = 4;
        this.entryArr = ["Orbit", "Laser", "Sword", "Boomerang"];
        this.entryCursor = 1;
        this.selectKeyPressed = false;
        document.addEventListener("keydown", handleArrowKey.bind(this));
    };

    this.destructor = function () {
        document.removeEventListener("keydown", handleArrowKey);
    };

    this.selectWeapon = async function () {
        let loopCount = 0;
        while (1) {
            await sleep(50);
            if (escDown) return;
            this.renderEntry(loopCount);
            if (this.selectKeyPressed) {
                switch (this.entryArr[this.entryCursor]) {
                    case "Orbit":
                        player.weapon = new Orbit();
                        break;
                    case "Laser":
                        player.weapon = new Laser();
                        break;
                    case "Sword":
                        player.weapon = new Sword();
                        break;
                    case "Boomerang":
                        player.weapon = new Boomerang();
                }
                return;
            }
            loopCount++;
        }
    };

    this.renderEntry = function (loopCount) {
        c.save();
        if (loopCount < 10) {
            c.fillStyle = "rgba(0, 0, 0, 0.1)";
            c.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (loopCount === 10) {
            c.fillStyle = "rgba(0, 162, 232, 1)";
            c.strokeStyle = "rgba(153, 217, 234, 1)";
            c.lineWidth = 1;
            // c.strokeStyle = "black";
            c.font = "30px Consolas";
            c.textAlign = "center";
            c.fillText("Select Your Weapon", canvas.width / 2, 65);
            c.strokeText("Select Your Weapon", canvas.width / 2, 65);
        }

        for (let x = 0; x < this.entryArr.length; x++) {
            let cardWidth = canvas.width / this.entryArr.length;
            let cardHeight = 200;
            let margin = 10;
            let sx = x * cardWidth;
            let sy = 100;
            c.beginPath();
            if (x === this.entryCursor) {
                c.fillStyle = "rgba(0, 162, 232, 1)";
                c.strokeStyle = "rgba(153, 217, 234, 1)";
            } else {
                c.fillStyle = "rgba(0, 130, 200, 1)";
                c.strokeStyle = "rgba(120, 180, 200, 1)";
            }
            c.lineWidth = 5;
            c.rect(sx + margin, sy + margin, cardWidth - 2 * margin, cardHeight - margin);
            c.fill();
            c.stroke();
            c.closePath();
            c.beginPath();
            c.fillStyle = "white";
            c.font = "bold 15px Consolas";
            c.textAlign = "center";
            c.fillText(this.entryArr[x], sx + cardWidth / 2, sy + 40);
            c.closePath();
            c.beginPath();
            c.fillStyle = "white";
            c.font = "10px Consolas";
            c.textAlign = "center";
            switch (this.entryArr[x]) {
                case "Orbit":
                    c.fillText("Spins around you", sx + cardWidth / 2, sy + 80);
                    c.font = "15px Consolas";
                    c.fillText("Active:", sx + cardWidth / 2, sy + 140);
                    c.font = "11px Consolas";
                    c.fillText("Variable", sx + cardWidth / 2, sy + 160);
                    c.fillText("orbit radius", sx + cardWidth / 2, sy + 180);
                    break;
                case "Laser":
                    c.fillText("Auto targeting", sx + cardWidth / 2, sy + 80);
                    c.fillText("laser", sx + cardWidth / 2, sy + 100);
                    c.font = "15px Consolas";
                    c.fillText("Active:", sx + cardWidth / 2, sy + 140);
                    c.font = "11px Consolas";
                    c.fillText("Charge to ", sx + cardWidth / 2, sy + 160);
                    c.fillText("make Explosion", sx + cardWidth / 2, sy + 180);
                    break;
                case "Sword":
                    c.fillText("Swing a sword", sx + cardWidth / 2, sy + 80);
                    c.font = "15px Consolas";
                    c.fillText("Active:", sx + cardWidth / 2, sy + 140);
                    c.font = "11px Consolas";
                    c.fillText("Swing a sword", sx + cardWidth / 2, sy + 160);
                    break;
                case "Boomerang":
                    c.fillText("Throw a boomerang", sx + cardWidth / 2, sy + 80);
                    c.font = "15px Consolas";
                    c.fillText("Active:", sx + cardWidth / 2, sy + 140);
                    c.font = "10px Consolas";
                    c.fillText("Throw a boomerang", sx + cardWidth / 2, sy + 160);
                    break;
            }
            c.closePath();
        }
        c.restore();
    };
}
function LevelUpHandler() {
    function handleArrowKey(e) {
        if (e.code === "KeyA" || e.code === "ArrowLeft") if (this.entryCursor > 0) this.entryCursor--;
        if (e.code === "KeyD" || e.code === "ArrowRight") if (this.entryCursor < this.entryCount - 1) this.entryCursor++;
        if (e.code === "KeyF" || e.code === "Enter") this.selectKeyPressed = true;
    }
    this.constructor = function () {
        this.entryCount = 3;
        this.upgrades = {
            "Common": [
                "Movement Speed",
                "Exp Magnet Range",
                "Heal"
            ],
            "Orbit": [
                "Orbit Speed",
                "Orbit Size",
                "Orbit Damage"
            ],
            "Laser": [
                "Laser Length",
                "Laser Width",
                "Laser Damage"
            ],
            "Sword": [
                "Sword Length",
                "Sword Angle",
                "Sword Damage"
            ],
            "Boomerang": [
                "Boomerang Size",
                "Boomerang Power",
                "Boomerang Damage"
            ]
        };

        let upgradePool = this.upgrades["Common"].concat(this.upgrades[player.weapon.name]);
        this.entryArr = [];
        for (let i = 0; i < this.entryCount; i++) {
            let idx = Math.floor(Math.random() * upgradePool.length);
            this.entryArr.push(upgradePool[idx]);
            upgradePool.splice(idx, 1);
        }
        this.entryCursor = 1;
        this.selectKeyPressed = false;
        document.addEventListener("keydown", handleArrowKey.bind(this));
    };
    this.destructor = function () {
        document.removeEventListener("keydown", handleArrowKey);
    };
    this.selectUpgrade = async function () {
        let loopCount = 0;
        while (1) {
            await sleep(50);
            if (escDown) return;
            this.renderEntry(loopCount);
            if (this.selectKeyPressed) {
                switch (this.entryArr[this.entryCursor]) {
                    case "Movement Speed":
                        player.currentSpeed += player.upgradeSpeed;
                        break;
                    case "Exp Magnet Range":
                        player.expOrbMagneticRange += player.upgradeExpOrbMagneticRange;
                        break;
                    case "Heal":
                        player.health = Math.min(player.health + 20, player.maxHealth);
                        break;
                    case "Orbit Speed":
                        player.weapon.rotatingSpeed += player.weapon.upgradeSpeed;
                        break;
                    case "Orbit Size":
                        player.weapon.size += player.weapon.upgradeSize;
                        break;
                    case "Orbit Damage":
                        player.weapon.damage += player.weapon.upgradeDamage;
                        break;
                    case "Laser Length":
                        player.weapon.length += player.weapon.upgradeLength;
                        break;
                    case "Laser Width":
                        player.weapon.width += player.weapon.upgradeWidth;
                        break;
                    case "Laser Damage":
                        player.weapon.damage += player.weapon.upgradeDamage;
                        break;
                    case "Sword Length":
                        player.weapon.length += player.weapon.upgradeLength;
                        break;
                    case "Sword Angle":
                        player.weapon.swingAngle += player.weapon.upgradeAngle;
                        break;
                    case "Sword Damage":
                        player.weapon.damage += player.weapon.upgradeDamage;
                        break;
                    case "Boomerang Size":
                        player.weapon.size += player.weapon.upgradeSize;
                        break;
                    case "Boomerang Power":
                        player.weapon.currentPower += player.weapon.upgradePower;
                        break;
                    case "Boomerang Damage":
                        player.weapon.damage += player.weapon.upgradeDamage;
                        break;
                }
                return;
            }
            loopCount++;
        }
    };

    this.renderEntry = function (loopCount) {
        c.save();

        if (loopCount < 10) {
            c.fillStyle = "rgba(0, 0, 0, 0.1)";
            c.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (loopCount === 10) {
            c.fillStyle = "rgba(255, 201, 14, 1)";
            c.strokeStyle = "rgba(255, 242, 0, 1)";
            c.lineWidth = 1;
            // c.strokeStyle = "black";
            c.font = "30px Consolas";
            c.textAlign = "center";
            c.fillText("Select an Upgrade", canvas.width / 2, 65);
            c.strokeText("Select an Upgrade", canvas.width / 2, 65);
        }
        for (let x = 0; x < this.entryArr.length; x++) {
            let cardWidth = canvas.width / this.entryArr.length;
            let cardHeight = 200;
            let margin = 10;
            let sx = x * cardWidth;
            let sy = 100;
            c.beginPath();
            if (x === this.entryCursor) {
                c.fillStyle = "rgba(255, 201, 14, 1)";
                c.strokeStyle = "rgba(255, 242, 0, 1)";
            } else {
                c.fillStyle = "rgba(200, 150, 14, 1)";
                c.strokeStyle = "rgba(200, 180, 0, 1)";
            }
            c.lineWidth = 5;
            c.rect(sx + margin, sy + margin, cardWidth - 2 * margin, cardHeight - margin);
            c.fill();
            c.stroke();
            c.closePath();
            c.beginPath();
            c.fillStyle = "black";
            c.font = "15px Consolas";
            c.textAlign = "center";
            c.fillText(this.entryArr[x], sx + cardWidth / 2, sy + 40);
            c.closePath();
            c.beginPath();
            c.fillStyle = "black";
            c.font = "15px Consolas";
            c.textAlign = "center";
            switch (this.entryArr[x]) {
                case "Movement Speed":
                    c.fillText("Movement", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Speed += ${player.upgradeSpeed}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Exp Magnet Range":
                    c.fillText("Exp Magnet", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Range += ${player.upgradeExpOrbMagneticRange}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Heal":
                    c.fillText("Instantly heal", sx + cardWidth / 2, sy + 80);
                    c.fillText(`for 20 HP`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Orbit Speed":
                    c.fillText("Orbit rotating", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Speed += ${player.weapon.upgradeSpeed}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Orbit Size":
                    c.fillText(`Orbit Size += ${player.weapon.upgradeSize}`, sx + cardWidth / 2, sy + 80);
                    break;
                case "Orbit Damage":
                    c.fillText("Orbit", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Damage += ${roundTo(player.weapon.upgradeDamage, 1)}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Laser Length":
                    c.fillText("Laser", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Length += ${player.weapon.upgradeLength}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Laser Width":
                    c.fillText(`Laser Width += ${player.weapon.upgradeWidth}`, sx + cardWidth / 2, sy + 80);
                    break;
                case "Laser Damage":
                    c.fillText("Laser", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Damage += ${roundTo(player.weapon.upgradeDamage, 1)}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Sword Length":
                    c.fillText("Sword", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Length += ${player.weapon.upgradeLength}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Sword Angle":
                    c.fillText("Sword", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Angle += ${player.weapon.upgradeAngle}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Sword Damage":
                    c.fillText("Sword", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Damage += ${roundTo(player.weapon.upgradeDamage, 1)}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Boomerang Size":
                    c.fillText("Boomerang", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Size += ${player.weapon.upgradeSize}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Boomerang Power":
                    c.fillText("Boomerang", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Power += ${player.weapon.upgradePower}`, sx + cardWidth / 2, sy + 100);
                    break;
                case "Boomerang Damage":
                    c.fillText("Boomerang", sx + cardWidth / 2, sy + 80);
                    c.fillText(`Damage += ${roundTo(player.weapon.upgradeDamage, 1)}`, sx + cardWidth / 2, sy + 100);
                    break;
            }
            c.closePath();
        }

        c.restore();

    };
}
