class Weapon {
    constructor() {
        this.name = null;
    }
    checkWeapon_EntityCollision() { }
}
class Orbit extends Weapon {
    constructor() {
        super();
        this.name = "Orbit";
        this.damage = 20;
        function Satelite(x, y, theta) {
            this.x = x;
            this.y = y;
            this.theta = theta;
        }
        this.orbitRadius = 50;
        this.rotatingSpeed = 0.04;
        this.size = 10;
        this.sateliteSet = new Set();
        this.sateliteSet.add(new Satelite(player.x - this.orbitRadius, player.y, Math.PI));
        this.sateliteSet.add(new Satelite(player.y + this.orbitRadius, player.y, 0));

        this.upgradeSpeed = 0.005;
        this.upgradeSize = 1;
        this.upgradeDamage = this.damage * 0.2;
    }
    moveSatelites() {
        this.sateliteSet.forEach(satelite => {
            satelite.theta += this.rotatingSpeed;
            if (satelite.theta > Math.PI * 2) {
                satelite.theta -= Math.PI * 2;
            }
            satelite.x = player.x + this.orbitRadius * Math.cos(satelite.theta);
            satelite.y = player.y + this.orbitRadius * Math.sin(satelite.theta);
        });
    }
    checkActive() {
        if (activeDown && this.orbitRadius < 80) {
            this.orbitRadius += 2;
        } else if (!activeDown && this.orbitRadius > 50) {
            this.orbitRadius -= 2;
        }
    }
    checkWeapon_AllEntityCollision() {
        doCheck.bind(this)(monsterSet);
        doCheck.bind(this)(bossSet);

        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                let onHit = false;
                this.sateliteSet.forEach(satelite => {
                    if (this.checkWeapon_EntityCollision(satelite, entity)) {
                        entity.weaponCollisionHandler(this.damage);
                        onHit = true;
                    }
                });

                entity.onHit = onHit;
            });
        }
    }

    checkWeapon_EntityCollision(satelite, entity) {
        let s_entity_distance = getDistance(satelite.x, satelite.y, entity.x, entity.y) - this.size - entity.size;

        if (s_entity_distance <= 0) {
            return true;
        } else {
            return false;
        }
    }
}

class Laser extends Weapon {
    constructor() {
        super();
        this.name = "Laser";
        this.damage = 40;
        this.width = 20;
        this.length = 100;
        this.frameDuration = 16;
        this.currentFrameDuration = 0;
        this.framesToShoot = 64;
        this.currentFramesToShoot = this.framesToShoot;
        this.x;
        this.y;
        this.theta;
        this.activeCharge;
        this.fullCharge = 250;
        this.activeRange = 100;
        this.upgradeLength = 15;
        this.upgradeWidth = 5;
        this.upgradeDamage = this.damage * 0.2;
    }

    calculateDirection() {
        let min_d = Infinity;
        this.x = player.x;
        this.y = player.y;
        getMin.bind(this)(monsterSet);
        getMin.bind(this)(bossSet);

        function getMin(entitySet) {
            entitySet.forEach(entity => {
                let d = getDistance(player.x, player.y, entity.x, entity.y) - player.size - entity.size;
                if (min_d > d) {
                    this.x = player.x + this.length * (entity.x - player.x) / (d + player.size + entity.size);
                    this.y = player.y + this.length * (entity.y - player.y) / (d + player.size + entity.size);
                    this.theta = Math.atan(-(this.y - player.y) / (this.x - player.x));
                    min_d = d;
                }
            });
        }

    }
    checkActive() {
        if (activeDown) {
            this.activeCharge += 1;
            if (this.activeCharge >= this.fullCharge) {
                this.activeCharge = 0;
                doCheck.bind(this)(monsterSet);
                doCheck.bind(this)(bossSet);
            }
        } else {
            this.activeCharge = 0;
        }
        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                if (this.checkWeapon_EntityCollision(entity)) {
                    entity.weaponCollisionHandler(this.damage);
                } else {
                    entity.onHit = false;
                }
            });
        }
    }

    checkWeapon_AllEntityCollision() {
        doCheck.bind(this)(monsterSet);
        doCheck.bind(this)(bossSet);

        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                if (this.checkWeapon_EntityCollision(entity)) {
                    entity.weaponCollisionHandler(this.damage);
                } else {
                    entity.onHit = false;
                }
            });
        }
    }
    checkWeapon_EntityCollision(entity) {
        if (activeDown) {
            let d = getDistance(player.x, player.y, entity.x, entity.y) - entity.size;
            if (d <= this.activeRange) {
                return true;
            } else {
                return false;
            }
        } else {
            let d = ((entity.x - player.x) * (this.x - player.x) + (entity.y - player.y) * (this.y - player.y)) / getDistance(player.x, player.y, this.x, this.y);
            if (d >= 0 && d <= getDistance(player.x, player.y, this.x, this.y)) {
                let distance = Math.sqrt(Math.pow(entity.x - player.x, 2) + Math.pow(entity.y - player.y, 2) - d * d);
                if (distance <= this.width / 2 + entity.size) {
                    return true;
                }
                return false;
            } else if (d > getDistance(player.x, player.y, this.x, this.y)) {
                let x1 = this.x - (this.width / 2) * Math.sin(this.theta);
                let y1 = this.y - (this.width / 2) * Math.cos(this.theta);
                let x2 = this.x + (this.width / 2) * Math.sin(this.theta);
                let y2 = this.y + (this.width / 2) * Math.cos(this.theta);
                let d2 = ((entity.x - x1) * (x2 - x1) + (entity.y - y1) * (y2 - y1)) / getDistance(x1, y1, x2, y2);
                if (d2 >= 0 && d2 <= getDistance(x1, y1, x2, y2)) {
                    let distance = Math.sqrt(Math.pow(entity.x - x1, 2) + Math.pow(entity.y - y1, 2) - d2 * d2);
                    if (distance <= entity.size) {
                        return true;
                    }
                    return false;
                } else if (getDistance(x1, y1, entity.x, entity.y) <= entity.size || getDistance(x2, y2, entity.x, entity.y) <= entity.size) {
                    return true;
                }
                return false;
            } else if (d < 0) {
                let x1 = player.x - (this.width / 2) * Math.sin(this.theta);
                let y1 = player.y - (this.width / 2) * Math.cos(this.theta);
                let x2 = player.x + (this.width / 2) * Math.sin(this.theta);
                let y2 = player.y + (this.width / 2) * Math.cos(this.theta);
                let d2 = ((entity.x - x1) * (x2 - x1) + (entity.y - y1) * (y2 - y1)) / getDistance(x1, y1, x2, y2);
                if (d2 >= 0 && d2 <= getDistance(x1, y1, x2, y2)) {
                    let distance = Math.sqrt(Math.pow(entity.x - x1, 2) + Math.pow(entity.y - y1, 2) - d2 * d2);
                    if (distance <= entity.size) {
                        return true;
                    }
                    return false;
                } else if (getDistance(x1, y1, entity.x, entity.y) <= entity.size || getDistance(x2, y2, entity.x, entity.y) <= entity.size) {
                    return true;
                }
                return false;
            }
        }
    }
}

class Sword extends Weapon {
    constructor() {
        super();
        this.name = "Sword";
        this.damage = 40;
        this.length = 100;
        this.width = 10;
        this.cooldown = 64;
        this.currentCooldown = 0;
        this.clockwise;
        this.theta;
        this.deltaTheta = 0.1;
        this.currentSwingAngle = 0;
        this.swingAngle = Math.PI * (2 / 4);
        this.x;
        this.y;
        this.R = Math.PI * (0 / 4);
        this.DR = Math.PI * (1 / 4);
        this.D = Math.PI * (2 / 4);
        this.DL = Math.PI * (3 / 4);
        this.L = Math.PI * (4 / 4);
        this.UL = Math.PI * (5 / 4);
        this.U = Math.PI * (6 / 4)
        this.UR = Math.PI * (7 / 4);
        this.swinging = false;
        this.upgradeLength = this.length * 0.05;
        this.upgradeAngle = 0.3;
        this.upgradeDamage = this.damage * 0.2;
    }
    swingSword() {
        if (this.swinging) {
            this.theta = this.clockwise ? this.theta + this.deltaTheta : this.theta - this.deltaTheta;
            this.currentSwingAngle += this.deltaTheta;
            this.x = player.x + this.length * Math.cos(this.theta);
            this.y = player.y + this.length * Math.sin(this.theta);
            if (this.currentSwingAngle > this.swingAngle) {
                this.swinging = false;
            }
        }
    }
    checkActive() {

        if (this.currentCooldown > 0) this.currentCooldown--;

        if (activeDown && this.currentCooldown === 0 && this.swinging === false) {
            if (player.facingDirection === "right") {
                if (!rightDown && upDown && !downDown) {
                    this.theta = this.U;
                } else if (rightDown && upDown && !downDown) {
                    this.theta = this.UR;
                } else if (rightDown && !upDown && !downDown) {
                    this.theta = this.R;
                } else if (rightDown && !upDown && downDown) {
                    this.theta = this.DR;
                } else if (!rightDown && !upDown && downDown) {
                    this.theta = this.D;
                } else {
                    this.theta = this.R;
                }
                this.theta -= this.swingAngle / 2
                this.clockwise = true;
            } else {
                if (!leftDown && upDown && !downDown) {
                    this.theta = this.U;
                } else if (leftDown && upDown && !downDown) {
                    this.theta = this.UL;
                } else if (leftDown && !upDown && !downDown) {
                    this.theta = this.L;
                } else if (leftDown && !upDown && downDown) {
                    this.theta = this.DL;
                } else if (!leftDown && !upDown && downDown) {
                    this.theta = this.D;
                } else {
                    this.theta = this.L;
                }

                this.theta += this.swingAngle / 2;
                this.clockwise = false;
            }
            this.x = player.x + this.length * Math.cos(this.theta);
            this.y = player.y + this.length * Math.sin(this.theta);
            this.currentCooldown = this.cooldown;
            this.currentSwingAngle = 0;
            this.swinging = true;
        }
    }
    checkWeapon_AllEntityCollision() {
        doCheck.bind(this)(monsterSet);
        doCheck.bind(this)(bossSet);

        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                if (this.checkWeapon_EntityCollision(entity)) {
                    entity.weaponCollisionHandler(this.damage);
                } else {
                    entity.onHit = false;
                }
            });
        }
    }
    checkWeapon_EntityCollision(entity) {
        let d = ((entity.x - player.x) * (this.x - player.x) + (entity.y - player.y) * (this.y - player.y)) / getDistance(player.x, player.y, this.x, this.y);
        if (d >= 0 && d <= getDistance(player.x, player.y, this.x, this.y)) {
            let distance = Math.sqrt(Math.pow(entity.x - player.x, 2) + Math.pow(entity.y - player.y, 2) -
                d * d);
            if (distance <= this.width / 2 + entity.size) {
                return true;
            }
            return false;
        } else if (d > getDistance(player.x, player.y, this.x, this.y)) {
            let x1 = this.x - (this.width / 2) * Math.sin(this.theta);
            let y1 = this.y - (this.width / 2) * Math.cos(this.theta);
            let x2 = this.x + (this.width / 2) * Math.sin(this.theta);
            let y2 = this.y + (this.width / 2) * Math.cos(this.theta);
            let d2 = ((entity.x - x1) * (x2 - x1) + (entity.y - y1) * (y2 - y1)) / getDistance(x1, y1, x2, y2);
            if (d2 >= 0 && d2 <= getDistance(x1, y1, x2, y2)) {
                let distance = Math.sqrt(Math.pow(entity.x - x1, 2) + Math.pow(entity.y - y1, 2) - d2 * d2);
                if (distance <= entity.size) {
                    return true;
                }
                return false;
            } else if (getDistance(x1, y1, entity.x, entity.y) <= entity.size || getDistance(x2, y2, entity.x, entity.y) <= entity.size) {
                return true;
            }
            return false;
        } else if (d < 0) {
            let x1 = player.x - (this.width / 2) * Math.sin(this.theta);
            let y1 = player.y - (this.width / 2) * Math.cos(this.theta);
            let x2 = player.x + (this.width / 2) * Math.sin(this.theta);
            let y2 = player.y + (this.width / 2) * Math.cos(this.theta);
            let d2 = ((entity.x - x1) * (x2 - x1) + (entity.y - y1) * (y2 - y1)) / getDistance(x1, y1, x2, y2);
            if (d2 >= 0 && d2 <= getDistance(x1, y1, x2, y2)) {
                let distance = Math.sqrt(Math.pow(entity.x - x1, 2) + Math.pow(entity.y - y1, 2) - d2 * d2);
                if (distance <= entity.size) {
                    return true;
                }
                return false;
            } else if (getDistance(x1, y1, entity.x, entity.y) <= entity.size || getDistance(x2, y2, entity.x, entity.y) <= entity.size) {
                return true;
            }
            return false;
        }
    }
}

class Boomerang extends Weapon {
    constructor() {
        super();
        this.name = "Boomerang";
        this.damage = 20;
        this.x;
        this.y;
        this.dx;
        this.dy;
        this.xVel;
        this.yVel;
        this.size = 15;
        this.currentPower = 20;
        this.hasBoomerang = true;
        this.R = Math.PI * (0 / 4);
        this.DR = Math.PI * (1 / 4);
        this.D = Math.PI * (2 / 4);
        this.DL = Math.PI * (3 / 4);
        this.L = Math.PI * (4 / 4);
        this.UL = Math.PI * (5 / 4);
        this.U = Math.PI * (6 / 4)
        this.UR = Math.PI * (7 / 4);
        this.upgradeSize = 2;
        this.upgradePower = 2;
        this.upgradeDamage = this.damage * 0.2;
    }
    moveBoomerang() {
        if (!this.hasBoomerang) {
            this.x += this.xVel;;
            this.y += this.yVel;

            let d = getDistance(player.x, player.y, this.x, this.y);
            this.xVel += (player.x - this.x) / d * 0.05 * this.currentPower;
            this.yVel += (player.y - this.y) / d * 0.05 * this.currentPower,

                checkPlayer_BoomerangCollision.bind(this)();

            function checkPlayer_BoomerangCollision() {
                let d = getDistance(player.x, player.y, this.x, this.y) - player.size - this.size;
                if (d > 0) this.boomerangOutbound = false;
                if (d <= 0 && !this.boomerangOutbound) {
                    this.hasBoomerang = true;
                }
            }
        }
    }
    checkActive() {
        if (activeDown && this.hasBoomerang) {
            if (player.facingDirection === "right") {
                if (!rightDown && upDown && !downDown) {
                    this.theta = this.U;
                } else if (rightDown && upDown && !downDown) {
                    this.theta = this.UR;
                } else if (rightDown && !upDown && !downDown) {
                    this.theta = this.R;
                } else if (rightDown && !upDown && downDown) {
                    this.theta = this.DR;
                } else if (!rightDown && !upDown && downDown) {
                    this.theta = this.D;
                } else {
                    this.theta = this.R;
                }
            } else {
                if (!leftDown && upDown && !downDown) {
                    this.theta = this.U;
                } else if (leftDown && upDown && !downDown) {
                    this.theta = this.UL;
                } else if (leftDown && !upDown && !downDown) {
                    this.theta = this.L;
                } else if (leftDown && !upDown && downDown) {
                    this.theta = this.DL;
                } else if (!leftDown && !upDown && downDown) {
                    this.theta = this.D;
                } else {
                    this.theta = this.L;
                }
            }
            this.x = player.x;
            this.y = player.y;
            this.xVel = 0.8 * this.currentPower * Math.cos(this.theta);
            this.yVel = 0.8 * this.currentPower * Math.sin(this.theta);
            this.hasBoomerang = false;
            this.boomerangOutbound = true;
        }
    }

    checkWeapon_AllEntityCollision() {
        doCheck.bind(this)(monsterSet);
        doCheck.bind(this)(bossSet);

        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                if (this.checkWeapon_EntityCollision(entity)) {
                    entity.weaponCollisionHandler(this.damage);
                } else {
                    entity.onHit = false;
                }
            });
        }
    }
    checkWeapon_EntityCollision(entity) {
        let s_entity_distance = getDistance(this.x, this.y, entity.x, entity.y) - this.size - entity.size;

        if (s_entity_distance <= 0) {
            return true;
        } else {
            return false;
        }
    }
}