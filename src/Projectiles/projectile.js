

export default class Projectile {
  constructor(x, y, damage, direction, range, type, target, size) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.direction = direction;
    this.range = range;
    this.type = type;
    this.mag = 3;
    this.speed = {x: 0, y: 0};
    this.size = Math.round(size * 0.005);
  }

  initSpeed() {
    this.speed.x = Math.sin(this.direction) * this.mag;
    this.speed.y = -Math.cos(this.direction) * this.mag;
  }

  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
