'use strict';

var Player = require('../objects/entity/player');
var Friend = require('../objects/entity/friend');
var Shark = require('../objects/entity/basicEnemy');
var Orca = require('../objects/entity/friendOrca');
var Turtle = require('../objects/entity/friendTurtle');

var Powerup = require('../objects/sprites/powerup');

var Particles = require('../objects/particle/particles');


var tileIndex = {
	empty: -1,
	invisibleGravity: 900,
	visibleGravity: 866,
	downForce: 894,
	waterwave: 871,
	waterfall_top: 845,
	waterfall: 875
}



/*******************************************************
Use to augment sprite, could be done better! */

//Add function to flip sprite when looking to the left
Phaser.Sprite.prototype.flipSprite = function() {
	if (this.rotation < -1.5 || this.rotation > 1.5)
		this.scale.y = -1;
	else
		this.scale.y = 1;
}

//Global initialize
Phaser.Sprite.prototype.initialize = function() {

}

/*
Sprite end!
*******************************************************/








function Play() {}
Play.prototype = {
	init: function(level) {
		console.log('init', level);
		this.currentLevel = level;
	},

	create: function() {
		console.log('create');

		this.showDebug = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);


		// background
		this.bg = this.game.add.sprite(0, 0, 'background');


		//Load tiles
		this.map = this.game.add.tilemap(this.currentLevel);
		this.map.addTilesetImage('basic', 'tileset');

		//Create block layer, and add collision
		this.map.createLayer('background');
		this.blockLayer = this.map.createLayer('block');
		this.blockLayer.resizeWorld();
		this.overlapLayer = this.map.createLayer('overlap');


		this.map.setCollisionBetween(0, 890, true, this.blockLayer);
		this.map.setCollisionBetween(900, 1000, true, this.blockLayer);
		// this.map.setCollisionByExclusion([tileIndex.downForce], true, this.blockLayer);
		this.map.setCollisionBetween(0, 1000, true, this.overlapLayer);


		this.groupWaves = this.game.add.group();
		this.map.createFromTiles(tileIndex.waterwave, tileIndex.empty, 'waterwave', "background", this.groupWaves);

		var waterAnimation = ['water1.png', 'water2.png', 'water2.png'];

		this.groupWaves.forEach(
			function(tile){
				tile.animations.add('waterwave', waterAnimation, 5, true, false);
				tile.animations.play('waterwave');

				tile.animations.next(this.blockLayer.getTileX(tile.x) % 3);

			}, this
		);




		this.groupWaterfallsTop = this.game.add.group();
		this.map.createFromTiles(tileIndex.waterfall_top, tileIndex.empty, 'waterfall', "background", this.groupWaterfallsTop);

		var waterfallTopAnimation = ['waterfall_top1.png', 'waterfall_top2.png'];

		this.groupWaterfallsTop.forEach(
			function(tile){
				tile.animations.add('waterfall', waterfallTopAnimation, 2, true, false);
				tile.animations.play('waterfall');

			}, this
		);



		this.groupWaterfalls = this.game.add.group();
		this.map.createFromTiles(tileIndex.waterfall, tileIndex.empty, 'waterfall', "background", this.groupWaterfalls);

		var waterfallAnimation = ['waterfall1.png', 'waterfall2.png', 'waterfall3.png', 'waterfall4.png'];

		this.groupWaterfalls.forEach(
			function(tile){
				tile.animations.add('waterfall', waterfallAnimation, 10, true, false);
				tile.animations.play('waterfall');

				tile.animations.next(this.blockLayer.getTileX(tile.x) % 3);

			}, this
		);





		//Set background size with the size if the tileset
		this.bg.height = this.map.widthInPixels;
		this.bg.width = this.map.heightInPixels;
		this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);




		this.list = new Array();
		this.listEnemy = new Array();
		this.listWaypoints = {};

		//Group of dolphins
		this.groupDolphins = this.game.add.group();

		//Group of sharks
		this.groupSharks = this.game.add.group();

		//Group of orcas
		this.groupOrcas = this.game.add.group();

		//Group of turtles
		this.groupTurtles = this.game.add.group();

		//Group of powerups
		this.groupPowerups = this.game.add.group();

		this.particles = new Particles(this);
		this.game.customParticles = this.particles;

		//Us
		var spawn = this.map.objects.spawn[0];
		this.player = new Player(this.game, spawn.x, spawn.y);
		this.groupDolphins.add(this.player.sprite);


		var listObjectsWaypoints = this.map.objects.waypoints;

		for (var i = 0; i < listObjectsWaypoints.length;  i++) {
			var cur = listObjectsWaypoints[i];
			var listWpUpdated = new Array();

			for (var j = 0; j < cur.polyline.length; j++) {

				var posWp = {
					x: cur.polyline[j][0] + cur.x,
					y: cur.polyline[j][1] + cur.y,
				}

				listWpUpdated.push(posWp);
			}

			this.listWaypoints[cur.name] = listWpUpdated;
		}



		var listObjectsDolphins = this.map.objects.dolphins;

		for (var i = 0; i < listObjectsDolphins.length;  i++) {
			var cur = listObjectsDolphins[i];
			var dolphin = new Friend(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupDolphins.add(dolphin.sprite);

			this.list.push(dolphin);
		}

		var listObjectsSharks = this.map.objects.sharks;

		for (var i = 0; i < listObjectsSharks.length;  i++) {
			var cur = listObjectsSharks[i];
			var shark = new Shark(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupSharks.add(shark.sprite);

			this.listEnemy.push(shark);
		}


		var listObjectsOrcas = this.map.objects.orcas;

		for (var i = 0; i < listObjectsOrcas.length;  i++) {
			var cur = listObjectsOrcas[i];
			var orca = new Orca(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupOrcas.add(orca.sprite);

			this.list.push(orca);
		}

		var listObjectsTurtles = this.map.objects.turtles;

		for (var i = 0; i < listObjectsTurtles.length;  i++) {
			var cur = listObjectsTurtles[i];
			var turtle = new Turtle(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupTurtles.add(turtle.sprite);

			this.list.push(turtle);
		}

		var listObjectsPowerups = this.map.objects.powerups;

		for (var i = 0; i < listObjectsPowerups.length;  i++) {
			var cur = listObjectsPowerups[i];
			var powerup = new Powerup(this.game, cur.x, cur.y, cur.properties.type);
			this.groupPowerups.add(powerup);
		}


		//Add camera to follow our player
		this.game.camera.follow(this.player.sprite);

		this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.debugKey.onDown.add(this.toggleDebug, this);

		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.resetKey.onDown.add(this.resetGame, this);

		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.resetKey.onDown.add(this.resetGame, this);

		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
		this.resetKey.onDown.add(this.goToLevelZero, this);

		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
		this.resetKey.onDown.add(this.goToLevelOne, this);




		this.txtHp = this.game.add.text(10, 10, "Hp: 100", { font: "65px Arial", fill: "#bb00ff", align: "center"});
		this.txtHp.fixedToCamera = true;
		this.txtHp.cameraOffset.setTo(10, 10);

		for (var i = 0; i < this.overlapLayer.layer.data.length; i++)
			for (var j = 0; j < this.overlapLayer.layer.data[i].length; j++)
				if (this.overlapLayer.layer.data[i][j].index === tileIndex.invisibleGravity ||
					this.overlapLayer.layer.data[i][j].index === tileIndex.downForce)
					this.overlapLayer.layer.data[i][j].alpha = 0;


	},

	update: function() {

		this.particles.update();

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

		for (var i = this.listEnemy.length-1; i >= 0; i--) {
			if (this.listEnemy[i].sprite.alive === false)
				this.listEnemy.splice(i, 1);
			else
				this.listEnemy[i].update(this.player.sprite);
		}

		//Collide with friends
		this.game.physics.arcade.collide(this.groupDolphins);

		//Colision of sharks
		this.game.physics.arcade.collide(this.groupSharks);

		//Colision of orcas
		this.game.physics.arcade.collide(this.groupOrcas);

		//Colision of turtles
		this.game.physics.arcade.collide(this.groupTurtles);

		//Collision between sharks and dolphins
		this.game.physics.arcade.collide(this.groupDolphins, this.groupSharks, undefined, this.dolphinProcessCallback, this);

		this.game.physics.arcade.collide(this.groupDolphins, this.groupOrcas);
		this.game.physics.arcade.collide(this.groupSharks, this.groupOrcas);
		this.game.physics.arcade.collide(this.groupTurtles, this.groupOrcas);

		this.game.physics.arcade.collide(this.groupDolphins, this.groupTurtles);
		this.game.physics.arcade.collide(this.groupSharks, this.groupTurtles);

		//Collide with blocks
		this.game.physics.arcade.collide(this.groupSharks, this.blockLayer);
		this.game.physics.arcade.collide(this.groupDolphins, this.blockLayer);
		this.game.physics.arcade.collide(this.groupOrcas, this.blockLayer);
		this.game.physics.arcade.collide(this.groupTurtles, this.blockLayer);

		//Overlap for gravity
		this.game.physics.arcade.overlap(this.groupDolphins, this.overlapLayer, undefined, this.addGravity, this);
		this.game.physics.arcade.overlap(this.groupSharks, this.overlapLayer, undefined, this.addGravity, this);
		this.game.physics.arcade.overlap(this.groupOrcas, this.overlapLayer, undefined, this.addGravity, this);
		this.game.physics.arcade.overlap(this.groupTurtles, this.overlapLayer, undefined, this.addGravity, this);


		//Detect powerup collision
		this.game.physics.arcade.overlap(this.groupPowerups, this.player.sprite, undefined, this.powerupCollision, this);

		this.txtHp.text = "Hp: " + this.player.sprite.hp;

	},

	render: function() {

		if (this.showDebug) {

			this.game.debug.bodyInfo(this.player.sprite, 32, 32);
			this.game.debug.body(this.player.sprite);


			var game = this.game;
			this.list.forEach(function(f) {
				game.debug.body(f.sprite);
			});
			this.listEnemy.forEach(function(f) {
				game.debug.body(f.sprite);
			});

		}

	},

	dolphinProcessCallback: function(dolphin, enemy) {
		return dolphin.processCallback(enemy);
	},

	toggleDebug: function() {
		this.showDebug = !this.showDebug;

		if (!this.showDebug)
			this.game.debug.reset();
	},

	resetGame: function() {
		this.game.state.start('play', true, false, this.currentLevel);
	},

	goToLevelZero: function() {
		this.game.state.start('play', true, false, 'level0');
	},

	goToLevelOne: function() {
		this.game.state.start('play', true, false, 'level1');
	},

	addGravity: function(sprite, tile) {

		if (tile.index === tileIndex.invisibleGravity || tile.index === tileIndex.visibleGravity) {
			if(sprite.addGravity !== undefined)
				sprite.addGravity(this.blockLayer, this.overlapLayer, [tileIndex.empty, tileIndex.downForce]);
		}
		else if (tile.index === tileIndex.downForce) {
			sprite.body.gravity.y = 18000;
		}
		else {
			if(sprite.removeGravity !== undefined)
				sprite.removeGravity();
		}


		return false;
	},

	powerupCollision: function(dolphin, powerup) {
		dolphin.items[powerup.powerupType] = true;
		powerup.destroy();
	}


};

module.exports = Play;




