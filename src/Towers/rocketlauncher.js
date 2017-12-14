import Tower from "./tower.js";


export default class RocketLauncher extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 200;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 90;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "Rocket Launcher";
    this.type = 'kinetic';
    this.minDamage = 20;
    this.maxDamage = 35;
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
        this.increaseRange();
        break;
      case 1:
        //Upgrade applied to the projectile itself
        break;
      case 2:
        this.increaseDamage();
        break;
      case 3:
        this.changeType();
        break;
      default:
        console.log('Invalid Upgrade');
        return;
    }
    this.upgrades[index] = true;
  }

  increaseRange() {
    this.range = Math.round(this.range * 1.40);
  }

  increaseDamage() {
    this.minDamage = Math.round(this.minDamage * 1.50);
    this.maxDamage = Math.round(this.maxDamage * 1.50);
  }

  changeType() {
    this.type = 'energy';
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
