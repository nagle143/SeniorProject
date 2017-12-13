

export default class Animation {
  constructor(path, name, direction, looping) {
    this.images = [];
    for(let i = 0; i < 3; i++) {
      let image = new Image();
      this.height = 50;
      image.onload = () => {
        this.width = this.height * image.width/image.height;
      }
      image.src = path + name + '_0' + i + '.png';
      this.images.push(image);
    }
    this.frame = 0;
    this.rate = 3;
    this.counter = 0;
    this.looping = looping;
    //Objects that rotate
    this.direction = 0.0
    this.facing = 'right';
  }

  advance() {
    this.direction += 0.01;
    if(this.direction >= Math.PI * 2) {
      this.direction = 0.0;
    }
    if(this.counter > this.rate) {
      this.frame++;
      if(this.frame >= this.images.length) {
        if(this.looping) {
          this.frame = 0;
        }
        else {
          this.frame = this.images.length - 1;
        }
      }
      this.counter = 0;
    }
    this.counter++;
  }

  reset() {
    this.counter = 0;
    this.frame = 0;
  }

  render(ctx, x, y) {
    if(this.images[this.frame]) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.direction);
      ctx.drawImage(this.images[this.frame], -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }
}
