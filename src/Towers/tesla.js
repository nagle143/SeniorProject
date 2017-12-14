import Tower from "./tower.js";


export default class Tesla extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 100;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 1;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    this.maxTargets = 3;
    this.TICK = 15;
    //Name Property
    this.name = "Tesla Tower";
    this.type = 'energy';
    this.minDamage = 8;
    this.maxDamage = 12;
    this.value = 21;
    this.image = new Image();
    this.image.onload = () => {
      this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/TeslaTower_IDLE_00.png';
  }

  //Upgrades
  applyUpgrade(index) {
    switch (index) {
      case 0:
        this.increaseDamage();
        break;
      case 1:
        this.moreTargets();
        break;
      case 2:
        this.increaseRange();
        break;
      case 3:
        this.deathTower();
        break;
      default:
        console.log('Invalid Upgrade');
        return;
    }
    this.upgrades[index] = true;
  }

  increaseDamage() {
    this.minDamage += 3;
    this.maxDamage += 4;
  }

  moreTargets() {
    this.maxTargets += 1;
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.15);
  }

  deathTower() {
    this.increaseDamage();
    this.moreTargets();
    this.increaseRange();
    this.image.src = 'Sprites/TeslaTower_IDLE_01.png';
  }

  targetAdded(enemy) {
    this.targets.push({target: enemy, timer: this.TICK});
  }

  targetRemoved(ID) {
    this.targets.splice(ID, 1);
  }

  update() {
    for(let i = 0; i < this.targets.length; i++) {
      this.targets[i].timer--;
      if(this.targets[i].timer <= 0) {
        let damage = Math.randomInt(this.minDamage, this.maxDamage + 1);
        this.targets[i].target.hit(damage, this.type, this.effect);
        this.targets[i].timer = this.TICK;
        if(this.targets[i].target.health < 0) {
          this.targets.splice(i, 1);
        }
      }
    }
    for(let i = 0; i < this.targets.length; i++) {
      if(this.targets[i].target.dead) {
        this.targets.splice(i, 1);
      }
      else if(Math.abs(this.targets[i].target.x - this.x) > this.range || Math.abs(this.targets[i].target.y - this.y) > this.range) {
        this.targets.splice(i, 1);
      }
    }
    super.update();
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'cyan';
    ctx.beginPath();
    this.targets.forEach(targets => {
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(targets.target.x, targets.target.y);
    });
    ctx.stroke();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction - Math.PI / 2);
    ctx.drawImage(this.image, -this.size, -this.size, this.image.width, this.image.height);
    ctx.restore();
    super.render(ctx);
  }
}
