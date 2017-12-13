import Enemy from "./Enemies/enemy.js";

export default class MonsterController {
  constructor(waves, track, size) {
    this.enemies = [];
    this.generated = [];
    this.index = 0;
    this.track = track;
    this.wave = 1;
    this.INBETWEEN = 600;
    this.inbetweenTimer = 0;
    this.SPAWN = 30;
    this.spawnTimer = this.SPAWN;
    this.size = size;
    this.randomWave();
  }

  //x, y, speed, health, armor, specials, shield, size, color
  randomWave() {
    let numMonsters = Math.randomInt(5 + this.wave * 2, 10 + this.wave * 2);
    for(let i = 0; i < numMonsters; i++) {
      let specials = [];
      let random = Math.random();
      //Three special
      if(random > 0.95 - this.wave * 2 / 100) {
        specials = this.randomSpecials(3);
      }
      //Two specials
      else if (random > 0.80 - this.wave * 2 / 100) {
        specials = this.randomSpecials(2);
      }
      //One Specials
      else if (random > 0.60 - this.wave * 2 / 100) {
        specials = this.randomSpecials(1);
      }
      this.generated.push({x: this.track[0].x, y: this.track[0].y, speed: 0.75, health: Math.round((25 + this.wave) * 1.5), armor: Math.round((2 + this.wave) * 1.10), properties: specials, path: this.track, shield: Math.round((10 + this.wave) * 1.50), color: 'red'});
    }
    console.log(this.generated);
  }

  randomSpecials(num) {
    let specials = [];

    while(specials.length < num) {
      let random = Math.randomInt(0, 5);
      let check = false;
      let temp = null;
      switch (random) {
        case 0:
          temp = "Titanium Alloys";
          break;
        case 1:
          temp = "Nano-Bots";
          break;
        case 2:
          temp = "Over-Clocked";
          break;
        case 3:
          temp = "Enhanced Power";
          break;
        case 4:
          temp = "Enclosed Gears";
          break;
        case 5:
          temp = "Heat Sync";
          break;
      }
      for(let j = 0; j < specials.length; j++) {
        if(temp === specials[j]) {
          check = true;
          break;
        }
      }
      if(!check) {
        specials.push(temp);
      }
    }
    //console.log(specials);
    return specials
  }

  update() {
    if(this.generated.length > 0 && this.inbetweenTimer <= 0) {
      this.spawnTimer--;
      if(this.spawnTimer <= 0 && this.enemies.length < this.generated.length) {
        this.enemies.push(new Enemy(this.generated[this.index].x, this.generated[this.index].y, this.generated[this.index].speed,
          this.generated[this.index].health, this.generated[this.index].armor, this.generated[this.index].properties, this.generated[this.index].shield, this.generated[this.index].path, this.size, this.generated[this.index].color));
        this.index++;
        this.spawnTimer = this.SPAWN;
        if(this.index >= this.generated.length) {
          this.generated = [];
        }
      }
    }
    if(this.generated.length === 0 && this.enemies.length === 0) {
      this.wave++;
      this.randomWave();
      this.inbetweenTimer = this.INBETWEEN;
      this.spawnTimer = this.SPAWN;
      this.index = 0;
    }
    if(this.inbetweenTimer !== 0) {
      this.inbetweenTimer--;
    }
  }

  render(ctx) {
    this.enemies.forEach(enemy => {
      enemy.render(ctx);
    });
  }
}
