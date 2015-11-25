
var Orca = require('../sprites/orca');


function FriendOrca(game, group, x, y) {
	this.game = game;

	this.entity = new Orca(game, group, x, y);
	this.entity.create();

}

FriendOrca.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.entity.update())
			return;

		var target = {x: 700, y: 700};

		if (this.game.physics.arcade.distanceBetween(this.entity.sprite, target) > 100)
			this.entity.move(target, 400);
		else
			this.entity.idle();

	}
}

module.exports = FriendOrca;
