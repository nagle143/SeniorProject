import Sprite from '../sprite.js';

/** @class
* class to determine the monsters
*/
export default class Enemy {
  /** @constructor
  * initialzes the monsters properties
  * @param {int} x - x position
  * @param {int} y - y position
  * @param {int} speed - speed of the monster
  * @param {int} health - max health of the monster
  * @param {int} armor - armor of the monster, each point of armor -2 damage received
  * @param {array of strings} specials - array of special properties that modify the monsters base stats
  * @param {int} shield - max shield of the monster, armor doesn't apply to shields
  * @param {array of points} track - path the monsters should be taking
  * @param {int} size - size the monster should scale to
  * @param {string} color - color the monster should be, no longer used
  * NOTE: Shields take more damage from energy attacks & less from kinetic attacks, shields also block status effects
  * NOTE: Monsters without shields take more damage from kinetic attacks and less damage from energy attacks
  */
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
    this.speedModifer = 1.00;
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
    this.RECHARGE = 60;
    this.rechargeRate = this.RECHARGE;
    this.specials = specials;
    this.applySpecials();
    this.statusEffects = [];
    //value you get from killing the monster
    this.bounty = Math.round(this.MAXHP * 0.10 * (this.specials.length + 1));
    //Name Property
    //currently no other types
    this.name = "Robot";
    this.color = color;
    //Size of the monster
    this.size = Math.round(size * 0.01);
    this.selected = false;
    //To make sure other objects delete their ties to this object
    this.dead = false;
    //Sprite of the robot
    this.sprite = new Sprite('Test', this.direction);
  }

  calculateMove() {
    this.velocity.x = Math.sin(this.direction) * this.speed * this.speedModifer;
    this.velocity.y = -Math.cos(this.direction) * this.speed * this.speedModifer;
  }

  applySpecials() {
    this.specials.forEach(special => {
      switch (special) {
        //Double armor
        case "Titanium Alloys":
          this.armor *= 2;
          break;
        // +50% move speed
        case "Over-Clocked":
          this.speed *= 1.5;
          break;
        //Large improvement on Regenerating health
        case "Nano-Bots":
          this.regeneration = Math.round(this.MAXHP * 0.06);
          this.REGEN = Math.round(this.REGEN / 1.75);
          this.regenTimer = this.REGEN;
          break;
        //Shields recharge much faster
        case "Enhanced Power":
          this.MAXSHIELD *= 2;
          this.shield = this.MAXSHIELD;
          this.RECHARGE /= 2;
          this.rechargeRate = this.RECHARGE;
          break;
        default:
      }
    });
  }

  addStatusEffects(effects) {
    effects.forEach(status => {
      let check = false;
      for(let i = 0; i < this.statusEffects.length; i++) {
        if(status === this.statusEffects[i].name) {
          //Non refreshing status effects
          if(status !== 'acid' || status !== 'burn') {
            this.statusEffects[i].timer = 60;
          }
          check = true;
          break;
        }
      }
      //New Status effect
      if(!check) {
        if(status === 'acid') {
          this.statusEffects.push({name: status, timer: 10})
        }
        else {
          this.statusEffects.push({name: status, timer: 120});
        }
      }
    });
  }

  applyStatusEffects() {
    for(let i = 0; i < this.statusEffects.length; i++) {
      switch (this.statusEffects[i].name) {
        //Slow movement by 50%
        case 'slow':
          this.speedModifer = 0.50;
          this.statusEffects[i].timer--;
          if(this.statusEffects[i].timer <= 0) {
            this.speedModifer = 1.00;
            this.statusEffects.splice(i, 1);
          }
          this.calculateMove();
          break;
        //Tick damage every 10 frames
        case 'burn':
          if(this.statusEffects[i].timer % 10 === 0) {
            let damage = 6 - this.armor * 2;
            if(damage > 0) {
              this.health -= damage;
            }
          }
          this.statusEffects[i].timer--;
          break;
        //Reomve 1 armor every 5 frames
        case 'acid':
          if(this.statusEffects[i].timer % 5 === 0) {
            this.armor--;
            if(this.armor < 0) {
              this.armor = 0;
            }
          }
          this.statusEffects[i].timer--;
          break;
        default:

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
    let damageTaken = 0;
    if(this.shield > 0) {
      if(type === 'energy') {
        this.shield -= Math.round(damage * 1.25);
        if(this.shield < 0) {
          damageTaken = Math.round(this.shield * 0.75 + this.armor * 2);
          if(damageTaken < 0) {
            this.health += damageTaken;
          }
          this.shield = 0;
        }
      }
      else if (type === 'kinetic') {
        this.shield -= Math.round(damage * 0.75);
        if(this.shield < 0) {
          damageTaken = Math.round(this.shield * 1.25 + this.armor * 2);
          if(damageTaken < 0) {
            this.health += damageTaken;
          }
          this.shield = 0;
        }
      }
    }
    else {
      if(effect) {
        this.addStatusEffects(effect);
      }
      if(type === 'energy') {
        damageTaken = Math.round(damage * 0.75 - this.armor * 2);
        if(damageTaken > 0) {
          this.health -= damageTaken;
        }
      }
      else if (type === 'kinetic') {
        damageTaken = Math.round(damage * 1.25 - this.armor * 2);
        if(damageTaken > 0) {
          this.health -= damageTaken;
        }
      }
    }
  }

  update() {
    //Pathing
    this.sprite.update();
    if(this.statusEffects.length > 0) {
      this.applyStatusEffects();
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if(this.checkpointCheck(this.track[this.checkpoint])) {
      this.checkpoint++;
      if(this.checkpoint < this.track.length) {
        this.direction = Math.getDirection(this.x, this.y, this.track[this.checkpoint].x, this.track[this.checkpoint].y);
        this.calculateMove(this.speedModifer);
      }
      else {
        this.dead = true;
        return 'end';
      }
    }

    if(this.health <= 0) {
      this.dead = true;
      return 'killed'
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
