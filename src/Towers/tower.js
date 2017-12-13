

export default class Tower {
  constructor(x, y, size) {
    //Postion variables
    this.x = x;
    this.y = y;
    //Range of the tower
    this.range = 0;
    //Direction the tower is aiming
    this.direction = 0.0;
    //damage
    this.minDamage = 10;
    this.MaxDamage = 20;
    //Variable that holds the rate of rateOfFire
    this.RATE = 0;
    //timer variable
    this.rateOfFire = 0;
    //Bool for reloading
    this.reloading = false;
    //Active targets for the tower
    this.targets = [];
    //Name Property
    this.name = "";
    //Size of the tower
    this.size = Math.round(size * 0.10);
    this.type = "";
    this.value = 15;
    this.selected = false;
  }

  /** @function track
    * Function to handle calculating the direction the tower will shoot
    */
  track() {
    var dx = this.x - this.targets[0].x;
    var dy = this.y - this.targets[0].y;
    //Draw a line to the target
    var distance = Math.sqrt(dx * dx + dy * dy);
    //Get the direction to the target
    var direction = Math.acos((dy)/ distance);
    //Mirror the angle for the left hand side
    if(dx > 0) {
      direction *= -1;
    }
    this.direction = direction;
  }

  update() {
    if(this.reloading) {
      this.rateOfFire--;
      if(this.rateOfFire <= 0) {
        this.rateOfFire = this.RATE;
        this.reloading = false;
      }
    }
  }

  render(ctx) {
    if(this.selected) {
      ctx.save();
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.closePath();
      ctx.save();
      ctx.globalAlpha = 0.50;
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    }
  }
}
