class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.xVel = 0;
        this.yVel = 0;
        this.facingDirection = "left";

        this.currentSpeed = 1.8;
        this.maxSpeed = Infinity;

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.healthRegenAmount = 0.005;
        this.framesToRegenHealth = 320;
        this.currentFramesToRegenHealth = this.framesToRegenHealth;

        this.isInvincible = false;
        this.framesInvincible = 0;
        this.isOpaque = false;

        this.level = 1;
        this.currentExp = 0;
        this.expOrbMagneticRange = 130;

        this.weapon = null;
        this.upgradeSpeed = 0.2;
        this.upgradeExpOrbMagneticRange = 20;
    }
    checkPlayer_EntityCollision() {
        const doCheckBound = doCheck.bind(this);
        doCheckBound(monsterSet);
        doCheckBound(bossSet);
        doCheckBound(expOrbSet);
        doCheckBound(etcSet);

        function doCheck(entitySet) {
            entitySet.forEach(entity => {
                let p_entity_distance = getDistance(this.x, this.y, entity.x, entity.y) - this.size - entity.size;
                if (p_entity_distance < 0) {
                    entity.playerCollisionHandler();
                }
            });
        }
    }
}