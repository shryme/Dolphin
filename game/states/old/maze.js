
'use strict';
function Maze() {}

Maze.prototype = {
  init: function(show) {
    this.showCreation = show;
  },
  preload: function () {

  },
  create: function () {





    this.game.stage.disableVisibilityChange = true;

    this.maze = [];
    this.mazeWidth = 90;
    this.mazeHeight = 47;
    this.tileSize = 10;

    this.mazeGraphics = this.game.add.graphics(0, 0);
    this.moves = [];

    for(var i = 0; i < this.mazeHeight; i ++){
         this.maze[i] = [];
         for(var j = 0; j < this.mazeWidth; j ++){
              this.maze[i][j] = 1;
         }
    }
    this.posX = 1;
    this.posY = 1;
    this.maze[this.posX][this.posY] = 0;
    this.moves.push(this.posY + this.posY * this.mazeWidth);
    // this.game.time.events.loop(Phaser.Timer.SECOND/25, function(){

    if (this.showCreation) {
      this.game.time.events.loop(Phaser.Timer.SECOND/10000, function(){
        this.generate();
        this.drawMaze(this.posX, this.posY);
      }, this);
    }
    else {
      this.generate();
      this.drawMaze(this.posX, this.posY);
    }


  },
  generate: function() {

    if(this.moves.length){
      var possibleDirections = "";
      if(this.posX+2 > 0 && this.posX + 2 < this.mazeHeight - 1 && this.maze[this.posX + 2][this.posY] == 1){
           possibleDirections += "S";
      }
      if(this.posX-2 > 0 && this.posX - 2 < this.mazeHeight - 1 && this.maze[this.posX - 2][this.posY] == 1){
           possibleDirections += "N";
      }
      if(this.posY-2 > 0 && this.posY - 2 < this.mazeWidth - 1 && this.maze[this.posX][this.posY - 2] == 1){
           possibleDirections += "W";
      }
      if(this.posY+2 > 0 && this.posY + 2 < this.mazeWidth - 1 && this.maze[this.posX][this.posY + 2] == 1){
           possibleDirections += "E";
      }
      if(possibleDirections){
           var move = this.game.rnd.between(0, possibleDirections.length - 1);
           switch (possibleDirections[move]){
                case "N":
                     this.maze[this.posX - 2][this.posY] = 0;
                     this.maze[this.posX - 1][this.posY] = 0;
                     this.posX -= 2;
                     break;
                case "S":
                     this.maze[this.posX + 2][this.posY] = 0;
                     this.maze[this.posX + 1][this.posY] = 0;
                     this.posX += 2;
                     break;
                case "W":
                     this.maze[this.posX][this.posY - 2] = 0;
                     this.maze[this.posX][this.posY - 1] = 0;
                     this.posY -= 2;
                     break;
                case "E":
                     this.maze[this.posX][this.posY + 2] = 0;
                     this.maze[this.posX][this.posY + 1] = 0;
                     this.posY += 2;
                     break;
           }
           this.moves.push(this.posY + this.posX * this.mazeWidth);
      }
      else{
           var back = this.moves.pop();
           this.posX = Math.floor(back / this.mazeWidth);
           this.posY = back % this.mazeWidth;
      }

      if (!this.showCreation)
        this.generate();

    }

  },
  drawMaze: function(posX, posY) {
    this.mazeGraphics.clear();
    this.mazeGraphics.beginFill(0xffffff);
    for(var i = 0; i < this.mazeHeight; i ++){
         for(var j = 0; j < this.mazeWidth; j ++){
              if(this.maze[i][j] == 0){
                   this.mazeGraphics.drawRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
              }
         }
    }
    this.mazeGraphics.endFill();
    this.mazeGraphics.beginFill(0xff0000);
    this.mazeGraphics.drawRect(posY * this.tileSize, posX * this.tileSize, this.tileSize, this.tileSize);
    this.mazeGraphics.endFill();
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('menu');
    }
  }
};
module.exports = Maze;
