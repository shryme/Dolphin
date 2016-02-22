
'use strict';
function Preload() {
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.background = this.game.add.sprite(0, 0, 'preloader_background');

		this.background.height = this.game.height;
		this.background.width = this.game.width;

		this.asset = this.add.sprite(0, this.game.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);




		this.load.image('menu', 'assets/background.png');
		this.load.image('background', 'assets/background.png');

		for (var i = 0; i <= 1; i++) {
			this.load.tilemap('level' + i, 'assets/tilemaps/level' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
		}

		this.load.image('tileset', "assets/tilemaps/tileset.png");

		this.load.atlasJSONHash('dolphin', 'assets/sprites/dolphin.png', 'assets/sprites/dolphin.json');
		this.load.atlasJSONHash('shark', 'assets/sprites/shark.png', 'assets/sprites/shark.json');
		this.load.atlasJSONHash('orca', 'assets/sprites/tara.png', 'assets/sprites/tara.json');
		this.load.atlasJSONHash('turtle', 'assets/sprites/turtle.png', 'assets/sprites/turtle.json');
		this.load.atlasJSONHash('powerup', 'assets/sprites/powerup.png', 'assets/sprites/powerup.json');
		this.load.atlasJSONHash('objects', 'assets/sprites/objects.png', 'assets/sprites/objects.json');

		this.load.atlasJSONHash('waterdrops', 'assets/sprites/water_drops.png', 'assets/sprites/water_drops.json');
		this.load.atlasJSONHash('waterwave', 'assets/sprites/water_wave.png', 'assets/sprites/water_wave.json');
		this.load.atlasJSONHash('waterfall', 'assets/sprites/waterfall.png', 'assets/sprites/waterfall.json');


		this.load.audio('greenHills', 'assets/music/Green_Hills.mp3');

		this.load.audio('sfx', 'assets/sound/sfx.ogg');


	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if(!!this.ready) {
			this.game.state.start('menu');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;
