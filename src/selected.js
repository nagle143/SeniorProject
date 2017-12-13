

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
    this.x = object.x + 30;
  }

  update() {
    if(this.object.y > 500) {
      this.y = this.object.y - this.height;
    }
    else {
      this.y = this.object.y;
    }
    this.x = this.object.x + 30;
  }

  determineDisplay(ctx) {
    switch (this.type) {
      case 'tower':
        this.displayTowerInfo(ctx);
        break;
      case 'monster':
        this.displayMonsterInfo(ctx);
        break;
      default:

    }
  }

  displayTowerInfo(ctx) {
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

  displayMonsterInfo(ctx) {
    if(this.object.specials.length > 1) {
      this.height = 200;
    }
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.font = "12px Times New Roman";
    let tempX = this.x + 10;
    let yScaling = 20;
    if(this.y > 500) {
      yScaling *= -1;
    }
    ctx.strokeText(this.object.name, tempX, this.y + yScaling);
    ctx.strokeText("Health: " + this.object.health, tempX, this.y + yScaling * 2);
    ctx.strokeText("Shield: " + this.object.shield, tempX, this.y  + yScaling * 3);
    ctx.strokeText("Armor: " + this.object.armor, tempX, this.y  + yScaling * 4);
    ctx.strokeText("Speed: " + this.object.speed, tempX, this.y  + yScaling * 5);
    ctx.strokeText("Bounty: " + this.object.bounty, tempX, this.y  + yScaling * 6);
    for(let i = 0; i < this.object.specials.length; i++) {
      ctx.strokeText(this.object.specials[i], tempX, this.y  + yScaling * (i + 7));
    }
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
