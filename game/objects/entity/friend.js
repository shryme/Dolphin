
var Dolphin = require('../sprites/dolphin');


function Friend(game, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, x, y);
	this.entity.create();

}

Friend.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.entity.update())
			return;

		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToXY(this.entity, 300, 300) > 100)
			this.entity.move(300, 300, 400);
		else
			this.entity.idle();

	}
}

module.exports = Friend;
