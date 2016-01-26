
var Shark = require('../sprites/shark');


function BasicEnemy(game, x, y, wp) {
	this.game = game;

	this.sprite = new Shark(game, x, y, this);
	this.sprite.create();

	this.listTargetPos = new Array();

	this.target = {x: 300, y: 300};

	this.waypoints = wp;
	this.currentWp = 0;

	if (wp !== undefined)
		this.target = wp[0];

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.sprite.update())
			return;

		var dist = this.game.physics.arcade.distanceBetween(this.sprite, target);



		if (dist < 300) {
			//If close enough, chase the target
			this.sprite.move(target, 500);

			//Reset the list
			this.listTargetPos = new Array();

		}
		else if (dist < 600 && this.listTargetPos.length <= 100) {

			//If still close but not enough to chase, add the current target position
			//to a list that the enemy will follow to try to find the target again
			this.listTargetPos.push({
				x: target.x,
				y: target.y
			});

			this.sprite.move(this.listTargetPos[0], 400);

			//If the enemy is close enough to the history position of the target,
			//remove it from the list so the enemy chase the next point
			if (this.game.physics.arcade.distanceBetween(this.sprite, this.listTargetPos[0]) < 100)
				this.listTargetPos.shift();


		}
		else {
			if (this.waypoints !== undefined) {

				if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100) {
					this.sprite.move(this.target, 300);
				}
				else {
					this.currentWp++;
					if (this.currentWp === this.waypoints.length)
						this.currentWp = 0;
					this.target = this.waypoints[this.currentWp];
				}

			}
			else
				this.sprite.idle();

			//Reset the list
			this.listTargetPos = new Array();
		}


		if (dist < 90)
			this.sprite.attack(target);

	}
}

module.exports = BasicEnemy;
