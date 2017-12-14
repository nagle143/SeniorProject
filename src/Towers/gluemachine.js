import Tower from "./tower.js";


export default class GlueMachine extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 100;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 45;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "Industrial Gluer";
    this.type = 'kinetic';
    this.effect = [];
    this.effect.push('slow');
    this.minDamage = 8;
    this.maxDamage = 10;
    this.image = new Image();
    this.image.onload = () => {
      this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/PlasmaGun_IDLE_00.png';
  }

  //Upgrades
  applyUpgrade(index) {
    switch (index) {
      case 0:
        this.decreaseRate();
        break;
      case 1:
        //Handled in projectile
        break;
      case 2:
        this.increaseRange();
        break;
      case 3:
        this.acidGlue();
        break;
      default:
        console.log('Invalid Upgrade');
        return;
    }
    this.upgrades[index] = true;
  }

  decreaseRate() {
    this.RATE = Math.round(this.RATE * 0.70);
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.25);
  }

  acidGlue() {
    this.effect.push('acid');
  }


  update() {
    super.update();
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.direction - Math.PI / 2);
    ctx.drawImage(this.image, -this.size, -this.size, this.image.width, this.image.height);
    ctx.restore();
    super.render(ctx);
  }
}
