
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
		// this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);




		this.game.physics.p2.convertTilemap(this.map, this.blockLayer);


		this.game.physics.p2.setImpactEvents(true);

		this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.dolphinsCollisionGroup = this.game.physics.p2.createCollisionGroup();







		this.list = new Array();

		//Group of friends, this contains only sprite
		this.groupFriends = this.game.add.group();

		this.groupDolphins = this.game.add.group();

		this.groupDolphins.enableBody = true;
		this.groupDolphins.physicsBodyType = Phaser.Physics.P2JS;
		// this.groupDolphins.setAll('body.fixedRotation', true);


		// this.groupObjectsTile = this.game.add.group();

		// this.groupAll = this.game.add.group();


		//Us
		this.player = new Player(this.game, this.groupDolphins);
		// this.player.entity.sprite.body.setCollisionGroup(this.playerCollisionGroup);
		// this.player.entity.sprite.body.collides(this.dolphinsCollisionGroup);


		var listObjectsDolphins = this.map.objects.dolphins;

		for (var i = 0; i < listObjectsDolphins.length;  i++) {
			var cur = listObjectsDolphins[i];
			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);
			// dolphin.entity.sprite.body.setCollisionGroup(this.dolphinsCollisionGroup);
			// dolphin.entity.sprite.body.collides([this.dolphinsCollisionGroup, this.playerCollisionGroup]);
			this.list.push(dolphin);
		}

		//Add camera to follow our player
		this.game.camera.follow(this.player.entity.sprite);

		this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

		// panda.body.setCollisionGroup(pandaCollisionGroup);

  //       //  Pandas will collide against themselves and the player
  //       //  If you don't set this they'll not collide with anything.
  //       //  The first parameter is either an array or a single collision group.
  //       panda.body.collides([pandaCollisionGroup, playerCollisionGroup]);


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
			// game.physics.arcade.collide(f.entity.sprite, blocks);
		});

		//Collide with friends
		// this.game.physics.arcade.collide(this.groupDolphins);

		//Collide with blocks
		// this.game.physics.arcade.collide(this.player.entity.sprite, this.blockLayer);

	},

	render: function() {
		this.game.debug.cameraInfo(this.game.camera, 32, 32);

		this.game.debug.body(this.player.entity.sprite);

		// this.player.entity.sprite.body.debugBody.draw();
	}

};

module.exports = Play;























// 'use strict';

// var Player = require('../objects/entity/player');
// var Friend = require('../objects/entity/friend');

// function Play() {}
// Play.prototype = {
// 	create: function() {

// 		this.game.physics.startSystem(Phaser.Physics.P2JS);

// 		this.game.physics.p2.setImpactEvents(true);

// 		this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
//     	this.dolphinsCollisionGroup = this.game.physics.p2.createCollisionGroup();

//     	this.game.physics.p2.updateBoundsCollisionGroup();

// 		// background
// 		this.bg = this.game.add.sprite(0, 0, 'background');


// 		//Load tiles
// 		this.map = this.game.add.tilemap('tilemap');
// 		this.map.addTilesetImage('basic', 'tileset');


// 		//Set background size with the size if the tileset
// 		this.bg.height = this.map.widthInPixels;
// 		this.bg.width = this.map.heightInPixels;
// 		this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


// 		//Create block layer, and add collision
// 		this.blockLayer = this.map.createLayer('block');
// 		this.map.setCollisionBetween(0, 5);




// 		this.list = new Array();

// 		//Group of friends, this contains only sprite
// 		this.groupFriends = this.game.add.group();

// 		this.groupDolphins = this.game.add.group();

// 		// this.groupObjectsTile = this.game.add.group();

// 		// this.groupAll = this.game.add.group();


// 		//Us
// 		this.player = new Player(this.game, this.groupDolphins);
// 		this.player.entity.sprite.body.setCollisionGroup(playerCollisionGroup);
// 		this.player.entity.sprite.body.collides(dolphinsCollisionGroup);


// 		var listObjectsDolphins = this.map.objects.dolphins;

// 		for (var i = 0; i < listObjectsDolphins.length;  i++) {
// 			var cur = listObjectsDolphins[i];
// 			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);
// 			dolphin.entity.sprite.body.setCollisionGroup(dolphinsCollisionGroup);
// 			dolphin.entity.sprite.body.collides([dolphinsCollisionGroup, playerCollisionGroup]);
// 			this.list.push(dolphin);
// 		}

// 		//Add camera to follow our player
// 		this.game.camera.follow(this.player.entity.sprite);


// 		// panda.body.setCollisionGroup(pandaCollisionGroup);

//   //       //  Pandas will collide against themselves and the player
//   //       //  If you don't set this they'll not collide with anything.
//   //       //  The first parameter is either an array or a single collision group.
//   //       panda.body.collides([pandaCollisionGroup, playerCollisionGroup]);


// 	},

// 	update: function() {

// 		//Get cursor
// 		var cursors = this.game.input.keyboard.createCursorKeys();

// 		//Update our player
// 		this.player.update(cursors);

// 		//Update all friends
// 		var game = this.game;
// 		var blocks = this.blockLayer;
// 		this.list.forEach(function(f) {
// 			f.update();
// 			game.physics.arcade.collide(f.entity.sprite, blocks);
// 		});

// 		//Collide with friends
// 		this.game.physics.arcade.collide(this.groupDolphins);

// 		//Collide with blocks
// 		this.game.physics.arcade.collide(this.player.entity.sprite, this.blockLayer);

// 	},

// 	render: function() {
// 		this.game.debug.cameraInfo(this.game.camera, 32, 32);
// 	}

// };

// module.exports = Play;











































//arcade


// 'use strict';

// var Player = require('../objects/entity/player');
// var Friend = require('../objects/entity/friend');

// function Play() {}
// Play.prototype = {
// 	create: function() {

// 		// background
// 		this.bg = this.game.add.sprite(0, 0, 'background');


// 		//Load tiles
// 		this.map = this.game.add.tilemap('tilemap');
// 		this.map.addTilesetImage('basic', 'tileset');


// 		//Set background size with the size if the tileset
// 		this.bg.height = this.map.widthInPixels;
// 		this.bg.width = this.map.heightInPixels;
// 		this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


// 		//Create block layer, and add collision
// 		this.blockLayer = this.map.createLayer('block');
// 		this.map.setCollisionBetween(0, 5);




// 		this.list = new Array();

// 		//Group of friends, this contains only sprite
// 		this.groupFriends = this.game.add.group();

// 		this.groupDolphins = this.game.add.group();

// 		// this.groupObjectsTile = this.game.add.group();

// 		// this.groupAll = this.game.add.group();


// 		//Us
// 		this.player = new Player(this.game, this.groupDolphins);



// 		var listObjectsDolphins = this.map.objects.dolphins;

// 		for (var i = 0; i < listObjectsDolphins.length;  i++) {
// 			var cur = listObjectsDolphins[i];
// 			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);
// 			this.list.push(dolphin);
// 		}

// 		//Add camera to follow our player
// 		this.game.camera.follow(this.player.entity.sprite);



// 	},

// 	update: function() {

// 		//Get cursor
// 		var cursors = this.game.input.keyboard.createCursorKeys();

// 		//Update our player
// 		this.player.update(cursors);

// 		//Update all friends
// 		var game = this.game;
// 		var blocks = this.blockLayer;
// 		this.list.forEach(function(f) {
// 			f.update();
// 			game.physics.arcade.collide(f.entity.sprite, blocks);
// 		});

// 		//Collide with friends
// 		this.game.physics.arcade.collide(this.groupDolphins);

// 		//Collide with blocks
// 		this.game.physics.arcade.collide(this.player.entity.sprite, this.blockLayer);

// 	},

// 	render: function() {
// 		this.game.debug.cameraInfo(this.game.camera, 32, 32);
// 	}

// };

// module.exports = Play;

