class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    playerCollisionHandler() { }
    weaponCollisionHandler() { }
}

class Monster extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.size = 8;
        this.xVel = 0;
        this.yVel = 0;
        this.facingDirection = "left";
        this.currentSpeed = EnvironmentVariable[worldLevel]["monsterBaseSpeed"];
        this.maxSpeed = 4;
        this.dropExp = 5;
        this.health = 1;
        this.color = "black";
        this.onHit = false;
        this.damage = 10;
    }
    playerCollisionHandler() {
        if (!player.isInvincible) {
            player.health -= this.damage;
            player.currentFramesToRegenHealth = player.framesToRegenHealth;
            if (player.health <= 0) isGameOver = true;
            player.isInvincible = true;
            player.framesInvincible = 128;
        }
    }
    weaponCollisionHandler(damage) {
        if (!this.onHit) {
            this.health -= damage;
            if (this.health <= 0) {
                monsterSet.delete(this);
                expOrbSet.add(new ExpOrb(this.x, this.y, this.dropExp));
            }

            this.onHit = true;
        }
    }
}
class ExpOrb extends Entity {
    constructor(x, y, expAmount) {
        super();
        this.x = x;
        this.y = y;
        this.size = 3;
        this.currentSpeed = 4;
        this.expAmount = expAmount;

    }

    playerCollisionHandler() {
        expOrbSet.delete(this);
        player.currentExp += this.expAmount;
    }
}
class Trap extends Entity {
    constructor(x, y, name) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;

        switch (this.name) {
            case "Trail":
                this.size = 15;
                this.framesToDisappear = 1920;
                this.xVel;
                this.yVel;
                this.currentSpeed = 4;
                this.decel = 0.05;
                this.color = "green";
                this.damage = 10;
                break;
            case "Bullet":
                this.size = 5;
                let d = getDistance(player.x, player.y, x, y);
                this.xVel = (player.x - x) / d * 5;
                this.yVel = (player.y - y) / d * 5;
                this.color = "white";
                this.damage = 15;
                break;
        }
    }
    playerCollisionHandler() {
        if (!player.isInvincible) {
            player.health -= this.damage;
            player.currentFramesToRegenHealth = player.framesToRegenHealth;

            if (player.health <= 0) isGameOver = true;
            player.isInvincible = true;
            player.framesInvincible = 128;

        }
    }
}

class Boss extends Entity {
    constructor(x, y, name) {
        super();
        this.name = name;
        this.x = x;
        this.y = y;
        this.xVel = 0;
        this.yVel = 0;
        this.facingDirection = "left";
        this.onHit = false;
        this.bossNameArr = ["Giant Ball", "Drunken Ball", "Betrayer", "Biohazard", "Sniper"];
        this.bossKind = this.bossNameArr.length;
        if (this.name === undefined) {
            this.name = this.bossNameArr[Math.floor(Math.random() * this.bossKind)];
        }

        switch (this.name) {
            case "Giant Ball":
                this.currentSpeed = EnvironmentVariable[worldLevel]["bossBaseSpeed"];
                this.maxHealth = EnvironmentVariable[worldLevel]["bossBaseHealth"] * 4;
                this.health = this.maxHealth;
                this.size = this.health * 0.2;
                this.dropExp = EnvironmentVariable[worldLevel]["bossBaseExp"] * 4;
                this.healthRegenAmount = this.maxHealth / 4000;
                this.damage = 20;
                break;
            case "Drunken Ball":
                this.size = 20;
                this.currentSpeed = EnvironmentVariable[worldLevel]["bossBaseSpeed"] * 1.2;
                this.maxHealth = EnvironmentVariable[worldLevel]["bossBaseHealth"] * 2;
                this.health = this.maxHealth;
                this.dropExp = EnvironmentVariable[worldLevel]["bossBaseExp"] * 4;
                this.damage = 20;
                break;
            case "Betrayer":
                this.size = 20;
                this.currentSpeed = player.currentSpeed * 0.8;
                this.maxHealth = EnvironmentVariable[worldLevel]["bossBaseHealth"] * 2;
                this.health = this.maxHealth;
                this.dropExp = EnvironmentVariable[worldLevel]["bossBaseExp"] * 4;
                this.damage = 20;
                break;
            // case “Bisector":
            // this.size = 30;
            // this.currentSpeed = 1;
            // this.maxHealth = 100;
            // this.health = this.maxHealth;
            // this.dropExp = time * 4;
            // break;
            case "Biohazard":
                this.size = 30;
                this.currentSpeed = EnvironmentVariable[worldLevel]["bossBaseSpeed"];
                this.maxHealth = EnvironmentVariable[worldLevel]["bossBaseHealth"] * 2;
                this.health = this.maxHealth;
                this.dropExp = EnvironmentVariable[worldLevel]["bossBaseExp"] * 4;
                this.trailDelay = 64;
                this.framesToTrail = this.trailDelay;
                this.damage = 20;

                break;
            //case "Witch":

            // this.size = 40;
            // this.currentSpeed = 1;
            // this.maxHealth = 100;
            // this.health = this.maxHealth;
            // this.dropExp = time * 4;
            // break;

            case "Sniper":
                this.size = 20;
                this.currentSpeed = EnvironmentVariable[worldLevel]["bossBaseSpeed"];
                this.maxHealth = EnvironmentVariable[worldLevel]["bossBaseHealth"];
                this.health = this.maxHealth;
                this.dropExp = EnvironmentVariable[worldLevel]["bossBaseExp"] * 4
                this.fireDelay = 192;
                this.framesToFire = this.fireDelay;
                this.damage = 15;
        }
    }
    playerCollisionHandler() {
        if (!player.isInvincible) {
            player.health -= this.damage;
            player.currentFramesToRegenHealth = player.framesToRegenHealth;
            if (player.health <= 0) isGameOver = true;
            player.isInvincible = true;

            player.framesInvincible = 128;

        }
    }
    weaponCollisionHandler(damage) {
        if (!this.onHit) {
            this.health -= damage;
            if (this.health <= 0) {
                bossSet.delete(this);
                expOrbSet.add(new ExpOrb(this.x, this.y, this.dropExp));
            }
            this.onHit = true;

        }
    }
}
class Heart extends Entity {
    constructor(x, y) {
        super();
        this.x = x
        this.y = y;
        this.size = 20;
        this.framesToDisappear = 64 * 60;
    }
    playerCollisionHandler() {
        etcSet.delete(this);
        if (player.health < player.maxHealth) {
            player.health += 20;
        }
    }
}