
function Powerup(game, x, y, type) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'powerup', 'p1.png');

	this.initialize();

	this.powerupType = type;

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

	this.animations.add('idle', listImages, 5, true, false);
	this.animations.play('idle');

	if (this.powerupType === 'jump')
		this.tint = 0x00ff00
	else
		this.tint = 0xffff00

	game.add.existing(this);



}

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.create = function() {

}


module.exports = Powerup;









