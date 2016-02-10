
'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.background = this.game.add.sprite(0, 0, 'menu');

		this.background.height = this.game.height;
		this.background.width = this.game.width;

		var button = this.game.add.button(this.game.world.centerX - 95, 200, 'dolphin', play, this, 2, 1, 0);
		function play() {
			this.game.state.start('play', true, false, 'level0');
		}


		this.game.add.text(10, 300, "R: Reset current level", { font: "40px Arial", fill: "#bb00ff", align: "center"});
		this.game.add.text(10, 350, "1: Play level 1", { font: "40px Arial", fill: "#bb00ff", align: "center"});
		this.game.add.text(10, 400, "2: Play level 2", { font: "40px Arial", fill: "#bb00ff", align: "center"});

		this.game.add.text(10, 500, "Q: Show/Hide debug", { font: "40px Arial", fill: "#bb00ff", align: "center"});

		this.game.add.text(500, 500, "I/O: Unmute/mute", { font: "40px Arial", fill: "#bb00ff", align: "center"});

	},
	update: function() {

	}
};

module.exports = Menu;
