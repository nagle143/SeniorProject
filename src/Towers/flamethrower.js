import Tower from "./tower.js";


export default class FlameThrower extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 150;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 10;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = null;
    //Name Property
    this.name = "Flame Thrower";
    this.type = 'energy';
    this.effect = [];
    this.effect.push('burn');
    this.minDamage = 1;
    this.maxDamage = 2;
    this.image = new Image();
    this.image.onload = () => {
      this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/FlameThrower_IDLE_00.png';
  }

  //Upgrades
  applyUpgrade(index) {
    switch (index) {
      case 0:
        this.increaseDamage();
        break;
      case 1:
        this.pyroManiac();
        break;
      case 2:
        this.increaseRange();
        break;
      case 3:
        this.acidFire();
        break;
      default:
        console.log('Invalid Upgrade');
        return;
    }
    this.upgrades[index] = true;
  }

  increaseDamage() {
    this.minDamage += 1;
    this.maxDamage += 1;
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.10);
  }

  acidFire() {
    this.effect.push('acid');
    this.image.src = 'Sprites/FlameThrower_IDLE_01.png';
  }

  pyroManiac() {
    this.increaseDamage();
    this.increaseRange();
  }

  update() {
    if(this.targets) {
      this.direction = Math.getDirection(this.x, this.y, this.targets.x, this.targets.y);
      if(this.targets.dead) {
        this.targets = null;
      }
      else if(Math.abs(this.targets.x - this.x) > this.range || Math.abs(this.targets.y - this.y) > this.range) {
        this.targets = null;
      }
    }
    super.update();
  }

  render(ctx) {
    if(this.targets) {
      //let tempx = this.x + Math.sin(this.direction + Math.PI / 8) * this.range;
      //let tempy = this.y - Math.cos(this.direction + Math.PI / 8) * this.range;
      //let test1 = {x: tempx, y: tempy};
      //tempx = this.x + Math.sin(this.direction - Math.PI / 8) * this.range;
      //tempy = this.y - Math.cos(this.direction - Math.PI / 8) * this.range;
      //let test2 = {x: tempx, y: tempy};
      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.targets.x, this.targets.y);
      //ctx.moveTo(this.x, this.y);
      //ctx.lineTo(test1.x, test1.y);
      //ctx.moveTo(this.x, this.y);
      //ctx.lineTo(test2.x, test2.y);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction - Math.PI / 2);
    ctx.drawImage(this.image, -this.size, -this.size, this.image.width, this.image.height);
    ctx.restore();
    super.render(ctx);
  }
}
