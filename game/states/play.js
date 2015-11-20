
'use strict';

var Player = require('../objects/entity/player');
var Friend = require('../objects/entity/friend');
var Shark = require('../objects/entity/basicEnemy');

function Play() {}
Play.prototype = {
	create: function() {

		this.showDebug = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
		this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);



		this.list = new Array();
		this.listEnemy = new Array();

		//Group of dolphins
		this.groupDolphins = this.game.add.group();

		//Group of dolphins
		this.groupSharks = this.game.add.group();


		//Us
		var spawn = this.map.objects.spawn[0];
		this.player = new Player(this.game, this.groupDolphins, spawn.x, spawn.y);

		var listObjectsDolphins = this.map.objects.dolphins;

		for (var i = 0; i < listObjectsDolphins.length;  i++) {
			var cur = listObjectsDolphins[i];
			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);

			this.list.push(dolphin);
		}

		var listObjectsSharks = this.map.objects.sharks;

		for (var i = 0; i < listObjectsSharks.length;  i++) {
			var cur = listObjectsSharks[i];
			var shark = new Shark(this.game, this.groupDolphins, cur.x, cur.y);

			this.listEnemy.push(shark);
		}


		//Add camera to follow our player
		this.game.camera.follow(this.player.entity.sprite);

		this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.debugKey.onDown.add(this.toggleDebug, this);

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
			game.physics.arcade.collide(f.entity.sprite, blocks);
		});

		var player = this.player.entity.sprite;
		this.listEnemy.forEach(function(f) {
			f.update(player);
			game.physics.arcade.collide(f.entity.sprite, blocks);
		});

		//Collide with friends
		this.game.physics.arcade.collide(this.groupDolphins);

		//Colision of sharks
		this.game.physics.arcade.collide(this.groupSharks);

		//Collision between sharks and dolphins
		this.game.physics.arcade.collide(this.groupDolphins, this.groupSharks);

		//Collide with blocks
		this.game.physics.arcade.collide(this.player.entity.sprite, this.blockLayer);

	},

	render: function() {

		if (this.showDebug) {

			this.game.debug.bodyInfo(this.player.entity.sprite, 32, 32);
			this.game.debug.body(this.player.entity.sprite);


			var game = this.game;
			this.list.forEach(function(f) {
				game.debug.body(f.entity.sprite);
			});
			this.listEnemy.forEach(function(f) {
				game.debug.body(f.entity.sprite);
			});

		}

	},



	toggleDebug: function() {
		this.showDebug = !this.showDebug;

		if (!this.showDebug)
		{
			this.game.debug.reset();
		}
	}

};

module.exports = Play;







