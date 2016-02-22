
function Rock(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'objects', 'rock.png');

	this.initialize();


	this.game.physics.arcade.enableBody(this);
	this.body.gravity.x = 0;
	this.body.gravity.y = 1000;
	this.body.drag.x = 5;

	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(32, 32, 0, 0);


	game.add.existing(this);



}

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.create = function() {

}


module.exports = Rock;









