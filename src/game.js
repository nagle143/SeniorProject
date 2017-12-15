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
    * @param {string} mode - for future expansions of different modes, i.e. campaign vs endless
    */
  constructor(screenWidth, screenHeight, mode) {
    //Property to hold the size of the display & allow dynamic sizing of objects
    this.size = {width: screenWidth, height: screenHeight};
    //Core Objects
    this.projectiles = [];
    this.towers = [];
    this.particles = [];
    //Surves no purpose at the moment
    this.mode = null;
    //Map object
    this.map = null;
    this.initMode(mode);
    //Object that controls spawns, killing, and creation of monsters
    this.monstercontroller = new MonsterController('wave', this.map.path, this.size.width);
    //Important variables
    //How many monsters can get past before you loose
    this.lives = 30;
    //# of monsters killed
    this.kills = 0;
    //Object that controls money
    this.money = new Money(100);
    //Object that keeps track of what is selected and what to do with it
    this.selected = null;
    //Object that displays the possible towers to build
    this.BuildMenu = null;
    //State of mouse events
    this.mouseMode = 'selecting';
    //standard variables for controlling the interval
    this.paused = false;
    this.gameOver = false;

    //Back Buffer
    this.backBufferCanvas = document.getElementById("canvas");
    //larger than screenWidth to make space for Menus
    this.backBufferCanvas.width = screenWidth * 1.2;
    this.backBufferCanvas.height = screenHeight;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');

    //Canvas that actually gets put on the screen
    this.screenBufferCanvas = document.getElementById("canvas");
    //larger than screenWidth to make space for Menus
    this.screenBufferCanvas.width = screenWidth * 1.2;
    this.screenBufferCanvas.height = screenHeight;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

    //Binders to preserve 'this'
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

    //60fps
    this.interval = setInterval(this.loop, 1000/60);
  }

  /** @function reset
  * Function that resets the game
  */
  reset() {
    this.projectiles = [];
    this.towers = [];
    this.particles = [];
    this.mode = null;
    this.map = null;
    this.initMode('well');
    this.monstercontroller = new MonsterController('wave', this.map.path, this.size.width);
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

  /** @function handleMouseDown
  * Function to handle the mouse being down
  */
  handleMouseDown(event) {
    event.preventDefault();
    switch (this.mouseMode) {
      //Selecting Mode
      case 'selecting':
        this.getObject(event.clientX, event.clientY);
        break;
      //Building Mode
      case 'build':
        this.checkSpot(event.clientX, event.clientY);
        break;
      default:
    }
  }

  /** @function handleMouseDown
  * Function to handle a key being down
  */
  handleKeyDown(event) {
    event.preventDefault();
    switch (event.keyCode) {
      //B
      case 66:
        //Change the state of the mouse events
        this.mouseMode = 'build';
        //Get rid of the selected object so you can place easier
        if(this.selected) {
          this.selected.object.selected = false;
          this.selected = null;
        }
        break;
      //Selecting is the default mode, so i don't remember what key this is
      case 27:
        //Change the state of mouse events
        this.mouseMode = 'selecting';
        this.BuildMenu = null;
        break;
      //Space
      case 32:
        //Pause the update & render functions
        if(this.paused) {
          this.paused = false;
        }
        else {
          this.paused = true;
        }
        break;
      //~
      case 192:
        this.theme.pause();
        this.reset();
        break;
      default:

    }
  }

  /** @function getObject
  * Function called while inselecting mode to find the object you clicked on, if any
  * @param {int} x - x position of the click
  * @param {int} y - y position of the click
  */
  getObject(x, y) {
    let found = false;
    if(this.selected) {
      //If there is something selected, check if you clicked the upgrade buttons
      for(let i = 0; i < this.selected.upgradeButtons.length; i++) {
        if(this.circleRectangleCollision(x, y, 2, this.selected.upgradeButtons[i].x, this.selected.upgradeButtons[i].y, this.selected.upgradeButtons[i].width, this.selected.upgradeButtons[i].height)) {
          found = true;
          //Check if you have enough money & don't already have the upgrade
          if(!this.selected.object.upgrades[i] && this.selected.prices[i] <= this.money.money) {
            this.money.money -= this.selected.prices[i];
            this.selected.object.value += Math.round(this.selected.prices[i] * 0.70);
            this.selected.object.applyUpgrade(i);
          }
          break;
        }
      }
      if(!found) {
        //If you didn't select a button, than you click something else or nothing
        this.selected.object.selected = false;
        this.selected = null;
      }
    }
    //Check if you clicked a tower
    this.towers.forEach(tower => {
      if(this.circleCollisionDetection(x, y, 2, tower.x, tower.y, tower.size)) {
        this.selected = new Selected(tower, 'tower', tower.name);
        tower.selected = true;
        found = true;
      }
    });
    //If exit function if you found a tower
    if(found) {
      return;
    }
    //Check if you clicked a monster
    this.monstercontroller.enemies.forEach(monster => {
      if(this.circleCollisionDetection(x, y, 4, monster.x, monster.y, monster.size)) {
          this.selected = new Selected(monster, 'monster');
          monster.selected = true;
          found = true;
      }
    });
    //Exit function if you found a monster
    if(found) {
      return;
    }
    if(this.BuildMenu) {
      //If there is a active build menu, check the build buttons
      for(let i = 0; i < this.BuildMenu.buttons.length; i++) {
        if(this.circleRectangleCollision(x, y, 2, this.BuildMenu.buttons[i].x, this.BuildMenu.buttons[i].y, this.BuildMenu.buttons[i].width, this.BuildMenu.buttons[i].height)) {
          found = true;
          //Money check
          if(this.money.money >= this.BuildMenu.info[i].cost) {
            this.money.money -= this.BuildMenu.info[i].cost;
            //Create Tower
            this.createTower(i);
          }
          break;
        }
      }
    }
  }

  /** @function checkSpot
  * function called in build mode to check if the spot is possible to build a tower
  * @param {int} x - x position of the click
  * @param {int} y - y position of the click
  */
  checkSpot(x, y) {
    let blocked = false;
    //Quick Turn away checks
    if(x > 750 || x < 50) {
      return;
    }
    if(y < 50 || y > 750) {
      return;
    }
    //Make sure there isn't already a tower blocking the spot
    for(let i = 0; i < this.towers.length; i++) {
      if(this.circleCollisionDetection(x, y, this.towers[i].size, this.towers[i].x, this.towers[i].y, this.towers[i].size)) {
        blocked = true;
        break;
      }
    }
    if(blocked) {
      //If it is blocking, exit function and go back to selecting mode
      this.mouseMode = 'selecting';
      return;
    }
    //Check that you aren't placing  the tower on the track
    for(let i = 0; i < this.map.tiles.length; i++) {
      if(this.circleRectangleCollision(x, y, 20, this.map.tiles[i].x, this.map.tiles[i].y, 50, 50)) {
        blocked = true;
        break;
      }
    }
    if(blocked) {
      //If it is blocked, exit funciton and go back to selecting mode
      this.mouseMode = 'selecting';
      return;
    }
    //Found a valid build spot, create a build menu
    this.BuildMenu = new BuildMenu(x, y);
    //Back to selecting mode
    this.mouseMode = 'selecting';
  }

  /** @function handleMouseUp
  * Function to handle the handleMouseUp, doesn't do anything at the moment.
  */
  handleMouseUp(event) {
    event.preventDefault();
  }

  /** @function checkSelected
  * function to check if a removed object was being selected
  * @param {object} object - object that was removed
  */
  checkSelected(object) {
    if(this.selected.object === object) {
      //If removed object was selected, stop selecting it
      this.selected = null;
    }
  }

  /** @function initMode
  * funciton to initialze the mode of the game, right now it defaults to random endless waves
  * @param {string} mode - mode the game should be set too.
  */
  initMode(mode) {
    this.map = new Map(this.size.width, this.size.height, 'random');
  }

  /** @function circleCollisionDetection
    * Function to detect collisions between two circles, kept as general
    * as possible for maximum versatility
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

  /** @function circleRectangleCollision
  * funciton to handle collisions between circles and rectangles, which are pretty much just buttons
  * Again kept as general as possible for maximum versatility
  * @param {float} cx - x position of circle
  * @param {float} xy - y position of circle
  * @param {int/float} cr - radius of circle
  * @param {float} rx - x position of rectangle top left corner
  * @param {float} ry - y position of rectangle top left corner
  * @param {int} rw - width of rectangle
  * @param {int} rh - height of rectangle
  */
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

  /** @function createTower
  * Function to determine which tower to createTower, Towers are created on the stored Postion in the Build menu
  * @param {int} ID - the ID of the button that was clicked
  */
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

  /** @function createProjectile
  * Function to determine which type of projectile to make
  * @param {tower} tower - which tower needs to create a projectile
  * @param {enemy} enemy - which enemy the tower is shooting at
  * @param {float} direction - the angle between the tower and enemy
  */
  createProjectile(tower, enemy, direction) {
    let x = 0;
    let y = 0;
    //Get a random damage base on the tower
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

  /** @function fire
  * Function to create the particle effects of the flamethrower shooting
  * @param {int} numParticles - number of particles to get created
  * @param {string} color - name of the color the particle will be
  * @param {tower} tower - tower that is shooting the fire, mainly so I don't need to recaluate values
  */
  fire(numParticles, color, tower) {
    let x = 0;
    let y = 0;
    let random = 0;
    for(let i = 0; i < numParticles; i++) {
      //Rangle angle within the flamethrower's arc of fire
      random = Math.randomBetween(tower.direction - Math.PI / 8, tower.direction + Math.PI / 8);
      //Postion the particles start point outside the tower itself
      x = tower.x + Math.sin(random) * tower.size;
      y = tower.y - Math.cos(random) * tower.size;
      this.particles.push(new Particle (x, y, random, Math.randomInt(2, 3) , color, 50, tower.range));
    }
  }

  /** @function rail
  * funciton to create the particle effect of the rail gun shooting
  * @param {int} numParticles - number of particles to get created
  * @param {string} color - name of the color the particle will be
  * @param {tower} tower - tower that is shooting the rail, mainly so I don't need to recaluate values
  */
  rail(numParticles, color, tower) {
    let x = 0;
    let y = 0;
    let random = 0;
    for(let i = 0; i < numParticles; i++) {
      //Find a random start location along the rail gun's direction
      let test = Math.randomBetween(10, tower.range);
      x = tower.x + Math.sin(tower.direction) * test;
      y = tower.y - Math.cos(tower.direction) * test;
      //Have the particle go randomly left or right in the direction of the shot
      if(Math.random() > 0.50) {
        random = tower.direction + Math.PI / 8;
      }
      else {
        random = tower.direction - Math.PI / 8;
      }
      this.particles.push(new Particle(x, y, random, 1, color, 30, 30));
    }
  }

  /** @function shoot
  * funciton to determine how a tower will shoot
  * @param {tower} tower - tower that wants to shoot
  * @param {enemy} enemy - targeted enemy of the tower, not used by all towers
  */
  shoot(tower, enemy) {
    //First things first, tower should be reloading
    tower.reloading = true;
    let direction = 0.0;
    let random = 0;
    //random damage based o the tower's damages
    let damage = Math.randomInt(tower.minDamage, tower.MaxDamage + 1);
    switch (tower.name) {
      //Standard point and shoot towers with projectiles
      case 'Plasma Turret':
      case 'Rocket Launcher':
      case 'Industrial Gluer':
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        tower.direction = direction;
        this.createProjectile(tower, enemy, direction);
        break;
      //Standard point and shoot towers with hit scan
      case 'Sentry Gun':
      case 'Rail Gun':
        direction = Math.getDirection(tower.x, tower.y, enemy.x, enemy.y);
        tower.direction = direction;
        //Enemy immediately takes damage
        enemy.hit(damage, tower.type, tower.effect);
        random = Math.randomInt(4, 6);
        //determine color of particles based on upgrades
        for(let i = 0; i < random; i++) {
          if(tower.upgrades[0] || tower.upgrades[1]) {
            this.rail(Math.randomInt(4, 7), 'violet', tower);
          }
          else {
            this.rail(Math.randomInt(4, 7), 'yellow', tower);
          }
        }
        break;
      //Cones Based towers, flamethrower is the only one right now
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
        //Random number of iterations
        random = Math.randomInt(3, 5)
        for(let i = 0; i < random; i++) {
          //determine color of particles based on upgrades
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

  /** @function targeting
  * Function to handle the targeting of the different towers
  * @param {tower} tower - tower that needs to target something
  */
  targeting(tower) {
    switch (tower.name) {
      //Towers that need only one target
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
      //Bit of a special case, sentry gun can upgrade to multiple targets
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
      //Towers that always have multiple targets, Tesla is the only one right now
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

  /** @function resolveProjectileCollision
  * funciton to determine how a projectile should interact on collision with a monster
  * @param {projectile} projectile - projectile in question
  * @param {enemy} enemy - enemy in question
  */
  resolveProjectileCollision(projectile, enemy) {
    if(projectile instanceof Rocket) {
      //If it is a rocket type, it needs to explode
      projectile.explode();
      //Check all the monsters to see if it was hit by the explosion
      for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
        if(this.circleCollisionDetection(this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size, projectile.x, projectile.y, projectile.size)) {
          //Hurt the monster
          this.monstercontroller.enemies[i].hit(projectile.damage, projectile.type, projectile.effect);
        }
      }
    }
    else if (projectile instanceof RapidShot) {
      //If it is a typical projectile just hurt the monster
      enemy.hit(projectile.damage, projectile.type, projectile.effect);
    }
  }

  /** @function removeMonster
  * funciton to handle the reomving of a monster
  * @param {int} ID - position of the monster in the monster array
  */
  removeMonster(ID) {
    if(this.selected) {
      //Check if the monster was being selected
      this.checkSelected(this.monstercontroller.enemies[ID]);
    }
    //Removing the monster from the array
    this.monstercontroller.enemies.splice(ID, 1);
  }

  /** @function removeTower
  * funciton that removes a tower, currently is never called, haven't implementing tower selling yet
  * @param {int} ID - position of the tower in the towers array
  */
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
    //update the money obect
    this.money.update();

    //Update the monster controller
    this.monstercontroller.update();

    //Update all the monsters, doing it here instead of in the monster controller so I can easily check the selected object
    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      let check = this.monstercontroller.enemies[i].update();
      //If the monster reached the end of the track
      if(check === 'end') {
        this.lives--;
        this.removeMonster(i);
        if(this.lives <= 0) {
          this.gameOver = true;
        }
      }
      //If the monster was killed
      else if(check === 'killed') {
        this.money.money += this.monstercontroller.enemies[i].bounty;
        this.removeMonster(i);
        this.kills++;
      }
    }

    this.towers.forEach(tower => {
      if(!tower.reloading) {
        //If they are not reloading, set of the change of functions to shoot stuff
        this.targeting(tower);
      }
    });

    //Check if the monsters and projectiles are colliding
    for(let i = 0; i < this.monstercontroller.enemies.length; i++) {
      for(let j = 0; j < this.projectiles.length; j++) {
        if(this.circleCollisionDetection(this.monstercontroller.enemies[i].x, this.monstercontroller.enemies[i].y, this.monstercontroller.enemies[i].size, this.projectiles[j].x, this.projectiles[j].y, this.projectiles[j].size)) {
          this.resolveProjectileCollision(this.projectiles[j], this.monstercontroller.enemies[i]);
          this.projectiles.splice(j, 1);
          break;
        }
      }
    }

    //Update the projectiles
    for(let i = 0; i < this.projectiles.length; i++) {
      if(this.projectiles[i].update()) {
        //Projectile needs to be deleted
        this.projectiles.splice(i, 1);
      }
    }
    //Updates all the particles
    for(let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        if(this.particles[i].life <= 0) {
          this.particles.splice(i, 1);
        }
    }
    //Updates the towers, actually not sure why I am not doing this in the other targeting loop
    this.towers.forEach(tower => {
      tower.update();
    });
    //If there is something select, update it
    if(this.selected) {
      this.selected.update();
    }
    //If there is a build menu update it, currently does nothing
    if(this.BuildMenu) {
      this.BuildMenu.update();
    }
  }

  /** @function stats
  * funciton to display the stats at the top of the screen
  */
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
    //Refresh the screen
    this.backBufferContext.fillstyle = 'black';
    this.backBufferContext.fillRect(0, 0, this.size.width * 1.2, this.size.height);
    //Render the map
    this.map.render(this.backBufferContext);
    //Render the Towers
    this.towers.forEach(tower => {
      tower.render(this.backBufferContext);
    });
    //Render the projectiles
    this.projectiles.forEach(projectile => {
      projectile.render(this.backBufferContext);
    });
    //Render the particles
    this.particles.forEach(particle => {
      particle.render(this.backBufferContext);
    });
    //Render the monsters
    this.monstercontroller.render(this.backBufferContext);
    //Render the selected object
    if(this.selected) {
      this.selected.render(this.backBufferContext);
    }
    //Render the build menu
    if(this.BuildMenu) {
      this.BuildMenu.render(this.backBufferContext);
    }
    //display the stats
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
