
var Shark = require('../sprites/shark');


function BasicEnemy(game, x, y) {
	this.game = game;

	this.entity = new Shark(game, x, y);
	this.entity.create();

	this.listTargetPos = new Array();

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.entity.update())
			return;

		var dist = this.game.physics.arcade.distanceBetween(this.entity, target);

		if (dist < 300) {
			//If close enough, chase the target
			this.entity.move(target, 500);

			//Reset the list
			this.listTargetPos = new Array();

		}
		else if (dist < 600 || this.listTargetPos.length !== 0) {

			//If still close but not enough to chase, add the current target position
			//to a list that the enemy will follow to try to find the target again
			this.listTargetPos.push({
				x: target.x,
				y: target.y
			});

			this.entity.move(this.listTargetPos[0], 400);

			//If the enemy is close enough to the history position of the target,
			//remove it from the list so the enemy chase the next point
			if (this.game.physics.arcade.distanceBetween(this.entity, this.listTargetPos[0]) < 100)
				this.listTargetPos.shift();


		}
		else
			this.entity.idle();


		if (dist < 90)
			this.entity.attack(target);

	}
}

module.exports = BasicEnemy;
