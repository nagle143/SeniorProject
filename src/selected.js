

export default class Selected {
  constructor(object, type) {
    this.width = 100;
    this.height = 150;
    this.object = object;
    this.type = type;
    if(object.y > 500) {
      this.y = object.y - this.height;
    }
    else {
      this.y = object.y;
    }
    this.x = object.x
  }

  update() {
    if(this.object.y > 500) {
      this.y = this.object.y - this.height;
    }
    else {
      this.y = this.object.y;
    }
    this.x = this.object.x;
  }

  determineDisplay(ctx) {
    switch (this.type) {
      case 'tower':
        this.displayTowerInfo(ctx);
        break;
      default:

    }
  }

  displayTowerInfo(ctx) {
    console.log('here');
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.font = "12px Times New Roman";
    let tempX = this.x + 10;
    let yScaling = 20;
    if(this.y > 500) {
      yScaling *= -1;
    }
    ctx.strokeText(this.object.name, tempX, this.y + yScaling);
    ctx.strokeText("Min D: " + this.object.minDamage, tempX, this.y + yScaling * 2);
    ctx.strokeText("Max D: " + this.object.maxDamage, tempX, this.y  + yScaling * 3);
    ctx.strokeText("Rate: " + +(60 / this.object.RATE).toFixed(2), tempX, this.y  + yScaling * 4);
    ctx.strokeText("Value: " + this.object.value, tempX, this.y  + yScaling * 5);
    ctx.restore();
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.save();
    ctx.globalAlpha = 0.50;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
    ctx.restore();
    this.determineDisplay(ctx);
  }
}
