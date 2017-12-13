import Sprite from '../sprite.js';



export default class Enemy {
  constructor(x, y, speed, health, armor, specials, shield, track, size, color) {
    //Postion variables
    this.x = x;
    this.y = y;
    this.track = track;
    this.checkpoint = 1;
    //Direction the monster is traveling
    this.direction = Math.getDirection(this.x, this.y, this.track[1].x, this.track[1].y);
    //Speed of the monster
    this.speed = speed;
    this.velocity = {x: Math.sin(this.direction) * this.speed, y: -Math.cos(this.direction) * this.speed};
    //Basic Properties
    this.MAXHP = health;
    this.health = this.MAXHP;
    this.regeneration = Math.round(this.MAXHP * 0.01);
    this.REGEN = 60;
    this.regenTimer = this.REGEN;
    this.armor = armor;
    this.MAXSHIELD = shield;
    this.shield = this.MAXSHIELD;
    this.RECHARGE = 120;
    this.rechargeRate = this.RECHARGE;
    this.specials = specials;
    this.applySpecials();
    this.statusEffects = [];
    this.bounty = Math.round(this.MAXHP * 0.10 * (this.specials.length + 1));
    //Name Property
    this.name = "";
    this.color = color;
    //Size of the monster
    this.size = Math.round(size * 0.01);
    this.selected = false;
    this.sprite = new Sprite('Test', this.direction);
  }

  calculateMove(modifier) {
    this.velocity.x = Math.sin(this.direction) * this.speed * modifier;
    this.velocity.y = -Math.cos(this.direction) * this.speed * modifier;
  }

  applySpecials() {
    this.specials.forEach(special => {
      switch (special) {
        case "Titanium Alloys":
          this.armor *= 2;
          break;
        case "Over-Clocked":
          this.speed *= 1.5;
          break;
        case "Nano-Bots":
          this.regeneration = Math.round(this.MAXHP * 0.03);
          this.REGEN = Math.round(this.REGEN / 1.75);
          this.regenTimer = this.REGEN;
          break;
        case "Enhanced Power Supply":
          this.MAXSHIELD *= 2;
          this.shield = this.MAXSHIELD;
          this.RECHARGE /= 2;
          this.rechargeRate = this.RECHARGE;
          break;
        default:
      }
    });
  }

  addStatusEffect(status) {
    for(let i = 0; i < this.statusEffects.length; i++) {
      if(status.name === this.statusEffects[i].name) {
        this.statusEffects[i].timer = status.timer;
      }
      else {
        this.statusEffects.push(status);
      }
    }
  }

  checkpointCheck(checkpoint) {
    var dx = this.x - checkpoint.x;
    var dy = this.y - checkpoint.y;
    if(dx * dx + dy * dy <= (this.size * 0.5) * (this.size * 0.5)) {
      return true;
    }
    return false;
  }

  hit(damage, type, effect) {

    if(this.shield > 0) {
      if(type === 'energy') {
        this.shield -= Math.round(damage * 1.25);
        if(this.shield < 0) {
          this.health -= Math.round(this.shield / 2 - this.armor * 2);
          this.shield = 0;
        }
      }
      else if (type === 'kinetic') {
        this.shield -= Math.round(damage * 0.75);
        if(this.shield < 0) {
          this.health -= Math.round(this.shield * 1.25 - this.armor * 2);
          this.shield = 0;
        }
      }
    }
    else {
      if(type === 'energy') {
        this.health -= Math.round(damage * 0.75 - this.armor * 2);
      }
      else if (type === 'kinetic') {
        this.health -= Math.round(damage * 1.25 - this.armor * 2);
      }
    }
    if(this.health <= 0) {
      return true;
    }
    return false;
  }

  update() {
    //Pathing
    this.sprite.update();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if(this.checkpointCheck(this.track[this.checkpoint])) {
      this.checkpoint++;
      if(this.checkpoint < this.track.length) {
        this.direction = Math.getDirection(this.x, this.y, this.track[this.checkpoint].x, this.track[this.checkpoint].y);
        this.calculateMove(1.00);
      }
      else {
        return true;
      }
    }

    //Status Efects
    /*for(let i = 0; i < this.statusEffects.length; i++) {
      this.statusEffects.timer--;
    }*/

    //Heatlh regeneration
    this.regenTimer--;
    if(this.regenTimer <= 0) {
      this.health += this.regeneration;
      if(this.health > this.MAXHP) {
        this.health = this.MAXHP;
      }
      this.regenTimer = this.REGEN;
    }

    //Shield regeneration
    if(this.shield > 0) {
      this.rechargeRate--;
      if(this.rechargeRate <= 0) {
        this.shield += Math.round(this.MAXSHIELD * 0.05);
        if(this.shield > this.MAXSHIELD) {
          this.shield = this.MAXSHIELD;
        }
        this.rechargeRate = this.RECHARGE;
      }
    }
    return false;
  }

  render(ctx) {
    this.sprite.render(ctx, this.x, this.y);
    /*
    ctx.save();
    if(this.selected) {
      ctx.strokeStyle ='white';
    }
    else {
      ctx.strokeStyle = this.color;
    }
    ctx.fillStyle = 'red';
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fillRect(-this.size * 0.5, -this.size * 1.6, 1.5 * this.size * (this.health / this.MAXHP), this.size * 0.5);
    ctx.restore();*/
  }
}
