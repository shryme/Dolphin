
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

		this.entity.move(target, 400);

		// this.entity.idle();

	}
}

module.exports = BasicEnemy;
