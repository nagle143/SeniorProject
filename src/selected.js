

export default class Selected {
  constructor(object, type, name) {
    this.width = 130;
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
    this.button = new Image();
    this.button.onload = () => {

    }
    this.button.src = 'Sprites/Button.png';
    this.button2 = new Image();
    this.button2.onload = () => {

    }
    this.button2.src = 'Sprites/ButtonGreen.png';
    this.image = new Image();
    this.image.onload = () => {
      //this.size = this.size * this.image.width/this.image.height;
    }
    this.image.src = 'Sprites/ToolTip.png';
  }

  initButtons() {
    let x = 810;
    let y = 450;
    let width = 140;
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
    ctx.fillStyle = 'black';
    ctx.font = "bolder 14px Arial";
    let tempX = this.x + 10;
    let yScaling = 20;
    if(this.y > 500) {
      yScaling *= -1;
    }
    ctx.fillText(this.object.name, tempX, this.y + yScaling);
    ctx.fillText("Min D: " + this.object.minDamage, tempX, this.y + yScaling * 2);
    ctx.fillText("Max D: " + this.object.maxDamage, tempX, this.y  + yScaling * 3);
    ctx.fillText("Rate: " + +(60 / this.object.RATE).toFixed(2), tempX, this.y  + yScaling * 4);
    ctx.fillText("Value: " + this.object.value, tempX, this.y  + yScaling * 5);
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
        this.options = ['Dense Rounds', 'Multi-Targeting', 'Improved Range', 'Optimized'];
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
        this.options = ['Insane Heat', 'Pyro-Maniac', 'Improved Range', 'Acid Fire'];
        break;
      default:
        console.log("Invalid Name");
    }
  }

  displayUpgrades(ctx) {
    this.determineUpgrades();
    ctx.save();
    ctx.font = 'bolder 14px arial';
    for(let i = 0; i < this.upgrades.length; i++) {
      if(this.upgrades[i]) {
          ctx.drawImage(this.button2, this.upgradeButtons[i].x, this.upgradeButtons[i].y, this.upgradeButtons[i].width, this.upgradeButtons[i].height);
      }
      else {
          ctx.drawImage(this.button, this.upgradeButtons[i].x, this.upgradeButtons[i].y, this.upgradeButtons[i].width, this.upgradeButtons[i].height);
      }

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
    ctx.fillStyle = 'black';
    ctx.font = "bolder 14px Arial";
    let tempX = this.x + 10;
    let yScaling = 20;
    if(this.y > 500) {
      yScaling *= -1;
    }
    ctx.fillText(this.object.name, tempX, this.y + yScaling);
    ctx.fillText("Health: " + this.object.health, tempX, this.y + yScaling * 2);
    ctx.fillText("Shield: " + this.object.shield, tempX, this.y  + yScaling * 3);
    ctx.fillText("Armor: " + this.object.armor, tempX, this.y  + yScaling * 4);
    ctx.fillText("Speed: " + this.object.speed, tempX, this.y  + yScaling * 5);
    ctx.fillText("Bounty: " + this.object.bounty, tempX, this.y  + yScaling * 6);
    for(let i = 0; i < this.object.specials.length; i++) {
      ctx.fillText(this.object.specials[i], tempX, this.y  + yScaling * (i + 7));
    }
    ctx.restore();
  }


  render(ctx) {
    ctx.save();
    ctx.save();
    ctx.globalAlpha = 0.40;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
    ctx.restore();
    this.determineDisplay(ctx);
  }
}
