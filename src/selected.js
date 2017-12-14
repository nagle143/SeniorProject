

export default class Selected {
  constructor(object, type, name) {
    this.width = 100;
    this.height = 150;
    this.object = object;
    this.type = type;
    this.name = name;
    this.description = '';
    this.options = [];
    this.upgradeButtons = [];
    if(this.type === 'tower') {
      this.upgrades = this.object.upgrades;
      this.initButtons();
    }
    if(object.y > 500) {
      this.y = object.y - this.height;
    }
    else {
      this.y = object.y;
    }
    this.x = object.x + 30;
  }

  initButtons() {
    let x = 825;
    let y = 450;
    let width = 125;
    let height = 75;
    let scaleY = height + 10;
    for(let i = 0; i < this.upgrades.length; i++) {
      this.upgradeButtons.push({x: x, y: y, width: width, height: height});
      y += scaleY;
    }
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
    this.displayUpgrades(ctx);
  }

  determineUpgrades() {
    switch (this.name) {
      case 'Plasma Turret':
        this.description = 'Rapid Fire Energy Tower';
        this.options = ['Cooling System', 'Hotter Plasma', 'Improved Range', 'Nitrogen Cooling'];
        break;
      case 'Rocket Launcher':
        this.description = 'Fires AOE Explosives';
        this.options = ['Range Finder', 'Huge Explosives', 'Volatile', 'Plasma Grenades'];
        break;
      case 'Sentry Gun':
        this.description =  'Rapid Fire Physical Tower';
        this.options = ['.50 Cal', 'Multi-Targeting', 'Improved Range', 'Optimized'];
        break;
      case 'Rail Gun':
        this.description =  'Slow Firing Physical Tower';
        this.options = ['Dense Slugs', 'Hyper-Sonic', 'Improved Range', 'Cooling System'];
        break;
      case 'Tesla Tower':
        this.description =  'MultiTargeting Energy Tower';
        this.options = ['High Voltage', 'More Targets', 'Improved Range', 'Death Tower'];
        break;
      case 'Industrial Gluer':
        this.description =  'Mass Slowing Tower';
        this.options = ['Faster Production', 'Bigger Globs', 'Improved Range', 'Acid Glue'];
        break;
      case 'Flame Thrower':
        this.description =  'Cone Energy Tower';
        this.options = ['White Hot', 'Pyro-Maniac', 'Improved Range', 'Acid Fire'];
        break;
      default:
        console.log("Invalid Name");
    }
  }

  displayUpgrades(ctx) {
    this.determineUpgrades();
    ctx.save();
    ctx.font = '16px Times New Roman';
    for(let i = 0; i < this.upgrades.length; i++) {
      if(this.upgrades[i]) {
        ctx.fillStyle = 'green';
      }
      else {
        ctx.fillStyle = 'blue';
      }
      ctx.fillRect(this.upgradeButtons[i].x, this.upgradeButtons[i].y, this.upgradeButtons[i].width, this.upgradeButtons[i].height);
      ctx.fillStyle = 'black';
      ctx.fillText(this.options[i], this.upgradeButtons[i].x + 5, Math.round(this.upgradeButtons[i].y + this.upgradeButtons[i].height / 2));
    }
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
