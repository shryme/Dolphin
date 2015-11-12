
'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.background = this.game.add.sprite(0, 0, 'menu');

		this.background.height = this.game.height;
		this.background.width = this.game.width;

		var button = this.game.add.button(this.game.world.centerX - 95, 200, 'creature_1', play, this, 2, 1, 0);
		var button = this.game.add.button(this.game.world.centerX - 95, 300, 'creature_2', showMaze, this, 2, 1, 0);
		var button = this.game.add.button(this.game.world.centerX - 95, 400, 'creature_3', generateMaze, this, 2, 1, 0);

    function play() {
    	this.game.state.start('play');
    }

    function showMaze() {
    	this.game.state.start('maze', true, false, true);
    }

    function generateMaze() {
    	this.game.state.start('maze', true, false, false);
    }

	},
	update: function() {
		if(this.game.input.activePointer.justPressed()) {
			// this.game.state.start('maze');
		}
	}
};

module.exports = Menu;
