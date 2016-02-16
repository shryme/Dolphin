
function NextLevel(game, x, y, next) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'powerup', 'p1.png');

	this.initialize();

	this.next = next;

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listImages = new Array();

	for (var i = 1; i <= 8; i++) {
		listImages.push('p' + i + '.png');
	}

	this.animations.add('idle', listImages, 10, true, false);
	this.animations.play('idle');

	game.add.existing(this);



}

NextLevel.prototype = Object.create(Phaser.Sprite.prototype);
NextLevel.prototype.constructor = NextLevel;

NextLevel.prototype.create = function() {

}


module.exports = NextLevel;









