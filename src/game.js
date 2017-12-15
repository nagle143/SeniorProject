//Import Files
import RapidFire from "./Towers/rapidfire.js";
import RapidShot from "./Projectiles/rapidshot.js";
import RocketLauncher from "./Towers/rocketlauncher.js";
import Rocket from "./Projectiles/rocket.js";
import Sentry from "./Towers/sentry.js";
import RailGun from "./Towers/railgun.js";
import Tesla from "./Towers/tesla.js";
import GlueMachine from "./Towers/gluemachine.js";
import FlameThrower from "./Towers/flamethrower.js";

import Particle from "./particles.js";

import Map from "./maps.js";
import MonsterController from "./monstercontroller.js";
import Selected from './selected.js';
import Money from './money.js';
import BuildMenu from './buildmenu.js';
//import Enemy from './Enemies/enemy.js';

/** @function Math.randomBetween
  * Math prototype function built to easily create ranom floats
  * @param {float} min - the lowest number you want
  * @param {float} max - the highest number you want (I beleive it is non-inclusive)
  * @returns random float between the parameters
  */
Math.randomBetween = function (min, max) {
  return Math.random() * (max - min) + min;
};

/** @function Math.randomInt
  * Math prototype function built to easily create random integers
  * @param {float} min - the lowest number you want
  * @param {float} max - the highest number you want (I beleive it is non-inclusive)
  * @returns random integer between the parameters
  */
Math.randomInt = function (min, max) {
  let lowest = Math.floor(min);
  let highest = Math.ceil(max);
  return Math.round(Math.random() * (highest - lowest)) + lowest;
};

Math.getDirection = function(x, y, x2, y2) {
  let dx = x - x2;
  let dy = y - y2;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let direction = Math.acos(dy/dist);
  if(dx > 0) {
    direction *= -1;
  }
  return direction;
}

/** @class Game
  * Represents a collection of all the game objects and handles most if not all of the game logic
  */
export default class Game {
  /** @constructor
    * Game object constructor, initializes all the most important objects for the game
    * @param {int} screenWidth - the width of the screen in pixels
    * @param {int} screenHeight - the height of the screen in pixels
    */
  constructor(screenWidth, screenHeight, mode) {
    //Property to hold the size of the display & allow dynamic sizing of objects
    this.size = {width: screenWidth, height: screenHeight};
    //Object Arrays
    this.projectiles = [];
    this.towers = [];
    this.particles = [];
    this.mode = null;
    this.map = null;
    this.initMode(mode);
    this.monstercontroller = new MonsterController('wave', this.map.path, this.size.width);
    //Important variables
    this.lives = 30;
    this.kills = 0;
    this.money = new Money(100);
    this.selected = null;
    this.BuildMenu = null;
    this.mouseMode = 'selecting';
    this.paused = false;
    this.gameOver = false;

    //Back Buffer
    this.backBufferCanvas = document.getElementById("canvas");
    this.backBufferCanvas.width = screenWidth * 1.2;
    this.backBufferCanvas.height = screenHeight;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');

    //Canvas that actually gets put on the screen
    this.screenBufferCanvas = document.getElementById("canvas");
    this.screenBufferCanvas.width = screenWidth * 1.2;
    this.screenBufferCanvas.height = screenHeight;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

    //Binders
    this.loop = this.loop.bind(this);
    this.render = this.render.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.onkeydown = this.handleKeyDown;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.screenBufferCanvas.onmousedown = this.handleMouseDown;
    this.screenBufferCanvas.onmouseup = this.handleMouseUp;

    //Audio
    //Found this Wav file @ https://freesound.org/people/joshuaempyre/sounds/251461/
    this.theme = new Audio('Sound/theme.wav');
    this.theme.volume = 0.2;
    this.theme.loop = true;
    this.theme.play();

    //100fps
    this.interval = setInterval(this.loop, 1000/60);
  }

  reset() {
    this.projectiles = [];
    this.towers = [];
    this.particles = [];
    this.mode = null;
    this.map = null;
    this.initMode('well');
    this.monstercontroller = new MonsterController('wave', this.map.path, this.size.width);
    //Important variables
    this.lives = 30;
    this.kills = 0;
    this.money = new Money(100);
    this.selected = null;
    this.BuildMenu = null;
    this.mouseMode = 'selecting';
    this.paused = false;
    this.gameOver = false;
    this.theme.volume = 0.2;
    this.theme.loop = true;
    this.theme.play();
  }

  //Mouse Events
  handleMouseDown(event) {
    event.preventDefault();
    switch (this.mouseMode) {
      case 'selecting':
        this.getObject(event.clientX, event.clientY);
        break;
      case 'build':
        this.checkSpot(event.clientX, event.clientY);
        break;
      default:
    }
  }

  handleKeyDown(event) {
    event.preventDefault();
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 66:
        this.mouseMode = 'build';
        if(this.selected) {
          this.selected.object.selected = false;
          this.selected = null;
        }
        break;
      case 27:
        this.mouseMode = 'selecting';
        this.BuildMenu = null;
        break;
      case 32:
        if(this.paused) {
          this.paused = false;
        }
        else {
          this.paused = true;
        }
        break;
      case 192:
        this.theme.pause();
        this.reset();
        break;
      default:

    }
  }

  getObject(x, y) {
    let found = false;
    if(this.selected) {
      //setting the selected objects bool of being selected to false
      for(let i = 0; i < this.selected.upgradeButtons.length; i++) {
        if(this.circleRectangleCollision(x, y, 2, this.selected.upgradeButtons[i].x, this.selected.upgradeButtons[i].y, this.selected.upgradeButtons[i].width, this.selected.upgradeButtons[i].height)) {
          found = true;
          if(!this.selected.object.upgrades[i] && this.selected.prices[i] <= this.money.money) {
            this.money.money -= this.selected.prices[i];
            this.selected.object.value += Math.round(this.selected.prices[i] * 0.70);
            this.selected.object.applyUpgrade(i);
          }
          break;
        }
      }
      if(!found) {
        this.selected.object.selected = false;
        this.selected = null;
      }
    }
    this.towers.forEach(tower => {
      if(this.circleCollisionDetection(x, y, 2, tower.x, tower.y, tower.size)) {
        //this.selected = {object: tower, type: 'tower'};
        this.selected = new Selected(tower, 'tower', tower.name);
        tower.selected = true;
        found = true;
      }
    });
    if(found) {
      return;
    }
    this.monstercontroller.enemies.forEach(monster => {
      if(this.circleCollisionDetection(x, y, 4, monster.x, monster.y, monster.size)) {
          this.selected = new Selected(monster, 'monster');
          monster.selected = true;
          found = true;
      }
    });
    if(found) {
      return;
    }
    if(this.BuildMenu) {
      for(let i = 0; i < this.BuildMenu.buttons.length; i++) {
        if(this.circleRectangleCollision(x, y, 2, this.BuildMenu.buttons[i].x, this.BuildMenu.buttons[i].y, this.BuildMenu.buttons[i].width, this.BuildMenu.buttons[i].height)) {
          found = true;
          if(this.money.money >= this.BuildMenu.info[i].cost) {
            this.money.money -= this.BuildMenu.info[i].cost;
            this.createTower(i);
          }
          break;
        }
      }
    }
  }

  checkSpot(x, y) {
    let blocked = false;
    if(x > 750 || x < 50) {
      return;
    }
    if(y < 50 || y > 750) {
      return;
    }
    for(let i = 0; i < this.towers.length; i++) {
      if(this.circleCollisionDetection(x, y, this.towers[i].size, this.towers[i].x, this.towers[i].y, this.towers[i].size)) {
        blocked = true;
        break;
      }
    }
    if(blocked) {
      this.mouseMode = 'selecting';
      return;
    }
    for(let i = 0; i < this.map.tiles.length; i++) {
      if(this.circleRectangleCollision(x, y, 20, this.map.tiles[i].x, this.map.tiles[i].y, 50, 50)) {
        blocked = true;
        break;
      }
    }
    if(blocked) {
      this.mouseMode = 'selecting';
      return;
    }
    this.BuildMenu = new BuildMenu(x, y);
    this.mouseMode = 'selecting';
  }

  handleMouseUp(event) {
    event.preventDefault();
  }

  checkSelected(object) {
    if(this.selected.object === object) {
      this.selected = null;
    }
  }

  initMode(mode) {
    this.map = new Map(this.size.width, this.size.height, 'random');
  }

  /** @function circleCollisionDetection
    * Function to detect collisions between two circles, kept as general
    * as possible for maximun versatility
    * @param {float} x1 - x position of object 1
    * @param {float} y1 - y position of object 1
    * @param {int/float} r1 - radius of object 1
    * @param {float} x2 - x position of object 2
    * @param {float} y2 - y position of object 2
    * @param {int/float} r2 - radius of object 2
    */
  circleCollisionDetection(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    //Quick check to avoid having to square things
    if(dx > r1 + r2 || dy > r1 + r2) {
      return false;
    }
    //More accurate check
    if(dx * dx + dy * dy >= (r1 + r2) * (r1 + r2)) {
      return false;
    }
    return true;
  }

  circleRectangleCollision(cx, cy, cr, rx, ry, rw, rh) {
    //Find the center of the button
    let rec = {x: rx + rw / 2, y: ry + rh / 2}
    //Distances between centers
    let dx = Math.abs(cx - rec.x);
    let dy = Math.abs(cy - rec.y);

    //Broad distance check
    if (dx > (rw / 2 + cr)) { return false; }
    if (dy > (rh / 2 + cr)) { return false; }

    //Single dimension checks
    if (dx <= (rw / 2)) { return true; }
    if (dy <= (rh / 2)) { return true; }

    //Corner Check
    let dist = Math.pow((dx - rw / 2) , 2) + Math.pow((dy - rh / 2), 2);
    return (dist <= (cr * cr));
  }

  createTower(ID) {
    switch (ID) {
      case 0:
        this.towers.push(new RapidFire(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 1:
        this.towers.push(new RocketLauncher(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 2:
        this.towers.push(new Sentry(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 3:
        this.towers.push(new RailGun(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 4:
        this.towers.push(new Tesla(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 5:
        this.towers.push(new GlueMachine(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      case 6:
        this.towers.push(new FlameThrower(this.BuildMenu.x, this.BuildMenu.y, this.size.width));
        break;
      default:

    }
    this.BuildMenu = null;
  }

  createProjectile(tower, enemy, direction) {
    let x = 0;
    let y = 0;
    let damage = Math.randomInt(tower.minDamage, tower.maxDamage + 1);
    //This is to keep the projectiles from upgrading mid flight
    let upgrades = [];
    tower.upgrades.forEach(upgrade => {
      upgrades.push(upgrade);
    });
    switch (tower.name) {
      case "Plasma Turret":
        x = tower.x + Math.sin(direction) * tower.size * 0.60;
        y = tower.y - Math.cos(direction) * tower.size * 0.60;
        this.projectiles.push(new RapidShot(x, y, damage, direction, tower.range, tower.type, tower.effect, enemy, this.size.width, upgrades));
        break;
      case "Rocket Launcher":
      case "Industrial Gluer":
        x = tower.x + Math.sin(direction) * tower.size;
        y = tower.y - Math.cos(direction) * tower.size;
        this.projectiles.push(new Rocket(x, y, damage, direction, tower.range, tower.type, tower.effect, enemy, this.size.width, upgrades));
        break;
      default:

    }
  }

  fire(numParticles, color, tower) {
    let x = 0;
    let y = 0;
    let random = 0;
    for(let i = 0; i < numParticles; i++) {
      random = Math.randomBetween(tower.direction - Math.PI / 8, tower.direction + Math.PI / 8);
      x = tower.x + Math.sin(random) * tower.size;
      y = tower.y - Math.cos(random) * tower.size;
      this.particles.push(new Particle (x, y, random, Math.randomInt(2, 3) , color, 50, tower.range));
    }
  }

  rail(numParticles, color, tower) {
    let x = 0;
    let y = 0;
    let random = 0;
    for(let i = 0; i < numParticles; i++) {
      let test = Math.randomBetween(10, tower.range);
      x = tower.x + Math.sin(tower.direction) * test;
      y = tower.y - Math.cos(tower.direction) * test;
      if(Math.random() > 0.50) {
        random = tower.direction + Math.PI / 8;
      }
      else {
        random = tower.direction - Math.PI / 8;
      }
      this.particles.push(new Particle(x, y, random, 1, color, 30, 30));
    }
  }

  shoot(tower, enemy) {
    tower.reloading = true;
    let direction = 0.0;
    let random = 0;
    let damage = Math.randomInt(tower.minDamage, tower.MaxDamage + 1);
    switch (tower.name) {
      case 'Plasma Turret':
      case 'Rocket Launcher':
      case 'Industrial Gluer':
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        tower.direction = direction;
        this.createProjectile(tower, enemy, direction);
        break;
      case 'Sentry Gun':
      case 'Rail Gun':
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        tower.direction = direction;
        enemy.hit(damage, tower.type, tower.effect);
        random = Math.randomInt(4, 6)
        for(let i = 0; i < random; i++) {
          if(tower.upgrades[0] || tower.upgrades[1]) {
            this.rail(Math.randomInt(4, 7), 'violet', tower);
          }
          else {
            this.rail(Math.randomInt(4, 7), 'yellow', tower);
          }
        }
        break;
      case 'Flame Thrower':
        tower.targets = enemy;
        tower.direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        this.monstercontroller.enemies.forEach(monster => {
            if(this.circleCollisionDetection(tower.x, tower.y, tower.range, monster.x, monster.y, monster.size)) {
              direction = Math.getDirection(tower.x, tower.y, monster.x, monster.y);
              let cone = Math.PI / 8;
              if(tower.direction < direction + cone && tower.direction > direction - cone) {
                damage = Math.randomInt(tower.minDamage, tower.maxDamage + 1);
                monster.hit(damage, tower.type, tower.effect);
              }
            }
        });
        random = Math.randomInt(3, 5)
        for(let i = 0; i < random; i++) {
          if(tower.upgrades[3]) {
            this.fire(Math.randomInt(3, 5), 'green', tower);
          }
          else {
            this.fire(Math.randomInt(3, 5), 'blue', tower);
          }
        }
        break;
      default:
        console.log('Error in shoot')
    }
  }

  targeting(tower) {
    switch (tower.name) {
      case 'Plasma Turret':
      case 'Rocket Launcher':
      case 'Rail Gun':
      case 'Industrial Gluer':
      case 'Flame Thrower':
        for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
          if(this.circleCollisionDetection(tower.x, tower.y, tower.range, this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size)) {
            this.shoot(tower, this.monstercontroller.enemies[i]);
            break;
          }
        }
        break;
      case 'Sentry Gun':
          if(!tower.upgrades[1]) {
            for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
              if(this.circleCollisionDetection(tower.x, tower.y, tower.range, this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size)) {
                this.shoot(tower, this.monstercontroller.enemies[i]);
                break;
              }
            }
          }
          else {
            let targets = [];
            for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
              if(this.circleCollisionDetection(tower.x, tower.y, tower.range, this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size)) {
                targets.push(this.monstercontroller.enemies[i]);
                if(targets.length >= 3) {
                  break;
                }
              }
            }
            targets.forEach(target => {
              this.shoot(tower, target);
            });
          }
          break;
      case 'Tesla Tower':
        if(tower.targets.length <= tower.maxTargets) {
          for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
            if(this.circleCollisionDetection(tower.x, tower.y, tower.range, this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size)) {
              let check = false;
              tower.targets.forEach( targets => {
                if(targets.target === this.monstercontroller.enemies[i]) {
                  check = true;
                }
              });
              if(!check) {
                tower.targetAdded(this.monstercontroller.enemies[i]);
              }
              if(tower.targets.length >=  tower.maxTargets) {
                break;
              }
            }
          }
        }
        break;
      default:

    }
  }

  resolveProjectileCollision(projectile, enemy) {
    if(projectile instanceof Rocket) {
      projectile.explode();
      for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
        if(this.circleCollisionDetection(this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size, projectile.x, projectile.y, projectile.size)) {
          this.monstercontroller.enemies[i].hit(projectile.damage, projectile.type, projectile.effect);
        }
      }
    }
    else if (projectile instanceof RapidShot) {
      enemy.hit(projectile.damage, projectile.type, projectile.effect);
    }
  }

  removeMonster(ID) {
    if(this.selected) {
      this.checkSelected(this.monstercontroller.enemies[ID]);
    }
    this.monstercontroller.enemies.splice(ID, 1);
  }

  removeTower(ID) {
    if(this.selected) {
      this.checkSelected(this.towers[ID]);
    }
    this.towers.splice(ID, 1);
  }

  /** @function update
    * Function to handle all updates with objects and interactions between objects
    */
  update() {
    this.money.update();

    this.monstercontroller.update();
    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      let check = this.monstercontroller.enemies[i].update();
      if(check === 'end') {
        this.lives--;
        this.removeMonster(i);
        if(this.lives <= 0) {
          this.gameOver = true;
        }
      }
      else if(check === 'killed') {
        this.money.money += this.monstercontroller.enemies[i].bounty;
        this.removeMonster(i);
        this.kills++;
      }
    }

    this.towers.forEach(tower => {
      if(!tower.reloading) {
        this.targeting(tower);
      }
    });

    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      for(let j = 0; j < this.projectiles.length; j++) {
        if(this.circleCollisionDetection(this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size, this.projectiles[j].x, this.projectiles[j].y, this.projectiles[j].size)) {
          this.resolveProjectileCollision(this.projectiles[j], this.monstercontroller.enemies[i]);
          this.projectiles.splice(j, 1);
          break;
        }
      }
    }

    for(let i = 0; i < this.projectiles.length; i++) {
      if(this.projectiles[i].update()) {
        this.projectiles.splice(i, 1);
      }
    }
    for(let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        if(this.particles[i].life <= 0) {
          this.particles.splice(i, 1);
        }
    }
    this.towers.forEach(tower => {
      tower.update();
    });
    if(this.selected) {
      this.selected.update();
    }
    if(this.BuildMenu) {
      this.BuildMenu.update();
    }
  }

  stats() {
    this.backBufferContext.save();
    this.backBufferContext.fillStyle = "red";
    this.backBufferContext.font = 'bolder 20px Arial';
    this.backBufferContext.fillText("Money: $" + this.money.money, 500, 20);
    this.backBufferContext.fillText("Lives: " + this.lives, 675, 20);
    this.backBufferContext.fillText("Kills: " + this.kills, 775, 20);
    this.backBufferContext.fillText("Wave: " + this.monstercontroller.wave, 875, 20);
    this.backBufferContext.restore();
  }

  /** @function render
    * Function to handle the rendering of all the objects
    */
  render() {
    this.backBufferContext.fillstyle = 'black';
    this.backBufferContext.fillRect(0, 0, this.size.width * 1.2, this.size.height);
    this.map.render(this.backBufferContext);
    this.towers.forEach(tower => {
      tower.render(this.backBufferContext);
    });
    this.projectiles.forEach(projectile => {
      projectile.render(this.backBufferContext);
    });
    this.particles.forEach(particle => {
      particle.render(this.backBufferContext);
    });
    this.monstercontroller.render(this.backBufferContext);
    if(this.selected) {
      this.selected.render(this.backBufferContext);
    }
    if(this.BuildMenu) {
      this.BuildMenu.render(this.backBufferContext);
    }
    this.stats();
    //Bit blit the back buffer onto the screen
    this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
  }

  /** @function loop
    * Function will continuosly loop the update & render functions
    */
  loop() {
    if(!this.paused && !this.gameOver) {
      this.update();
      this.render();
    }
    if(this.gameOver) {
      this.theme.pause();
      this.screenBufferContext.fillStyle = 'red';
      this.screenBufferContext.font = "bolder 50px Times New Roman";
      this.screenBufferContext.fillText("GAME OVER", 400, 400);
    }
  }
}
