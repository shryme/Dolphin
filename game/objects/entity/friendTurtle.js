
var Turtle = require('../sprites/turtle');


function FriendTurtle(game, x, y, wp) {

	this.game = game;

	this.sprite = new Turtle(game, x, y);

	this.sprite.create();

	this.target = {x: 700, y: 700};

	this.waypoints = wp;
	this.currentWp = 0;

	if (wp !== undefined)
		this.target = wp[0];

}

FriendTurtle.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.sprite.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100) {
			this.sprite.move(this.target, 400);
		}
		else {
			if (this.waypoints !== undefined) {
				this.currentWp++;
				if (this.currentWp === this.waypoints.length)
					this.currentWp = 0;
				this.target = this.waypoints[this.currentWp];
			}
			else
				this.sprite.idle();
		}

	}
}

module.exports = FriendTurtle;
