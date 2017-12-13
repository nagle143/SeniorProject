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
    this.minDamage = 15;
    this.maxDamage = 20;
    this.image = new Image();
    this.image.onload = () => {
      this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/PlasmaGun_IDLE_00.png';
  }

  //Upgrades


  update() {
    super.update();
  }

  render(ctx) {
    /*
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    */
    ctx.save();
    ctx.translate(-this.size / 2,-this.size / 2);
    //ctx.rotate(this.direction);
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.image, 0, 0, this.size, this.size);
    ctx.restore();
    super.render(ctx);
  }
}
