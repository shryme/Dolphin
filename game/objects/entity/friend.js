
var Dolphin = require('../sprites/dolphin');


function Friend(game, x, y, wp) {
	this.game = game;

	this.sprite = new Dolphin(game, x, y, this);
	this.sprite.create();


	this.target = {x: 372, y: 1142};

	this.waypoints = wp;
	this.currentWp = 0;

	if (wp !== undefined)
		this.target = wp[0];

}

Friend.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.sprite.update())
			return;

		if (this.game.input.activePointer.isDown)
			this.sprite.attack();
		else if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100)
			this.sprite.move(this.target, 400);
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

module.exports = Friend;
