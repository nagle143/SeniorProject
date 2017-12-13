import Animation from './animation.js';

export default class Sprite {
  constructor(name, direction) {
    this.animations = {
      'walk': new Animation('Sprites/' + name, '_WALK', direction, true),
      'flicker': new Animation('Sprites/' + name, 'FLICKER', direction, true)
    }
    this.state = 'walk';
  }

  setState(newState) {
    this.state = newState;
    this.animations[newState].reset();
  }

  update() {
    this.animations[this.state].advance();
  }

  render(ctx, x, y) {
    this.animations[this.state].render(ctx, x, y);
  }
}
