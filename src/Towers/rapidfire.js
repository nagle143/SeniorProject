import Tower from "./tower.js";


export default class RapidFire extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 150;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 30;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "Plasma Turret";
    this.type = 'energy';
    this.minDamage = 15;
    this.maxDamage = 20;
    this.image = new Image();
    this.image.onload = () => {
      this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/PlasmaGun_IDLE_00.png';
  }

  applyUpgrade(index) {
    switch (index) {
      case 0:
        this.decreaseRate();
        break;
      case 1:
        this.increaseDamage();
        break;
      case 2:
        this.increaseRange();
        break;
      case 3:
        this.decreaseRate();
        break;
      default:
        console.log('Invalid Upgrade');
        return;
    }
    this.upgrades[index] = true;
  }

  //Upgrades
  decreaseRate() {
    this.RATE = Math.round(this.RATE * 0.70);
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.25);
  }

  increaseDamage() {
    this.minDamage = Math.round(this.minDamage * 1.25);
    this.maxDamage = Math.round(this.maxDamage * 1.25);
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
