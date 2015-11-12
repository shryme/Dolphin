
var Dolphin = require('../sprites/dolphin');


function Friend(game, group, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, group, x, y);
	this.entity.create();

}

Friend.prototype = {
	create: function() {

	},
	update: function() {

		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToXY(this.entity.sprite, 300, 300) > 100)
			this.entity.move(300, 300, 400);
		else
			this.entity.idle();

	}
}

module.exports = Friend;
