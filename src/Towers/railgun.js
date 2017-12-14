import Tower from "./tower.js";


export default class RailGun extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 300;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 120;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "Rail Gun";
    this.type = 'kinetic';
    this.minDamage = 40;
    this.maxDamage = 50;
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
        this.increaseDamage();
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

  increaseDamage() {
    this.minDamage = Math.round(this.minDamage * 1.50);
    this.maxDamage = Math.round(this.maxDamage * 1.50);
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.50);
  }

  decreaseRate() {
    this.RATE = Math.round(this.RATE * 0.80);
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
