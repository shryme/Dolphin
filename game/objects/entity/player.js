
var Dolphin = require('../sprites/dolphin');


function Player(game, x, y) {
	this.game = game;

	this.sprite = new Dolphin(game, x, y, this);
	this.sprite.create();

}

Player.prototype = {
	create: function() {

	},
	update: function(cursors) {

		if (!this.sprite.update())
			return;

		var attacked;

		if (this.game.input.activePointer.isDown)
			attacked = this.sprite.attack();

		if (!attacked) {
			if (this.game.physics.arcade.distanceToPointer(this.sprite, this.game.input.activePointer) > 20)
				this.sprite.move();
			else
				this.sprite.idle();
		}


	}
}

module.exports = Player;
