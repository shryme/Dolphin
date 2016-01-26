
function Turtle(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'turtle', 's1.png');

	this.initialize();

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listMove = new Array();

	for (var i = 1; i <= 10; i++) {
		listMove.push('s' + i + '.png');
	}

	this.animations.add('move', listMove, 10, true, false);
	this.animations.add('idle', ['s1.png', 's2.png'], 2, true, false);
	this.animations.play('move');

	game.add.existing(this);

}

Turtle.prototype = Object.create(Phaser.Sprite.prototype);
Turtle.prototype.constructor = Turtle;

Turtle.prototype.create = function() {

}

Turtle.prototype.update = function() {

	return true;
}

Turtle.prototype.idle = function() {

	this.animations.play('idle');
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
}

Turtle.prototype.move = function(target, speed) {

	this.rotation = this.game.physics.arcade.moveToObject(this, target, speed);

	this.animations.play('move');

	this.flipSprite();

}

module.exports = Turtle;









