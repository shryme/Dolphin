
var Shark = require('../sprites/shark');


function BasicEnemy(game, group, x, y) {
	this.game = game;

	this.entity = new Shark(game, group, x, y);
	this.entity.create();

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.entity.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.entity.sprite, target) < 300)
			this.entity.move(target, 400);
		else
			this.entity.idle();

	}
}

module.exports = BasicEnemy;
