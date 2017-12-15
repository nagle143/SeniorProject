
/** @class Selected
* Object to determine what to do with a selected object
*/
export default class Selected {
  /** @constructor
  * Initialzes the selected object
  * @param {object} object - selected object
  * @param {string} type - type of the object selected
  * @param {string} name - name of the tower if it is one
  */
  constructor(object, type, name) {
    this.width = 130;
    this.height = 150;
    this.object = object;
    this.type = type;
    this.name = name;
    //currently never used, will be when I improve the tool tip
    this.description = '';
    this.options = [];
    this.prices = [];
    this.upgradeButtons = [];
    if(this.type === 'tower') {
      //Create the upgrade buttons
      this.upgrades = this.object.upgrades;
      this.initButtons();
    }
    //If the object is close to bottom, move the toop tip above it
    if(object.y > 500) {
      this.y = object.y - this.height;
    }
    else {
      this.y = object.y;
    }
    this.x = object.x + 30;
    //Load the images for the buttons
    this.button = new Image();
    this.button.onload = () => {

    }
    //Image for upgrades you don't have
    this.button.src = 'Sprites/Button.png';

    this.button2 = new Image();
    this.button2.onload = () => {

    }
    //Image for the button you do have
    this.button2.src = 'Sprites/ButtonGreen.png';

    this.image = new Image();
    this.image.onload = () => {
      //this.size = this.size * this.image.width/this.image.height;
    }
    //Image for the ToolTip displaying the object info
    this.image.src = 'Sprites/ToolTip.png';
  }

  /** @function initButton
  * funciton to initialze the buttons
  */
  initButtons() {
    let x = 810;
    let y = 450;
    let width = 140;
    let height = 75;
    let scaleY = height;
    for(let i = 0; i < this.upgrades.length; i++) {
      this.upgradeButtons.push({x: x, y: y, width: width, height: height});
      y += scaleY;
    }
  }

  /** @function update
  * Update the position of the ToolTip for moving objects, like monsters
  */
  update() {
    if(this.object.y > 500) {
      this.y = this.object.y - this.height;
    }
    else {
      this.y = this.object.y;
    }
    this.x = this.object.x + 30;
  }

  /** @function determineDisplay
  * funciton to check which type of object is being selected
  * @param {context} ctx - backBufferContext from game.js
  */
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

  /** @function displayTowerInfo
  * displays the info of the tower in the ToolTip
  * @param {context} ctx - backBufferContext from game.js
  */
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

  /** @function determineUpgrades
  * initialzes the upgrades for the towers to display onto the buttons
  */
  determineUpgrades() {
    switch (this.name) {
      case 'Plasma Turret':
        this.options = ['Cooling System', 'Hotter Plasma', 'Improved Range', 'Nitrogen Cooling'];
        this.prices = [20, 25, 30, 25];
        break;
      case 'Rocket Launcher':
        this.options = ['Range Finder', 'Huge Explosives', 'Volatile', 'Plasma Grenades'];
        this.prices = [30, 35, 40, 20];
        break;
      case 'Sentry Gun':
        this.options = ['Dense Rounds', 'Multi-Targeting', 'Improved Range', 'Optimized'];
        this.prices = [20, 35, 40, 30];
        break;
      case 'Rail Gun':
        this.options = ['Dense Slugs', 'Hyper-Sonic', 'Improved Range', 'Cooling System'];
        this.prices = [40, 40, 30, 30];
        break;
      case 'Tesla Tower':
        this.options = ['High Voltage', 'More Targets', 'Improved Range', 'Death Tower'];
        this.prices = [20, 30, 25, 50];
        break;
      case 'Industrial Gluer':
        this.options = ['Faster Production', 'Bigger Globs', 'Improved Range', 'Acid Glue'];
        this.prices = [30, 40, 30, 40];
        break;
      case 'Flame Thrower':
        this.options = ['Insane Heat', 'Pyro-Maniac', 'Improved Range', 'Acid Fire'];
        this.prices = [30, 50, 30, 40];
        break;
      default:
        console.log("Invalid Name");
    }
  }

  /** @function displayUpgrades
  * funciton to display the upgrade buttons
  * @param {context} ctx - backBufferContext from game.js
  */
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
      ctx.fillText(this.options[i], this.upgradeButtons[i].x + 5, Math.round(this.upgradeButtons[i].y + this.upgradeButtons[i].height / 2) - 10);
      ctx.fillText('$' + this.prices[i], this.upgradeButtons[i].x + 5, Math.round(this.upgradeButtons[i].y + this.upgradeButtons[i].height / 2) + 10);
    }
    ctx.restore();
  }

  /** @function displayMonsterInfo
  * funciton to display the monster stats in the ToolTip
  * @param {context} ctx - backBufferContext from game.js
  */
  displayMonsterInfo(ctx) {
    //If the monster has alot of specials extend the ToolTip
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


  /** @function render
  * funciton to display the ToolTip & call the other display funcitons
  */
  render(ctx) {
    ctx.save();
    ctx.save();
    //Make the ToolTip Slightly transparent
    ctx.globalAlpha = 0.40;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
    ctx.restore();
    this.determineDisplay(ctx);
  }
}
