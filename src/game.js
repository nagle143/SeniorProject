//Import Files
import RapidFire from "./Towers/rapidfire.js";
import RapidShot from "./Projectiles/rapidshot.js";
import RocketLauncher from "./Towers/rocketlauncher.js";
import Rocket from "./Projectiles/rocket.js";
import Map from "./maps.js";
import MonsterController from "./monstercontroller.js";
import Sprite from './sprite.js';
import Selected from './selected.js';
import Money from './money.js';
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
    this.mode = null;
    this.map = null;
    this.initMode(mode);
    this.towers.push(new RapidFire(400, 400, this.size.width));
    this.towers.push(new RapidFire(400, 250, this.size.width));
    this.towers.push(new RocketLauncher(250, 300, this.size.width));
    this.monstercontroller = new MonsterController('wave', this.map.path, this.size.width);
    //Important variables
    this.lives = 30;
    this.money = new Money(100);
    this.selected = null;

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
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.screenBufferCanvas.onmousedown = this.handleMouseDown;
    this.screenBufferCanvas.onmouseup = this.handleMouseUp;

    //60fps
    this.interval = setInterval(this.loop, 1000/60);
  }

  //Mouse Events
  handleMouseDown(event) {
    event.preventDefault();
    this.getObject(event.clientX, event.clientY);
  }

  getObject(x, y) {
    let found = false;
    if(this.selected) {
      //setting the selected objects bool of being selected to false
      this.selected.object.selected = false;
      this.selected = null;
    }
    this.towers.forEach(tower => {
      if(this.circleCollisionDetection(x, y, 5, tower.x, tower.y, tower.size)) {
        //this.selected = {object: tower, type: 'tower'};
        this.selected = new Selected(tower, 'tower');
        tower.selected = true;
        found = true;
      }
    });
    if(found) {
      return;
    }
    this.monstercontroller.enemies.forEach(monster => {
      if(this.circleCollisionDetection(x, y, 5, monster.x, monster.y, monster.size)) {
          this.selected = new Selected(monster, 'monster');
          monster.selected = true;
          found = true;
      }
    });
  }

  handleMouseUp(event) {
    event.preventDefault();
  }

  displaySelected(selected) {
    switch (selected.type) {
      case "tower":
      console.log('here');
        this.displayTowerInfo(selected.object);
        break;
      default:
        console.log('What');
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

  createProjectile(tower, enemy) {
    let x = 0;
    let y = 0;
    let direction = 0.0;
    let damage = Math.randomInt(tower.minDamage, tower.maxDamage + 1);
    switch (tower.name) {
      case "Plasma Turret":
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        x = tower.x + Math.sin(direction) * tower.size;
        y = tower.y - Math.cos(direction) * tower.size;
        this.projectiles.push(new RapidShot(x, y, damage, direction, tower.range, "what", enemy, this.size.width));
        break;
      case "Rocket Launcher":
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        x = tower.x + Math.sin(direction) * tower.size;
        y = tower.y - Math.cos(direction) * tower.size;
        this.projectiles.push(new Rocket(x, y, damage, direction, tower.range, "what", enemy, this.size.width));
        break;
      default:

    }
    tower.direction = direction;
  }

  /** @function update
    * Function to handle all updates with objects and interactions between objects
    */
  update() {
    this.money.update();

    this.monstercontroller.update();
    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      if(this.monstercontroller.enemies[i].update()) {
        this.lives--;
        this.monstercontroller.enemies.splice(i, 1);
      }
    }

    this.towers.forEach(tower => {
      if(!tower.reloading) {
        for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
          if(this.circleCollisionDetection(tower.x, tower.y, tower.range, this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size)) {
            this.createProjectile(tower, this.monstercontroller.enemies[i]);
            tower.reloading = true;
            break;
          }
        }
      }
    });

    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      for(let j = 0; j < this.projectiles.length; j++) {
        if(this.circleCollisionDetection(this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size, this.projectiles[j].x, this.projectiles[j].y, this.projectiles[j].size)) {
          if(this.monstercontroller.enemies[i].hit(this.projectiles[j].damage, this.projectiles[j].type, this.projectiles[j].effect)) {
            this.money.money += this.monstercontroller.enemies[i].bounty;
            this.monstercontroller.enemies.splice(i, 1);
          }
          if(this.projectiles[j] instanceof Rocket) {
            this.projectiles[j].explode();
          }
          else {
            this.projectiles.splice(j, 1);
            break;
          }
        }
      }
    }

    for(let i = 0; i < this.projectiles.length; i++) {
      if(this.projectiles[i].update()) {
        this.projectiles.splice(i, 1);
      }
    }
    this.towers.forEach(tower => {
      tower.update();
    });
    if(this.selected) {
      this.selected.update();
    }
  }

  /** @function render
    * Function to handle the rendering of all the objects
    */
  render() {
    this.backBufferContext.fillstyle = 'black';
    this.backBufferContext.fillRect(0, 0, this.size.width * 1.2, this.size.height);
    if(this.selected) {
      this.selected.render(this.backBufferContext);
    }
    this.projectiles.forEach(projectile => {
      projectile.render(this.backBufferContext);
    });
    this.towers.forEach(tower => {
      tower.render(this.backBufferContext);
    });
    this.map.render(this.backBufferContext);
    this.monstercontroller.render(this.backBufferContext);
    //Bit blit the back buffer onto the screen
    this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
  }

  /** @function loop
    * Function will continuosly loop the update & render functions
    */
  loop() {
    this.update();
    this.render();
  }
}
