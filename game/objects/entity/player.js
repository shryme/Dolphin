
var Dolphin = require('../sprites/dolphin');


function Player(game, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, x, y);
	this.entity.create();

}

Player.prototype = {
	create: function() {

	},
	update: function(cursors) {

		if (!this.entity.update())
			return;


		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToPointer(this.entity, this.game.input.activePointer) > 20)
			this.entity.move();
		else
			this.entity.idle();


	}
}

module.exports = Player;
