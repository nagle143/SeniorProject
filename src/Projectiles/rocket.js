import Projectile from './projectile.js';

export default class Rocket extends Projectile {
  constructor(x, y, damage, direction, range, type, effect, target, size, upgrades) {
    super(x, y, damage, direction, range, type, effect, target, size, upgrades);
    this.mag = 3;
    this.startPosition = {x: x, y: y};
    this.target = target;
    this.type = 'kinetic';
    this.life = 0;
    this.explosion = 3;
    this.size = Math.round(size * 0.01);
    super.initSpeed();
    this.applyUpgrades(upgrades);
  }

  applyUpgrades(upgrades) {
    if(upgrades[1]) {
      this.explosion *= 2;
    }
  }

  explode() {
    this.size *= this.explosion;
    this.mag = 0;
    this.life = 1;
  }

  changeType() {
    this.type = 'energy';
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
    if(this.life === 1) {
      return  true;
    }
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
    super.render(ctx);
  }
}
