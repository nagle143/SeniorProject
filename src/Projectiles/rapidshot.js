import Projectile from './projectile.js';

export default class RapidShot extends Projectile {
  constructor(x, y, damage, direction, range, type, target, size) {
    super(x, y, damage, direction, range, type, target, size);
    this.mag = 5;
    this.startPosition = {x: x, y: y};
    this.target = target;
    this.type = 'energy';
    this.effect = null;
    super.initSpeed();
  }

  seek() {
  var dx = this.x - this.target.x;
  var dy = this.y - this.target.y;
  //Draw a line to the target
  var distance = Math.sqrt(dx * dx + dy * dy);
  //Get the direction to the target
  var direction = Math.acos((dy)/ distance);
  //Mirror the angle for the left hand side
  if(dx > 0) {
    direction *= -1;
  }
  this.direction = direction;
  this.speed.x = Math.sin(this.direction) * this.mag;
  this.speed.y = -Math.cos(this.direction) * this.mag;
  }

  update() {
    this.seek();
    super.update();
    let dx = this.x - this.startPosition.x;
    let dy = this.y - this.startPosition.y;
    let dist = dx * dx + dy * dy;
    if(Math.abs(this.x - this.target.x) < this.target.size * 0.80 && Math.abs(this.y - this.target.y) < this.target.size * 0.80) {
      return true;
    }
    if(Math.sqrt(dist) >= this.range * 1.25) {
      return true;
    }
    return false;
  }

  render(ctx) {
    ctx.strokeStyle = 'blue';
    super.render(ctx);
  }
}
