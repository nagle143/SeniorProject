import Tower from "./tower.js";


export default class FlameThrower extends Tower {
  constructor(x, y, size) {
    super(x, y, size);
    //Range of the tower
    this.range = 100;
    //Direction the tower is aiming
    this.direction = 0.0;
    //Variable that holds the rate of rateOfFire
    this.RATE = 5;
    //timer variable
    this.rateOfFire = this.RATE;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "Flame Thrower";
    this.minDamage = 5;
    this.maxDamage = 8;
  }

  //Upgrades


  update() {
    super.update();
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    super.render(ctx);
  }
}
