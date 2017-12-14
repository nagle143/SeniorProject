
export default class BuildMenu {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.buttons = [];
    this.initButtons();
    this.button = new Image();
    this.button.src = 'Sprites/Button.png';
    this.info = [
      {name: 'Plasma Turret', description: 'Rapid Fire Energy Tower', cost: 25},
      {name: 'Rocket Launcher', description: 'Fires AOE Explosives', cost: 30},
      {name: 'Sentry Gun', description: 'Rapid Fire Physical Tower', cost: 25},
      {name: 'Rail Gun', description: 'Slow Firing Physical Tower', cost: 60},
      {name: 'Tesla', description: 'MultiTargeting Energy Tower', cost: 30},
      {name: 'Industrial Gluer', description: 'Mass Slowing Tower', cost: 35},
      {name: 'Flame Thrower', description: 'Cone Energy Tower', cost: 35}
    ];
  }

  initButtons() {
    let x = 810;
    let y = 50;
    let width = 140;
    let height = 55;
    let scaleY = height;
    for(let i = 0; i < 7; i++) {
      this.buttons.push({x: x, y: y, width: width, height: height});
      y += scaleY;
    }
  }

  displayStore(ctx) {
    ctx.save();
    ctx.font = 'bolder 16px arial';
    for(let i = 0; i < this.buttons.length; i++) {
      ctx.drawImage(this.button, this.buttons[i].x , this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
      ctx.fillStyle = 'black';
      ctx.fillText(this.info[i].name, this.buttons[i].x + 5, Math.round(this.buttons[i].y + this.buttons[i].height / 2) - 10);
      //ctx.fillText(this.info[i].description, this.buttons[i].x + 5, Math.round(this.buttons[i].y + this.buttons[i].height / 2));
      ctx.fillText('$' + this.info[i].cost, this.buttons[i].x + 5, Math.round(this.buttons[i].y + this.buttons[i].height / 2) + 10);
    }
    ctx.restore();
  }

  update() {

  }

  render(ctx) {
    this.displayStore(ctx);
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
