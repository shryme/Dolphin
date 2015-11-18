
'use strict';

var Player = require('../objects/entity/player');
var Friend = require('../objects/entity/friend');

function Play() {}
Play.prototype = {
	create: function() {

		this.game.physics.startSystem(Phaser.Physics.P2JS);

    	// this.game.physics.p2.updateBoundsCollisionGroup();

		// background
		this.bg = this.game.add.sprite(0, 0, 'background');


		//Load tiles
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('basic', 'tileset');

		//Create block layer, and add collision
		this.blockLayer = this.map.createLayer('block');
		this.blockLayer.resizeWorld();
		this.map.setCollisionBetween(0, 5);


		//Set background size with the size if the tileset
		this.bg.height = this.map.widthInPixels;
		this.bg.width = this.map.heightInPixels;





		this.game.physics.p2.convertTilemap(this.map, this.blockLayer);


		this.game.physics.p2.setImpactEvents(true);



		this.list = new Array();

		//Group of friends, this contains only sprite
		this.groupFriends = this.game.add.group();

		this.groupDolphins = this.game.add.group();

		this.groupDolphins.enableBody = true;
		this.groupDolphins.physicsBodyType = Phaser.Physics.P2JS;

		//Us
		this.player = new Player(this.game, this.groupDolphins);

		var listObjectsDolphins = this.map.objects.dolphins;

		for (var i = 0; i < listObjectsDolphins.length;  i++) {
			var cur = listObjectsDolphins[i];
			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);

			this.list.push(dolphin);
		}

		//Add camera to follow our player
		this.game.camera.follow(this.player.entity.sprite);

		this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);


	},

	update: function() {

		//Get cursor
		var cursors = this.game.input.keyboard.createCursorKeys();

		//Update our player
		this.player.update(cursors);

		//Update all friends
		var game = this.game;
		var blocks = this.blockLayer;
		this.list.forEach(function(f) {
			f.update();
		});

	},

	render: function() {
		this.game.debug.cameraInfo(this.game.camera, 32, 32);

		// this.game.debug.body(this.player.entity.sprite);

	}

};

module.exports = Play;







