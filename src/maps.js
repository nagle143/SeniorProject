import MapData from './maps.json';


export default class Map {
  constructor(width, height, seed) {
    /*this.path = [{x: -10, y: 100}, {x: 200, y: 100}, {x: 200, y: 500}, {x: 600, y: 500}, {x: 600, y: 100}, {x: 300, y: 100},
       {x: 300, y: 700}, {x: width + 10, y: 700}]; */
    this.path = [];
    this.seed = seed;
    this.width = width;
    this.height = height;
    this.getTrack();
    this.tiles = [];
    this.setTiles();
    this.factory = new Image();
    this.factory.src = 'Sprites/RobotFactory.png';
    this.generator = new Image();
    this.generator.src = 'Sprites/Generator.png';
    this.general = new Image();
    this.general.src = 'Sprites/Path.png';
    //this.generateTrack();
  }

  getTrack() {
    for(let i = 0; i < MapData.map1.path.length; i++) {
      this.path.push({x: MapData.map1.path[i].x + MapData.tileWidth / 2, y: MapData.map1.path[i].y + MapData.tileHeight / 2});
    }
  }

  setTiles() {
    for(let i = 0; i < MapData.map1.tiles.length; i++) {
      if(MapData.map1.tiles[i] !== 0) {
        this.tiles.push({x: (i % 16) * MapData.tileWidth, y: Math.floor(i / 16) * MapData.tileHeight, tile: MapData.map1.tiles[i]});
      }
    }
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
    for(let i = 0; i < this.tiles.length; i++) {
      switch (this.tiles[i].tile) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        ctx.drawImage(this.general, this.tiles[i].x, this.tiles[i].y, MapData.tileWidth, MapData.tileHeight);
          break;
        case 8:
          ctx.drawImage(this.factory, this.tiles[i].x, this.tiles[i].y, MapData.tileWidth, MapData.tileHeight);
          break;
        case 9:
          ctx.drawImage(this.generator, this.tiles[i].x, this.tiles[i].y, MapData.tileWidth, MapData.tileHeight);
          break;
        default:
          console.log("Error in Tile Rendering");
      }
      //ctx.fillRect(this.tiles[i].x, this.tiles[i].y, MapData.tileWidth, MapData.tileHeight);
    }
    ctx.beginPath();
    ctx.moveTo(800, 0);
    ctx.lineTo(800, 800);
    ctx.stroke();
    ctx.restore();
  }
}
