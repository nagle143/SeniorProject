


export default class Map {
  constructor(width, height, seed) {
    this.path = [{x: -10, y: 100}, {x: 200, y: 100}, {x: 200, y: 500}, {x: 600, y: 500}, {x: 600, y: 100}, {x: 300, y: 100},
       {x: 300, y: 700}, {x: width + 10, y: 700}];
    this.seed = seed;
    this.width = width;
    this.height = height;
    //this.generateTrack();
  }

  generateTrack() {
    let numCheckpoints = Math.randomInt(5, 10);
    let backwards = null;
    let random = 0;
    let x = 0;
    let y = 0;
    //Top or Bottom Start
    if(Math.random() > 0.5) {
      //Top
      if(Math.random() > 0.5) {
        y = -10;
      }
      //Bottom
      else {
        y = this.height + 10;
      }
      x = Math.randomInt(10, this.width - 10);
    }
    //Left or Right start
    else {
      //Left
      if(Math.random() > 0.5) {
        x = -10;
      }
      //Right
      else {
        x = this.width + 10;
      }
      y = Math.randomInt(10, this.height - 10);
    }
    this.path.push({x: x, y: y});
    while(this.path.length < numCheckpoints) {
      random = Math.randomInt(0, 3);
      var tempX = 0;
      var tempY = 0;
      var tempB = 0;
      switch (random) {
        //Left
        case 0:
          tempB = 1;
          tempX = Math.randomInt(100, x - 200);
          tempY = y;
          break;
        //Right
        case 1:
          tempB = 0;
          tempX = Math.randomInt(x + 200, this.width - 100);
          tempY = y;
          break;
        //Up
        case 2:
          tempB = 3;
          tempY = Math.randomInt(100, y - 200);
          tempX = x;
          break;
        //Down
        case 3:
          tempB = 2;
          tempX = Math.randomInt(y + 200, this.height - 100);
          tempY = y;
          break;
        default:
          console.log("ERROR IN TRACK GENERATION")
      }
      if(random === backwards) {
        continue;
      }
      if(tempX > 0 && tempX < this.width && tempY > 0 && tempY < this.height) {
        x = tempX;
        y = tempY;
        backwards = tempB;
        this.path.push({x: x, y: y});
      }
    }
    console.log(this.path);
  }

  update() {

  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);
    for(let i = 1; i < this.path.length; i++) {
      ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}
