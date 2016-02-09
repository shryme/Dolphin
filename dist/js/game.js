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
},{"./states/boot":14,"./states/gameover":15,"./states/menu":16,"./states/play":17,"./states/preload":18}],2:[function(require,module,exports){

var Shark = require('../sprites/shark');


function BasicEnemy(game, x, y, wp) {
	this.game = game;

	this.sprite = new Shark(game, x, y, this);
	this.sprite.create();

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

		if (!this.sprite.update())
			return;

		var dist = this.game.physics.arcade.distanceBetween(this.sprite, target);



		if (dist < 300) {
			//If close enough, chase the target
			this.sprite.move(target, 500);

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

			this.sprite.move(this.listTargetPos[0], 400);

			//If the enemy is close enough to the history position of the target,
			//remove it from the list so the enemy chase the next point
			if (this.game.physics.arcade.distanceBetween(this.sprite, this.listTargetPos[0]) < 100)
				this.listTargetPos.shift();


		}
		else {
			if (this.waypoints !== undefined) {

				if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100) {
					this.sprite.move(this.target, 300);
				}
				else {
					this.currentWp++;
					if (this.currentWp === this.waypoints.length)
						this.currentWp = 0;
					this.target = this.waypoints[this.currentWp];
				}

			}
			else
				this.sprite.idle();

			//Reset the list
			this.listTargetPos = new Array();
		}


		if (dist < 90)
			this.sprite.attack(target);

	}
}

module.exports = BasicEnemy;

},{"../sprites/shark":12}],3:[function(require,module,exports){

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

},{"../sprites/dolphin":9}],4:[function(require,module,exports){

var Orca = require('../sprites/orca');


function FriendOrca(game, x, y, wp) {

	this.game = game;

	this.sprite = new Orca(game, x, y, this);
	// this.sprite = new Orca(game, group, x, y);
	this.sprite.create();

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

		if (!this.sprite.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100) {
			this.sprite.move(this.target, 400);
		}
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

module.exports = FriendOrca;

},{"../sprites/orca":10}],5:[function(require,module,exports){

var Turtle = require('../sprites/turtle');


function FriendTurtle(game, x, y, wp) {

	this.game = game;

	this.sprite = new Turtle(game, x, y, this);

	this.sprite.create();

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

		if (!this.sprite.update())
			return;

		if (this.game.physics.arcade.distanceBetween(this.sprite, this.target) > 100) {
			this.sprite.move(this.target, 400);
		}
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

module.exports = FriendTurtle;

},{"../sprites/turtle":13}],6:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Player(game, x, y) {
	this.game = game;

	this.sprite = new Dolphin(game, x, y, this);
	this.sprite.create();

}

Player.prototype = {
	create: function() {

	},
	update: function(cursors) {

		if (!this.sprite.update())
			return;

		var attacked;

		if (this.game.input.activePointer.isDown)
			attacked = this.sprite.attack();

		if (!attacked) {
			if (this.game.physics.arcade.distanceToPointer(this.sprite, this.game.input.activePointer) > 20)
				this.sprite.move();
			else
				this.sprite.idle();
		}


	}
}

module.exports = Player;

},{"../sprites/dolphin":9}],7:[function(require,module,exports){

var Splash = require('./splash');


function Particles(game) {

	this.splashParticle = new Splash(game);

}

Particles.prototype.splash = function(sprite) {
	this.splashParticle.start(sprite);
}

Particles.prototype.update = function() {
	this.splashParticle.update();
}


module.exports = Particles;









},{"./splash":8}],8:[function(require,module,exports){

function Splash(game) {
	this.emitter = game.add.emitter(0, 0, 1000);
	this.emitter.makeParticles('waterdrops', ['1.png','2.png', '3.png', '4.png']);
	this.emitter.minParticleSpeed.setTo(-200, -300);
	this.emitter.maxParticleSpeed.setTo(200, -100);
	this.emitter.gravity = 500;
	this.emitter.alpha = 1;
}

Splash.prototype.start = function(sprite) {
	this.emitter.x = sprite.x;
	this.emitter.y = sprite.y;

	this.emitter.start(true, 500, null, 2);
}

Splash.prototype.update = function() {
	var emitter = this.emitter;
	this.emitter.forEachAlive( function(p) {
		p.alpha = p.lifespan / emitter.lifespan;
	});
}


module.exports = Splash;










},{}],9:[function(require,module,exports){

function Dolphin(game, x, y, entity) {

	this.entity = entity;

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

	this.isInGravity = false;
	this.listGravityPos = new Array();

	this.items = {
		attack: false,
		jump: false,
	}

	game.add.existing(this);


}

Dolphin.prototype = Object.create(Phaser.Sprite.prototype);
Dolphin.prototype.constructor = Dolphin;


Dolphin.prototype.create = function() {

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

	if (!this.items.attack)
		return false;

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

		this.flipSprite();


	}

	return true;
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












Dolphin.prototype.resetGravity = function() {
	this.listGravityPos = new Array();
	this.isInGravity = false;
}

Dolphin.prototype.reverseGravity = function() {
	if (this.listGravityPos.length !== 0)
		this.listGravityPos.pop();
	if (this.listGravityPos.length !== 0)
		this.listGravityPos.pop();
	var toInvert = this.listGravityPos.slice(0);
	toInvert.reverse();
	this.listGravityPos = this.listGravityPos.concat(toInvert);
}


Dolphin.prototype.updateGravity = function() {

	if (this.isInGravity) {

		this.stopAttack();
		//Fallback if he gets stuck
		if (this.game.time.time > this.jumpEnding || this.listGravityPos.length === 0 || this.body.gravity.x !== 0 || this.body.gravity.y !== 0) {
			this.resetGravity();
			return true;
		}

		//If he gets stuck on a block
		if (this.body.blocked.up || this.body.blocked.down || this.body.blocked.left || this.body.blocked.right ||
			this.body.touching.up || this.body.touching.down || this.body.touching.left || this.body.touching.right) {
			this.resetGravity();
			return true;
		}

		this.targetJump = this.listGravityPos[this.currentWpJump];

		if (this.game.physics.arcade.distanceBetween(this, this.targetJump) > 10) {
			this.move(this.targetJump, 600, 50);
		}
		else {
			this.currentWpJump++;

			if (this.currentWpJump >= this.listGravityPos.length) {

				this.resetGravity();
				return true;
			}
			this.targetJump = this.listGravityPos[this.currentWpJump];
		}

		return false;
	}
	return true;
}

Dolphin.prototype.addGravity = function(blockLayer, overlapLayer, listWater) {

	if (!this.items.jump) {
		this.body.gravity.y = 50000;
		return
	}

	if (!this.isInGravity && this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {

		//Need to set it because the forces were making it fly
		this.body.gravity.y = 0;


		this.game.customParticles.splash(this);
		this.game.customSounds.play('Water-splash');

		this.isInGravity = true;
		this.currentWpJump = 0;


		function toRadians (angle) {
			return angle * (Math.PI / 180);
		}

		var vo = Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
		vo = vo / 6;

		var theta = this.angle * -1;
		var g = 9.8;

		var vox = vo * Math.cos(toRadians(theta));
		var voy = vo * Math.sin(toRadians(theta));

		//Calculate time to go to the highest point * 2 to the ending + 1 to splash
		var totalTime = ((voy) / g) * 2 + 100;

		this.jumpEnding = this.game.time.time + totalTime * 200;

		var isRightToLeft = false;

		if (totalTime < 0) {
			isRightToLeft = true;
			totalTime = totalTime * -1;
		}

		this.listGravityPos = new Array();

		var pos = {x: 0, y: 0};

		for (var i = 0.0; i < totalTime; i = i + 0.5) {
			var x = vox * i;
			var y = voy * i + 0.5 * -9.8 * Math.pow(i, 2);

			if (isRightToLeft)
				x = this.x - x;
			else
				x = this.x + x;

			y = this.y - y;


			blockLayer.getTileXY(x, y, pos);

			//Sometime he was out of bound
			pos.y = pos.y < 0 ? 0 : pos.y;
			pos.y = pos.y >= blockLayer.layer.data.length ? blockLayer.layer.data.length - 1 : pos.y;

			pos.x = pos.x < 0 ? 0 : pos.x;
			pos.x = pos.x >= blockLayer.layer.data[pos.y].length ? blockLayer.layer.data[pos.y].length - 1 : pos.x;


			//Detect if it will be a block
			if (listWater.indexOf(blockLayer.layer.data[pos.y][pos.x].index) === -1) {
				this.reverseGravity();
				break;
			}

			this.listGravityPos.push({x: x, y: y});

			//Look if he will be out of the game
			if (x < 0 || x > overlapLayer.layer.widthInPixels || y < 0 || y > overlapLayer.layer.heightInPixels) {
				this.reverseGravity();
				break;
			}

			//Stop if he hits water again
			if (listWater.indexOf(overlapLayer.layer.data[pos.y][pos.x].index) !== -1)
				break


		}

	}
}

Dolphin.prototype.removeGravity = function() {
	this.body.gravity.y = 0;
}


module.exports = Dolphin;










},{}],10:[function(require,module,exports){

function Orca(game, x, y, entity) {

	this.entity = entity;

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










},{}],11:[function(require,module,exports){

function Powerup(game, x, y, useless, prop) {

	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	Phaser.Sprite.call(this, game, x, y, 'powerup', 'p1.png');

	this.initialize();

	this.powerupType = prop.type;

	this.game.physics.arcade.enableBody(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;

	this.body.allowRotation = false;
	this.anchor.setTo(.5, .5);

	this.body.setSize(75, 50, 0, 0);


	var listImages = new Array();

	for (var i = 1; i <= 8; i++) {
		listImages.push('p' + i + '.png');
	}

	this.animations.add('idle', listImages, 10, true, false);
	this.animations.play('idle');

	if (this.powerupType === 'jump') {
		this.tint = 0x00ff00
		this.animations.next(4);
	}
	else
		this.tint = 0xffff00

	game.add.existing(this);



}

Powerup.prototype = Object.create(Phaser.Sprite.prototype);
Powerup.prototype.constructor = Powerup;

Powerup.prototype.create = function() {

}


module.exports = Powerup;










},{}],12:[function(require,module,exports){

function Shark(game, x, y, entity) {

	this.entity = entity;

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


Shark.prototype.addGravity = function() {
	this.body.gravity.y = 50000;
}

Shark.prototype.removeGravity = function() {
	this.body.gravity.y = 0;
}


module.exports = Shark;


},{}],13:[function(require,module,exports){

function Turtle(game, x, y, entity) {

	this.entity = entity;

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










},{}],14:[function(require,module,exports){

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

},{}],15:[function(require,module,exports){

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

},{}],16:[function(require,module,exports){

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

	},
	update: function() {

	}
};

module.exports = Menu;

},{}],17:[function(require,module,exports){
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
	waterwave: 871,
	waterfall_top: 845,
	waterfall: 875,
	waterCurrentUpLow: 885,
	waterCurrentUpMedium: 886,
	waterCurrentUpHigh: 887,
	waterCurrentDownLow: 888,
	waterCurrentDownMedium: 889,
	waterCurrentDownHigh: 890,
	waterCurrentLeftLow: 891,
	waterCurrentLeftMedium: 892,
	waterCurrentLeftHigh: 893,
	waterCurrentRightLow: 894,
	waterCurrentRightMedium: 895,
	waterCurrentRightHigh: 896,
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

	createAnimation: function(tile, animation, listAnim, speed, next) {
		var group = this.game.add.group();
		this.map.createFromTiles(tile, tileIndex.empty, animation, "background", group);

		group.forEach(
			function(tile){
				tile.animations.add('idle', listAnim, speed, true, false);
				tile.animations.play('idle');

				if (next !== undefined) {
					if (next.plan !== undefined && next.interval !== undefined) {
						var toTest;
						if (next.plan === 'x')
							toTest = this.blockLayer.getTileX(tile.x);
						else
							toTest = this.blockLayer.getTileY(tile.y);

						tile.animations.next(toTest % next.interval);
					}
				}

			}, this
		);
	},

	createObject: function(layer, constructor, group, list) {
		var listObjects = layer;

		for (var i = 0; i < listObjects.length;  i++) {
			var cur = listObjects[i];
			var obj = new constructor(this.game, cur.x, cur.y, this.listWaypoints[cur.properties.wp], cur.properties);
			if (obj.sprite !== undefined)
				group.add(obj.sprite);
			else
				group.add(obj);

			if (list !== undefined)
				list.push(obj);
		}

	},

	initializeAudio: function() {

		this.music = this.game.add.audio('greenHills');
		this.music.play();



		this.fx = this.game.add.audio('sfx');
		this.fx.allowMultiple = true;


		this.fx.addMarker('Water-splash', 0, 4.7542857142857144);


		this.game.customSounds = this.fx;

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


		this.map.setCollisionBetween(0, 1000, true, this.blockLayer);
		this.map.setCollisionBetween(0, 1000, true, this.overlapLayer);


		var waterAnimation = ['water1.png', 'water2.png', 'water2.png'];
		this.createAnimation(tileIndex.waterwave, 'waterwave', waterAnimation, 5, {plan: 'x', interval: 3});

		var waterfallTopAnimation = ['waterfall_top1.png', 'waterfall_top2.png'];
		this.createAnimation(tileIndex.waterfall_top, 'waterfall', waterfallTopAnimation, 2);

		var waterfallAnimation = ['waterfall1.png', 'waterfall2.png', 'waterfall3.png', 'waterfall4.png'];
		this.createAnimation(tileIndex.waterfall, 'waterfall', waterfallAnimation, 10, {plan: 'x', interval: 3});


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

		this.initializeAudio();

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

		this.createObject(this.map.objects.dolphins, Friend, this.groupDolphins, this.list);
		this.createObject(this.map.objects.sharks, Shark, this.groupSharks, this.listEnemy);
		this.createObject(this.map.objects.orcas, Orca, this.groupOrcas, this.list);
		this.createObject(this.map.objects.turtles, Turtle, this.groupTurtles, this.list);
		this.createObject(this.map.objects.powerups, Powerup, this.groupPowerups);


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

		//Mute
		this.muteMusicKey = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
		this.muteMusicKey.onDown.add(this.muteMusic, this);

		//Unmute
		this.unmuteMusicKey = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
		this.unmuteMusicKey.onDown.add(this.unmuteMusic, this);





		this.txtHp = this.game.add.text(10, 10, "Hp: 100", { font: "65px Arial", fill: "#bb00ff", align: "center"});
		this.txtHp.fixedToCamera = true;
		this.txtHp.cameraOffset.setTo(10, 10);

		for (var i = 0; i < this.overlapLayer.layer.data.length; i++)
			for (var j = 0; j < this.overlapLayer.layer.data[i].length; j++)
				if (this.overlapLayer.layer.data[i][j].index === tileIndex.invisibleGravity ||
					(this.overlapLayer.layer.data[i][j].index >= tileIndex.waterCurrentUpLow &&
					this.overlapLayer.layer.data[i][j].index <= tileIndex.waterCurrentRightHigh))
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

		this.checkCollision();

		this.txtHp.text = "Hp: " + this.player.sprite.hp;

	},

	checkCollision: function() {


		//Collision between sharks and dolphins
		this.game.physics.arcade.collide(this.groupDolphins, this.groupSharks, undefined, this.dolphinProcessCallback, this);

		this.game.physics.arcade.collide(this.groupDolphins, this.groupOrcas);
		this.game.physics.arcade.collide(this.groupSharks, this.groupOrcas);
		this.game.physics.arcade.collide(this.groupTurtles, this.groupOrcas);

		this.game.physics.arcade.collide(this.groupDolphins, this.groupTurtles);
		this.game.physics.arcade.collide(this.groupSharks, this.groupTurtles);


		this.collisionGlobal(this.groupDolphins);
		this.collisionGlobal(this.groupSharks);
		this.collisionGlobal(this.groupOrcas);
		this.collisionGlobal(this.groupTurtles);


		//Detect powerup collision
		this.game.physics.arcade.overlap(this.groupPowerups, this.player.sprite, undefined, this.powerupCollision, this);




	},

	collisionGlobal: function(group) {

		//Collide with blocks
		this.game.physics.arcade.collide(group, this.blockLayer);

		//Collide with themself
		this.game.physics.arcade.collide(group);

		//Overlap for gravity
		this.game.physics.arcade.overlap(group, this.overlapLayer, undefined, this.addGravity, this);

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
		this.music.stop();
		this.game.state.start('play', true, false, this.currentLevel);
	},

	goToLevelZero: function() {
		this.music.stop();
		this.game.state.start('play', true, false, 'level0');
	},

	goToLevelOne: function() {
		this.music.stop();
		this.game.state.start('play', true, false, 'level1');
	},

	muteMusic: function() {
		this.music.volume = 0;
	},

	unmuteMusic: function() {
		this.music.volume = 1;
	},

	addGravity: function(sprite, tile) {

		if (tile.index === tileIndex.invisibleGravity || tile.index === tileIndex.visibleGravity) {
			if(sprite.addGravity !== undefined)
				sprite.addGravity(this.blockLayer, this.overlapLayer, [tileIndex.empty,
					tileIndex.waterCurrentUpLow,
					tileIndex.waterCurrentUpMedium,
					tileIndex.waterCurrentUpHigh,
					tileIndex.waterCurrentDownLow,
					tileIndex.waterCurrentDownMedium,
					tileIndex.waterCurrentDownHigh,
					tileIndex.waterCurrentLeftLow,
					tileIndex.waterCurrentLeftMedium,
					tileIndex.waterCurrentLeftHigh,
					tileIndex.waterCurrentRightLow,
					tileIndex.waterCurrentRightMedium,
					tileIndex.waterCurrentRightHigh]);
		}
		else if (tile.index === tileIndex.waterCurrentUpLow) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = -5000;
		}
		else if (tile.index === tileIndex.waterCurrentUpMedium) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = -10000;
		}
		else if (tile.index === tileIndex.waterCurrentUpHigh) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = -18000;
		}
		else if (tile.index === tileIndex.waterCurrentDownLow) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = 5000;
		}
		else if (tile.index === tileIndex.waterCurrentDownMedium) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = 10000;
		}
		else if (tile.index === tileIndex.waterCurrentDownHigh) {
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = 18000;
		}
		else if (tile.index === tileIndex.waterCurrentLeftLow) {
			sprite.body.gravity.x = -15000;
			sprite.body.gravity.y = 0;
		}
		else if (tile.index === tileIndex.waterCurrentLeftMedium) {
			sprite.body.gravity.x = -25000;
			sprite.body.gravity.y = 0;
		}
		else if (tile.index === tileIndex.waterCurrentLeftHigh) {
			sprite.body.gravity.x = -35000;
			sprite.body.gravity.y = 0;
		}
		else if (tile.index === tileIndex.waterCurrentRightLow) {
			sprite.body.gravity.x = 15000;
			sprite.body.gravity.y = 0;
		}
		else if (tile.index === tileIndex.waterCurrentRightMedium) {
			sprite.body.gravity.x = 25000;
			sprite.body.gravity.y = 0;
		}
		else if (tile.index === tileIndex.waterCurrentRightHigh) {
			sprite.body.gravity.x = 35000;
			sprite.body.gravity.y = 0;
		}
		else {
			if(sprite.removeGravity !== undefined)
				sprite.removeGravity();
			sprite.body.gravity.x = 0;
			sprite.body.gravity.y = 0;
		}


		return false;
	},

	powerupCollision: function(dolphin, powerup) {
		dolphin.items[powerup.powerupType] = true;
		powerup.destroy();
	}


};

module.exports = Play;





},{"../objects/entity/basicEnemy":2,"../objects/entity/friend":3,"../objects/entity/friendOrca":4,"../objects/entity/friendTurtle":5,"../objects/entity/player":6,"../objects/particle/particles":7,"../objects/sprites/powerup":11}],18:[function(require,module,exports){

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

		for (var i = 0; i <= 1; i++) {
			this.load.tilemap('level' + i, 'assets/tilemaps/level' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
		}

		this.load.image('tileset', "assets/tilemaps/tileset.png");

		this.load.atlasJSONHash('dolphin', 'assets/sprites/dolphin.png', 'assets/sprites/dolphin.json');
		this.load.atlasJSONHash('shark', 'assets/sprites/shark.png', 'assets/sprites/shark.json');
		this.load.atlasJSONHash('orca', 'assets/sprites/tara.png', 'assets/sprites/tara.json');
		this.load.atlasJSONHash('turtle', 'assets/sprites/turtle.png', 'assets/sprites/turtle.json');
		this.load.atlasJSONHash('powerup', 'assets/sprites/powerup.png', 'assets/sprites/powerup.json');

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

},{}]},{},[1])