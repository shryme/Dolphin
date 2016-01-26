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
},{"./states/boot":11,"./states/gameover":12,"./states/menu":13,"./states/play":14,"./states/preload":15}],2:[function(require,module,exports){

var Shark = require('../sprites/shark');


function BasicEnemy(game, x, y, wp) {
	this.game = game;

	this.entity = new Shark(game, x, y);
	this.entity.create();

	this.listTargetPos = new Array();

	this.target = {x: 300, y: 300};

	this.waypoints = wp;
	this.currentWp = 0;

	if (wp !== undefined)
		this.target = wp[0];

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.entity.update())
			return;

		var dist = this.game.physics.arcade.distanceBetween(this.entity, target);



		if (dist < 300) {
			//If close enough, chase the target
			this.entity.move(target, 500);

			//Reset the list
			this.listTargetPos = new Array();

		}
		else if (dist < 600 && this.listTargetPos.length <= 100) {

			//If still close but not enough to chase, add the current target position
			//to a list that the enemy will follow to try to find the target again
			this.listTargetPos.push({
				x: target.x,
				y: target.y
			});

			this.entity.move(this.listTargetPos[0], 400);

			//If the enemy is close enough to the history position of the target,
			//remove it from the list so the enemy chase the next point
			if (this.game.physics.arcade.distanceBetween(this.entity, this.listTargetPos[0]) < 100)
				this.listTargetPos.shift();


		}
		else {
			if (this.waypoints !== undefined) {

				if (this.game.physics.arcade.distanceBetween(this.entity, this.target) > 100) {
					this.entity.move(this.target, 300);
				}
				else {
					this.currentWp++;
					if (this.currentWp === this.waypoints.length)
						this.currentWp = 0;
					this.target = this.waypoints[this.currentWp];
				}

			}
			else
				this.entity.idle();

			//Reset the list
			this.listTargetPos = new Array();
		}


		if (dist < 90)
			this.entity.attack(target);

	}
}

module.exports = BasicEnemy;

},{"../sprites/shark":9}],3:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Friend(game, x, y, wp) {
	this.game = game;

	this.entity = new Dolphin(game, x, y);
	this.entity.create();


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

		if (!this.entity.update())
			return;

		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceBetween(this.entity, this.target) > 100)
			this.entity.move(this.target, 400);
		else {
			if (this.waypoints !== undefined) {
				this.currentWp++;
				if (this.currentWp === this.waypoints.length)
					this.currentWp = 0;
				this.target = this.waypoints[this.currentWp];
			}
			else
				this.entity.idle();
		}

	}
}

module.exports = Friend;

},{"../sprites/dolphin":7}],4:[function(require,module,exports){

var Orca = require('../sprites/orca');


function FriendOrca(game, x, y, wp) {

	this.game = game;

	this.entity = new Orca(game, x, y);
	// this.entity = new Orca(game, group, x, y);
	this.entity.create();

	this.target = {x: 700, y: 700};

	this.waypoints = wp;
	this.currentWp = 0;

	if (wp !== undefined)
		this.target = wp[0];

}

FriendOrca.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.entity.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.entity, this.target) > 100) {
			this.entity.move(this.target, 400);
		}
		else {
			if (this.waypoints !== undefined) {
				this.currentWp++;
				if (this.currentWp === this.waypoints.length)
					this.currentWp = 0;
				this.target = this.waypoints[this.currentWp];
			}
			else
				this.entity.idle();
		}

	}
}

module.exports = FriendOrca;

},{"../sprites/orca":8}],5:[function(require,module,exports){

var Turtle = require('../sprites/turtle');


function FriendTurtle(game, x, y, wp) {

	this.game = game;

	this.entity = new Turtle(game, x, y);

	this.entity.create();

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

		if (!this.entity.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.entity, this.target) > 100) {
			this.entity.move(this.target, 400);
		}
		else {
			if (this.waypoints !== undefined) {
				this.currentWp++;
				if (this.currentWp === this.waypoints.length)
					this.currentWp = 0;
				this.target = this.waypoints[this.currentWp];
			}
			else
				this.entity.idle();
		}

	}
}

module.exports = FriendTurtle;

},{"../sprites/turtle":10}],6:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Player(game, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, x, y);
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
		else if (this.game.physics.arcade.distanceToPointer(this.entity, this.game.input.activePointer) > 20)
			this.entity.move();
		else
			this.entity.idle();


	}
}

module.exports = Player;

},{"../sprites/dolphin":7}],7:[function(require,module,exports){

function Dolphin(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'dolphin', 'r1.png');

	this.initialize();

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var list = new Array();
	var listXY = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 6; i++) {
		list.push('r' + i + '.png');
		listXY.push('xy' + i + '.png');
		listAttack.push('attack' + i + '.png');
	}

	this.animations.add('moveX', list, 10, true, false);
	this.animations.add('moveXY', listXY, 10, true, false);
	this.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
	this.attackAnimation = this.animations.add('attack', listAttack, 15);
	this.animations.play('moveX');

	this.isAttacking = false;
	this.isDangerous = false;


	var fctStartAttacking = this.startAttack.bind(this);
	this.attackAnimation.onComplete.add(fctStartAttacking);



	this.attackDuration = 750;
	this.attackEnding;

	this.hp = 777;
	this.dmg = 1;

	game.add.existing(this);

}

Dolphin.prototype = Object.create(Phaser.Sprite.prototype);
Dolphin.prototype.constructor = Dolphin;


Dolphin.prototype.create = function() {

}

Dolphin.prototype.updateGravity = function() {
	// if (this.isInGravity && this.x > 1000) {
	if (this.isInGravity) {

		this.targetJump = this.listGravityPos[this.currentWp];

		if (this.targetJump === undefined)
			debugger

		if (this.game.physics.arcade.distanceBetween(this, this.targetJump) > 10) {
			this.move(this.targetJump, 600, 50);
		}
		else {
			this.currentWp++;

			if (this.currentWp >= this.listGravityPos.length) {

				this.listGravityPos = new Array();
				this.isInGravity = false;
				return false;
			}
			this.targetJump = this.listGravityPos[this.currentWp];
		}


		return false;
	}
	return true;
}

Dolphin.prototype.update = function() {

	if (!this.updateGravity())
		return false;

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
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
		}


		return false;

	}

	return true;

}

Dolphin.prototype.idle = function() {
	if (this.isAttacking)
		return

	this.animations.play('idle');
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
}

Dolphin.prototype.moveForAttack = function() {
	this.body.velocity.x = this.vx * -1;
	this.body.velocity.y = this.vy * -1;
}

Dolphin.prototype.startAttack = function() {
	this.attackEnding = this.game.time.time + this.attackDuration;
	this.isDangerous = true;
}

Dolphin.prototype.stopAttack = function() {
	this.isAttacking = false;
	this.isDangerous = false;
}

Dolphin.prototype.attack = function(x, y) {
	if (!this.isAttacking) {

		this.isAttacking = true;
		this.animations.play('attack');

		if (x === undefined && y === undefined) {
			x = this.game.input.worldX;
			y = this.game.input.worldY;
		}


		var dx = this.position.x - x;
		var dy = this.position.y - y;

		var attackDistance = 750;
		var factor = attackDistance / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		this.vx = dx * factor;
		this.vy = dy * factor;

		this.rotation = this.game.physics.arcade.angleToXY(this, x, y);

		//Flip dolphin when moving to the left
		if (this.rotation < -1.5 || this.rotation > 1.5)
			this.scale.y = -1;
		else
			this.scale.y = 1;


	}
}

Dolphin.prototype.move = function(target, speed, maxTime) {

	if (speed === undefined)
		speed = 300;

	if (target === undefined) {
		this.rotation = this.game.physics.arcade.moveToPointer(this, speed, this.game.input.activePointer, 500);
	}
	else {
		this.rotation = this.game.physics.arcade.moveToObject(this, target, speed, maxTime);
	}


	this.animations.play('moveX');

	this.flipSprite();

}

Dolphin.prototype.hurt = function(dmg) {
	this.hp -= dmg;
}


Dolphin.prototype.processCallback = function(enemy) {

	if (enemy.key === "shark") {
		if (this.isDangerous) {
			enemy.hurt(this.dmg);
			return false;
		}
	}

	return true;

}


module.exports = Dolphin;










},{}],8:[function(require,module,exports){

function Orca(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'orca', 'm1.png');

	this.initialize();

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listMove = new Array();

	for (var i = 1; i <= 8; i++) {
		listMove.push('m' + i + '.png');
	}


	this.animations.add('move', listMove, 10, true, false);
	this.animations.add('idle', ['m1.png', 'm2.png'], 2, true, false);
	this.animations.play('move');

	game.add.existing(this);

}

Orca.prototype = Object.create(Phaser.Sprite.prototype);
Orca.prototype.constructor = Orca;

Orca.prototype.create = function() {

}

Orca.prototype.update = function() {

	return true;
}

Orca.prototype.idle = function() {

	this.animations.play('idle');
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
}

Orca.prototype.move = function(target, speed) {
	// if (target.sprite !== undefined)
	// 	target = target.sprite;

	this.rotation = this.game.physics.arcade.moveToObject(this, target, speed);

	this.animations.play('move');

	this.flipSprite();

}

module.exports = Orca;










},{}],9:[function(require,module,exports){

function Shark(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'shark', 'm1.png');

	this.initialize();

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listMove = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 5; i++) {
		listMove.push('m' + i + '.png');
	}

	listAttack.push('a1.png');
	listAttack.push('a2.png');

	this.animations.add('move', listMove, 10, true, false);
	this.animations.add('idle', ['m1.png', 'm2.png'], 2, true, false);
	this.attackAnimation = this.animations.add('attack', listAttack, 5);
	this.animations.play('move');


	var fctAttackComplete = this.attackComplete.bind(this);
	this.attackAnimation.onComplete.add(fctAttackComplete);

	this.currentTarget;
	this.isAttacking = false;

	this.hp = 1;
	this.dmg = 1;


	game.add.existing(this);

}

Shark.prototype = Object.create(Phaser.Sprite.prototype);
Shark.prototype.constructor = Shark;


Shark.prototype.create = function() {

}

Shark.prototype.update = function() {
	return true;
}

Shark.prototype.idle = function() {
	this.animations.play('idle');
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
}

Shark.prototype.attackComplete = function() {
	this.isAttacking = false;
	this.currentTarget.hurt(this.dmg);
}

Shark.prototype.attack = function(target) {
	this.currentTarget = target;
	this.isAttacking = true;
	this.animations.play('attack');
}

Shark.prototype.move = function(target, speed) {

	this.rotation = this.game.physics.arcade.moveToObject(this, target, speed);

	if (!this.isAttacking)
		this.animations.play('move');

	this.flipSprite();

}

Shark.prototype.hurt = function(dmg) {
	this.hp -= dmg;
	if (this.hp <= 0) {
		this.destroy();
	}
}


module.exports = Shark;


},{}],10:[function(require,module,exports){

function Turtle(game, x, y) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'turtle', 's1.png');

	this.initialize();

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listMove = new Array();

	for (var i = 1; i <= 10; i++) {
		listMove.push('s' + i + '.png');
	}

	this.animations.add('move', listMove, 10, true, false);
	this.animations.add('idle', ['s1.png', 's2.png'], 2, true, false);
	this.animations.play('move');

	game.add.existing(this);

}

Turtle.prototype = Object.create(Phaser.Sprite.prototype);
Turtle.prototype.constructor = Turtle;

Turtle.prototype.create = function() {

}

Turtle.prototype.update = function() {

	return true;
}

Turtle.prototype.idle = function() {

	this.animations.play('idle');
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
}

Turtle.prototype.move = function(target, speed) {

	this.rotation = this.game.physics.arcade.moveToObject(this, target, speed);

	this.animations.play('move');

	this.flipSprite();

}

module.exports = Turtle;










},{}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){

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

},{}],13:[function(require,module,exports){

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

},{}],14:[function(require,module,exports){
'use strict';

var Player = require('../objects/entity/player');
var Friend = require('../objects/entity/friend');
var Shark = require('../objects/entity/basicEnemy');
var Orca = require('../objects/entity/friendOrca');
var Turtle = require('../objects/entity/friendTurtle');

var tileIndex = {
	empty: -1,
	invisibleGravity: 8
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

//Add gravity
Phaser.Sprite.prototype.addGravity = function() {

	if (!this.isInGravity) {
		this.isInGravity = true;
		this.currentWp = 0;
		// this.body.gravity.y = 15000;





		function toRadians (angle) {
			return angle * (Math.PI / 180);
		}


		var t = 1;

		var vo = 75;

		vo = Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
		vo = vo / 6;

		var theta = this.angle * -1;
		var g = 9.8;

		var vox = vo * Math.cos(toRadians(theta));
		var voy = vo * Math.sin(toRadians(theta));

		var x = vox * t;
		var y = voy * t + 0.5 * g * Math.pow(t, 2);


		var totalTime = ((voy) / g) * 2;

		totalTime += 2;

		var isRightToLeft = false;

		if (totalTime < 0) {
			isRightToLeft = true;
			totalTime = totalTime * -1;
		}


		this.listGravityPos = new Array();

		if (this.key === 'dolphin') {

			for (var i = 0.0; i < totalTime; i = i + 0.5) {
				var x = vox * i;
				var y = voy * i + 0.5 * -9.8 * Math.pow(i, 2);

				if (isRightToLeft)
					x = this.x - x;
				else
					x = this.x + x;

				this.listGravityPos.push({x: x, y: this.y - y});
			}


		}






		// console.log(x + " - " + y, this);


	}



}

//Remove gravity
Phaser.Sprite.prototype.removeGravity = function() {

	// if (this.isInGravity && this.listGravityPos.length === 0) {
	// 	this.isInGravity = false;
	// 	this.listGravityPos = new Array();

	// 	this.body.gravity.y = 0;
	// }



}

//Execute gravity
Phaser.Sprite.prototype.executeGravity = function() {
	if (this.rotation < -1.5 || this.rotation > 1.5)
		this.scale.y = -1;
	else
		this.scale.y = 1;
}



//Global initialize


Phaser.Sprite.prototype.initialize = function() {
	this.isInGravity = false;
	this.listGravityPos = new Array();
}

/*
Sprite end!
*******************************************************/








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
		this.overlapLayer = this.map.createLayer('overlap');


		this.map.setCollisionBetween(0, 10, true, this.blockLayer);
		this.map.setCollisionBetween(0, 10, true, this.overlapLayer);


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


		//Us
		var spawn = this.map.objects.spawn[0];
		this.player = new Player(this.game, spawn.x, spawn.y);
		this.groupDolphins.add(this.player.entity);



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
			this.groupDolphins.add(dolphin.entity);

			this.list.push(dolphin);
		}

		var listObjectsSharks = this.map.objects.sharks;

		for (var i = 0; i < listObjectsSharks.length;  i++) {
			var cur = listObjectsSharks[i];
			var shark = new Shark(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupSharks.add(shark.entity);

			this.listEnemy.push(shark);
		}


		var listObjectsOrcas = this.map.objects.orcas;

		for (var i = 0; i < listObjectsOrcas.length;  i++) {
			var cur = listObjectsOrcas[i];
			var orca = new Orca(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupOrcas.add(orca.entity);

			this.list.push(orca);
		}

		var listObjectsTurtles = this.map.objects.turtles;

		for (var i = 0; i < listObjectsTurtles.length;  i++) {
			var cur = listObjectsTurtles[i];
			var turtle = new Turtle(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp]);
			this.groupTurtles.add(turtle.entity);

			this.list.push(turtle);
		}


		//Add camera to follow our player
		this.game.camera.follow(this.player.entity);

		this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.debugKey.onDown.add(this.toggleDebug, this);



		this.txtHp = this.game.add.text(10, 10, "Hp: 100", { font: "65px Arial", fill: "#bb00ff", align: "center"});
		this.txtHp.fixedToCamera = true;
		this.txtHp.cameraOffset.setTo(10, 10);

		for (var i = 0; i < this.overlapLayer.layer.data.length; i++)
			for (var j = 0; j < this.overlapLayer.layer.data[i].length; j++)
				if (this.overlapLayer.layer.data[i][j].index === tileIndex.invisibleGravity)
					this.overlapLayer.layer.data[i][j].alpha = 0;


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

		for (var i = this.listEnemy.length-1; i >= 0; i--) {
			if (this.listEnemy[i].entity.alive === false)
				this.listEnemy.splice(i, 1);
			else
				this.listEnemy[i].update(this.player.entity);
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

		this.txtHp.text = "Hp: " + this.player.entity.hp;

	},

	render: function() {

		if (this.showDebug) {

			this.game.debug.bodyInfo(this.player.entity, 32, 32);
			this.game.debug.body(this.player.entity);


			var game = this.game;
			this.list.forEach(function(f) {
				game.debug.body(f.entity);
			});
			this.listEnemy.forEach(function(f) {
				game.debug.body(f.entity);
			});

		}

	},

	dolphinProcessCallback: function(dolphin, enemy) {
		return dolphin.processCallback(enemy);
	},

	toggleDebug: function() {
		this.showDebug = !this.showDebug;

		if (!this.showDebug)
		{
			this.game.debug.reset();
		}
	},

	addGravity: function(sprite, tile) {
		if (tile.index !== tileIndex.empty)
			sprite.addGravity();
		else
			sprite.removeGravity();
		return false;
	}


};

module.exports = Play;





},{"../objects/entity/basicEnemy":2,"../objects/entity/friend":3,"../objects/entity/friendOrca":4,"../objects/entity/friendTurtle":5,"../objects/entity/player":6}],15:[function(require,module,exports){

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

		this.load.image('menu', 'assets/background.png');
		this.load.image('background', 'assets/background.png');

		this.load.tilemap('tilemap', 'assets/tilemaps/level0.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tileset', "assets/tilemaps/tileset.png");

		this.load.atlasJSONHash('dolphin', 'assets/sprites/dolphin.png', 'assets/sprites/dolphin.json');
		this.load.atlasJSONHash('shark', 'assets/sprites/shark.png', 'assets/sprites/shark.json');
		this.load.atlasJSONHash('orca', 'assets/sprites/tara.png', 'assets/sprites/tara.json');
		this.load.atlasJSONHash('turtle', 'assets/sprites/turtle.png', 'assets/sprites/turtle.json');


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