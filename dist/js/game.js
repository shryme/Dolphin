(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(900, 600, Phaser.AUTO, 'netmag-phaser');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){

var Shark = require('../sprites/shark');


function BasicEnemy(game, group, x, y) {
	this.game = game;

	this.entity = new Shark(game, group, x, y);
	this.entity.create();

	this.listTargetPos = new Array();

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.entity.update())
			return;

		var dist = this.game.physics.arcade.distanceBetween(this.entity.sprite, target.sprite);

		if (dist < 300) {
			//If close enough, chase the target
			this.entity.move(target, 500);

			//Reset the list
			this.listTargetPos = new Array();

		}
		else if (dist < 600 || this.listTargetPos.length !== 0) {

			//If still close but not enough to chase, add the current target position
			//to a list that the enemy will follow to try to find the target again
			this.listTargetPos.push({
				x: target.sprite.x,
				y: target.sprite.y
			});

			this.entity.move(this.listTargetPos[0], 400);

			//If the enemy is close enough to the history position of the target,
			//remove it from the list so the enemy chase the next point
			if (this.game.physics.arcade.distanceBetween(this.entity.sprite, this.listTargetPos[0]) < 100)
				this.listTargetPos.shift();


		}
		else
			this.entity.idle();


		if (dist < 90)
			this.entity.attack(target);

	}
}

module.exports = BasicEnemy;

},{"../sprites/shark":6}],3:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Friend(game, group, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, group, x, y);
	this.entity.create();

}

Friend.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.entity.update())
			return;

		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToXY(this.entity.sprite, 300, 300) > 100)
			this.entity.move(300, 300, 400);
		else
			this.entity.idle();

	}
}

module.exports = Friend;

},{"../sprites/dolphin":5}],4:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Player(game, group, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, group, x, y);
	this.entity.create();

}

Player.prototype = {
	create: function() {

	},
	update: function(cursors) {

		if (!this.entity.update())
			return;


		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToPointer(this.entity.sprite, this.game.input.activePointer) > 20)
			this.entity.move();
		else
			this.entity.idle();


	}
}

module.exports = Player;

},{"../sprites/dolphin":5}],5:[function(require,module,exports){

function Dolphin(game, group, x, y) {
	this.game = game;


	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	if (group !== undefined) {
		this.sprite = group.create(x, y, 'dolphin', 'r1.png');
	} else {
		this.sprite = this.game.add.sprite(x, y, 'dolphin', 'r1.png');
	}

	this.game.physics.arcade.enableBody(this.sprite);
	this.sprite.body.gravity.y = 0;
	this.sprite.body.collideWorldBounds = true;

	this.sprite.body.allowRotation = false;
	this.sprite.anchor.setTo(.5, .5);

	this.sprite.body.setSize(75, 50, 0, 0);


	var list = new Array();
	var listXY = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 6; i++) {
		list.push('r' + i + '.png');
		listXY.push('xy' + i + '.png');
		listAttack.push('attack' + i + '.png');
	}

	this.sprite.animations.add('moveX', list, 10, true, false);
	this.sprite.animations.add('moveXY', listXY, 10, true, false);
	this.sprite.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 10);
	this.sprite.animations.play('moveX');

	this.isAttacking = false;
	this.isDangerous = false;


	var fctStartAttacking = this.startAttack.bind(this);
	this.attackAnimation.onComplete.add(fctStartAttacking);



	this.attackDuration = 750;
	this.attackEnding;

	this.hp = 777;

}

Dolphin.prototype = {
	create: function() {

	},
	update: function() {

		if (this.isAttacking) {

			if (this.isDangerous) {

				if (this.game.time.time > this.attackEnding) {
					//After X time moving, we stop the attack and allow user to move like normal
					this.stopAttack();
					this.attackEnding = undefined;
				}
				else {
					//Moving after the animation
					this.moveForAttack();
				}

			}
			else {
				//Stop moving when the animation for attacking is playing
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}


			return false;

		}

		return true;

	},
	idle: function() {
		if (this.isAttacking)
			return

		this.sprite.animations.play('idle');
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},
	moveForAttack: function() {
		this.sprite.body.velocity.x = this.vx * -1;
		this.sprite.body.velocity.y = this.vy * -1;



	},
	startAttack: function() {
		this.attackEnding = this.game.time.time + this.attackDuration;
		this.isDangerous = true;

	},
	stopAttack: function() {
		this.isAttacking = false;
		this.isDangerous = false;
	},
	attack: function(x, y) {
		if (!this.isAttacking) {

			this.isAttacking = true;
			this.sprite.animations.play('attack');



			if (x === undefined && y === undefined) {
				x = this.game.input.worldX;
				y = this.game.input.worldY;
			}


			var dx = this.sprite.position.x - x;
			var dy = this.sprite.position.y - y;

			var attackDistance = 700;
			var factor = attackDistance / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

			this.vx = dx * factor;
			this.vy = dy * factor;

			this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, x, y);

			//Flip dolphin when moving to the left
			if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
				this.sprite.scale.y = -1;
			else
				this.sprite.scale.y = 1;


		}
	},
	move: function(x, y, speed) {


		if (speed === undefined)
			speed = 300;

		if (x === undefined && y === undefined) {
			this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500);
		}
		else {
			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, x, y, speed);
		}


		this.sprite.animations.play('moveX');

		//Flip dolphin when moving to the left
		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
			this.sprite.scale.y = -1;
		else
			this.sprite.scale.y = 1;


	},
	hurt: function(dmg) {
		this.hp -= dmg;
	}
}

module.exports = Dolphin;










},{}],6:[function(require,module,exports){

function Shark(game, group, x, y) {
	this.game = game;


	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	if (group !== undefined) {
		this.sprite = group.create(x, y, 'shark', 'm1.png');
	} else {
		this.sprite = this.game.add.sprite(x, y, 'shark', 'm1.png');
	}

	this.game.physics.arcade.enableBody(this.sprite);
	this.sprite.body.gravity.y = 0;
	this.sprite.body.collideWorldBounds = true;

	this.sprite.body.allowRotation = false;
	this.sprite.anchor.setTo(.5, .5);

	this.sprite.body.setSize(75, 50, 0, 0);


	var listMove = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 5; i++) {
		listMove.push('m' + i + '.png');
	}

	listAttack.push('a1.png');
	listAttack.push('a2.png');

	this.sprite.animations.add('move', listMove, 10, true, false);
	this.sprite.animations.add('idle', ['m1.png', 'm2.png'], 2, true, false);
	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 5);
	this.sprite.animations.play('move');


	var fctAttackComplete = this.attackComplete.bind(this);
	this.attackAnimation.onComplete.add(fctAttackComplete);

	this.currentTarget;
	this.isAttacking = false;

	this.dmg = 1;

}

Shark.prototype = {
	create: function() {

	},
	update: function() {

		return true;

	},
	idle: function() {

		this.sprite.animations.play('idle');
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},
	attackComplete: function() {
		this.isAttacking = false;
		this.currentTarget.hurt(this.dmg);
	},
	attack: function(target) {
		this.currentTarget = target;
		this.isAttacking = true;
		this.sprite.animations.play('attack');
	},
	move: function(target, speed) {

		if (target.sprite !== undefined)
			target = target.sprite;

		this.sprite.rotation = this.game.physics.arcade.moveToObject(this.sprite, target, speed);

		if (!this.isAttacking)
			this.sprite.animations.play('move');

		//Flip shark when moving to the left
		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
			this.sprite.scale.y = -1;
		else
			this.sprite.scale.y = 1;

	}
}

module.exports = Shark;










},{}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.gameoverbg = this.game.add.sprite(0, 0, 'gameover');
    this.score_text = this.game.add.text(this.game.world.centerX, 325, this.game.score, { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.score_text.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){

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
    	this.game.state.start('play');
    }

	},
	update: function() {

	}
};

module.exports = Menu;

},{}],10:[function(require,module,exports){

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



		this.txtHp = this.game.add.text(10, 10, "Hp: 100", { font: "65px Arial", fill: "#bb00ff", align: "center"});
		this.txtHp.fixedToCamera = true;
		this.txtHp.cameraOffset.setTo(10, 10);


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

		var player = this.player.entity;
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


		this.txtHp.text = "Hp: " + this.player.entity.hp;

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








},{"../objects/entity/basicEnemy":2,"../objects/entity/friend":3,"../objects/entity/player":4}],11:[function(require,module,exports){

'use strict';
function Preload() {
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('yeoman', 'assets/player.png');

		this.load.image('menu', 'assets/background.png');
		this.load.image('background', 'assets/background.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('creature_1', 'assets/creature_1.png');
		this.load.image('creature_2', 'assets/creature_2.png');
		this.load.image('creature_3', 'assets/creature_3.png');
		this.load.image('gameover', 'assets/background.png');

		this.load.tilemap('tilemap', 'assets/tilemaps/level0.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tileset', "assets/tilemaps/tileset.png");

		//this.load.spritesheet('dolphin', 'assets/sprites.png', 164, 72);

		this.load.atlasJSONHash('dolphin', 'assets/sprites/dolphin.png', 'assets/sprites/dolphin.json');
		this.load.atlasJSONHash('shark', 'assets/sprites/shark.png', 'assets/sprites/shark.json');
		this.load.atlasJSONHash('orca', 'assets/sprites/tara.png', 'assets/sprites/tara.json');


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

},{}]},{},[1])