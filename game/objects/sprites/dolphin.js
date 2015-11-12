
function Dolphin(game, group, x, y) {
	this.game = game;

	// this.game.physics.startSystem(Phaser.Physics.ARCADE);


	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	if (group !== undefined) {
		this.sprite = group.create(x, y, 'dolphin', 'r1.png');
	} else {
		this.sprite = this.game.add.sprite(x, y, 'dolphin', 'r1.png');
	}


	this.game.physics.p2.enable(this.sprite);
	this.sprite.body.fixedRotation = true;
	this.sprite.body.collideWorldBounds = true;

	// this.sprite.body.setCircle(28);

	// this.game.physics.arcade.enable(this.sprite);

	// this.sprite.enableBody = true;
 //    this.sprite.physicsBodyType = Phaser.Physics.P2JS;

	// this.sprite.body.bounce.y = 0.8;
	// this.sprite.body.gravity.y = 0;
	// this.sprite.body.collideWorldBounds = true;

	// this.sprite.body.height = 54;
	// this.sprite.body.width = 224;

	// this.sprite.body.allowRotation = false;
	this.sprite.anchor.setTo(.5, .5);


	var list = new Array();
	var listXY = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 6; i++) {
		list.push('r' + i + '.png');
		listXY.push('xy' + i + '.png');
		listAttack.push('attack' + i + '.png');
	}


	listAttack.push('attack6.png');
	listAttack.push('attack6.png');
	listAttack.push('attack6.png');
	listAttack.push('attack6.png');
	listAttack.push('attack6.png');


	this.sprite.animations.add('moveX', list, 10, true, false);
	this.sprite.animations.add('moveXY', listXY, 10, true, false);
	this.sprite.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 10);
	this.sprite.animations.play('moveX');

	this.isAttacking = false;
	this.isDangerous = false;

	this.attackAnimation.enableUpdate = true;

	var fctMoveForAttack = this.moveForAttack.bind(this);
	this.attackAnimation.onUpdate .add(function(current) {
		// console.log('test', a.currentFrame.index);
		if (current.currentFrame.index === 5)
			fctMoveForAttack();

	});


	var fctStopAttacking = this.stopAttack.bind(this);
	this.attackAnimation.onComplete.add(fctStopAttacking);

}

Dolphin.prototype = {
	create: function() {

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

		this.isDangerous = true;


	},
	stopAttack: function() {
		this.isAttacking = false;
		this.isDangerous = false;
	},
	attack: function(x, y) {
		if (!this.isAttacking) {
			console.log('Attack');
			this.isAttacking = true;
			this.sprite.animations.play('attack');

			if (x === undefined && y === undefined) {
				// x = this.game.input.activePointer.clientX;
				// y = this.game.input.activePointer.clientY;

				x = this.game.input.worldX;
				y = this.game.input.worldY;
			}


			var dx = this.sprite.position.x - x;
			var dy = this.sprite.position.y - y;

			var factor = 450 / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

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

		//If attacking, we stop moving update
		if (this.isAttacking) {

			//This is the build up before the attack
			if (!this.isDangerous) {
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}

			return
		}

		if (speed === undefined)
			speed = 300;

		if (x === undefined && y === undefined) {
			// this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500);
			this.sprite.body.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500);
			this.sprite.rotation = this.sprite.body.rotation;
			// this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500) - Math.PI/2
		}
		else {
			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, x, y, speed);
			this.sprite.body.rotation = this.sprite.rotation;
		}



		this.sprite.animations.play('moveX');

		//Flip dolphin when moving to the left
		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
			this.sprite.scale.y = -1;
		else
			this.sprite.scale.y = 1;

		this.sprite.body.data.updateAABB();

	}
}

module.exports = Dolphin;





// <script type="text/javascript">

// MonsterBunny = function (game, rotateSpeed) {

//     //  We call the Phaser.Sprite passing in the game reference
//     //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
//     Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'bunny');

//     this.anchor.setTo(0.5, 0.5);

//     this.rotateSpeed = rotateSpeed;

//     var randomScale = 0.1 + Math.random();

//     this.scale.setTo(randomScale, randomScale)

//     game.add.existing(this);

// };

// MonsterBunny.prototype = Object.create(Phaser.Sprite.prototype);
// MonsterBunny.prototype.constructor = MonsterBunny;

// MonsterBunny.prototype.update = function() {

//     //  Automatically called by World.update
//     this.angle += this.rotateSpeed;

// };

// (function () {

//     var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

//     function preload() {

//         game.load.image('bunny', 'assets/sprites/bunny.png');

//     }

//     function create() {

//         for (var i = 0.1; i < 2; i += 0.1)
//         {
//             new MonsterBunny(game, i);
//         }

//     }

// })();
// </script>






















































































// function Dolphin(game, group, x, y) {
// 	this.game = game;

// 	// this.game.physics.startSystem(Phaser.Physics.ARCADE);


// 	if (x === undefined && y === undefined) {
// 		x = 0;
// 		y = 0;
// 	}

// 	if (group !== undefined) {
// 		this.sprite = group.create(x, y, 'dolphin', 'r1.png');
// 	} else {
// 		this.sprite = this.game.add.sprite(x, y, 'dolphin', 'r1.png');
// 	}
// 	// this.game.physics.arcade.enable(this.sprite);

// 	this.sprite.enableBody = true;
//     this.sprite.physicsBodyType = Phaser.Physics.P2JS;

// 	// this.sprite.body.bounce.y = 0.8;
// 	// this.sprite.body.gravity.y = 0;
// 	// this.sprite.body.collideWorldBounds = true;

// 	// this.sprite.body.height = 54;
// 	// this.sprite.body.width = 224;

// 	// this.sprite.body.allowRotation = false;
// 	this.sprite.anchor.setTo(.5, .5);


// 	var list = new Array();
// 	var listXY = new Array();
// 	var listAttack = new Array();

// 	for (var i = 1; i <= 6; i++) {
// 		list.push('r' + i + '.png');
// 		listXY.push('xy' + i + '.png');
// 		listAttack.push('attack' + i + '.png');
// 	}


// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');


// 	this.sprite.animations.add('moveX', list, 10, true, false);
// 	this.sprite.animations.add('moveXY', listXY, 10, true, false);
// 	this.sprite.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
// 	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 10);
// 	this.sprite.animations.play('moveX');

// 	this.isAttacking = false;
// 	this.isDangerous = false;

// 	this.attackAnimation.enableUpdate = true;

// 	var fctMoveForAttack = this.moveForAttack.bind(this);
// 	this.attackAnimation.onUpdate .add(function(current) {
// 		// console.log('test', a.currentFrame.index);
// 		if (current.currentFrame.index === 5)
// 			fctMoveForAttack();

// 	});


// 	var fctStopAttacking = this.stopAttack.bind(this);
// 	this.attackAnimation.onComplete.add(fctStopAttacking);

// }

// Dolphin.prototype = {
// 	create: function() {

// 	},
// 	idle: function() {
// 		if (this.isAttacking)
// 			return

// 		this.sprite.animations.play('idle');
// 		this.sprite.body.velocity.x = 0;
// 		this.sprite.body.velocity.y = 0;
// 	},
// 	moveForAttack: function() {
// 		this.sprite.body.velocity.x = this.vx * -1;
// 		this.sprite.body.velocity.y = this.vy * -1;

// 		this.isDangerous = true;


// 	},
// 	stopAttack: function() {
// 		this.isAttacking = false;
// 		this.isDangerous = false;
// 	},
// 	attack: function(x, y) {
// 		if (!this.isAttacking) {
// 			console.log('Attack');
// 			this.isAttacking = true;
// 			this.sprite.animations.play('attack');

// 			if (x === undefined && y === undefined) {
// 				// x = this.game.input.activePointer.clientX;
// 				// y = this.game.input.activePointer.clientY;

// 				x = this.game.input.worldX;
// 				y = this.game.input.worldY;
// 			}


// 			var dx = this.sprite.position.x - x;
// 			var dy = this.sprite.position.y - y;

// 			var factor = 450 / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

// 			this.vx = dx * factor;
// 			this.vy = dy * factor;

// 			this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, x, y);

// 			//Flip dolphin when moving to the left
// 			if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
// 				this.sprite.scale.y = -1;
// 			else
// 				this.sprite.scale.y = 1;


// 		}
// 	},
// 	move: function(x, y, speed) {

// 		//If attacking, we stop moving update
// 		if (this.isAttacking) {

// 			//This is the build up before the attack
// 			if (!this.isDangerous) {
// 				this.sprite.body.velocity.x = 0;
// 				this.sprite.body.velocity.y = 0;
// 			}

// 			return
// 		}

// 		if (speed === undefined)
// 			speed = 300;

// 		if (x === undefined && y === undefined) {
// 			this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500);
// 		}
// 		else
// 			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, x, y, speed);



// 		this.sprite.animations.play('moveX');

// 		//Flip dolphin when moving to the left
// 		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
// 			this.sprite.scale.y = -1;
// 		else
// 			this.sprite.scale.y = 1;

// 	}
// }

// module.exports = Dolphin;


























//arcade


// function Dolphin(game, group, x, y) {
// 	this.game = game;

// 	this.game.physics.startSystem(Phaser.Physics.ARCADE);


// 	if (x === undefined && y === undefined) {
// 		x = 0;
// 		y = 0;
// 	}

// 	if (group !== undefined) {
// 		this.sprite = group.create(x, y, 'dolphin', 'r1.png');
// 	} else {
// 		this.sprite = this.game.add.sprite(x, y, 'dolphin', 'r1.png');
// 	}
// 	this.game.physics.arcade.enable(this.sprite);

// 	this.sprite.body.bounce.y = 0.8;
// 	this.sprite.body.gravity.y = 0;
// 	this.sprite.body.collideWorldBounds = true;

// 	// this.sprite.body.height = 54;
// 	// this.sprite.body.width = 224;

// 	this.sprite.body.allowRotation = false;
// 	this.sprite.anchor.setTo(.5, .5);


// 	var list = new Array();
// 	var listXY = new Array();
// 	var listAttack = new Array();

// 	for (var i = 1; i <= 6; i++) {
// 		list.push('r' + i + '.png');
// 		listXY.push('xy' + i + '.png');
// 		listAttack.push('attack' + i + '.png');
// 	}


// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');
// 	listAttack.push('attack6.png');


// 	this.sprite.animations.add('moveX', list, 10, true, false);
// 	this.sprite.animations.add('moveXY', listXY, 10, true, false);
// 	this.sprite.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
// 	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 10);
// 	this.sprite.animations.play('moveX');

// 	this.isAttacking = false;
// 	this.isDangerous = false;

// 	this.attackAnimation.enableUpdate = true;

// 	var fctMoveForAttack = this.moveForAttack.bind(this);
// 	this.attackAnimation.onUpdate .add(function(current) {
// 		// console.log('test', a.currentFrame.index);
// 		if (current.currentFrame.index === 5)
// 			fctMoveForAttack();

// 	});


// 	var fctStopAttacking = this.stopAttack.bind(this);
// 	this.attackAnimation.onComplete.add(fctStopAttacking);

// }

// Dolphin.prototype = {
// 	create: function() {

// 	},
// 	idle: function() {
// 		if (this.isAttacking)
// 			return

// 		this.sprite.animations.play('idle');
// 		this.sprite.body.velocity.x = 0;
// 		this.sprite.body.velocity.y = 0;
// 	},
// 	moveForAttack: function() {
// 		this.sprite.body.velocity.x = this.vx * -1;
// 		this.sprite.body.velocity.y = this.vy * -1;

// 		this.isDangerous = true;


// 	},
// 	stopAttack: function() {
// 		this.isAttacking = false;
// 		this.isDangerous = false;
// 	},
// 	attack: function(x, y) {
// 		if (!this.isAttacking) {
// 			console.log('Attack');
// 			this.isAttacking = true;
// 			this.sprite.animations.play('attack');

// 			if (x === undefined && y === undefined) {
// 				// x = this.game.input.activePointer.clientX;
// 				// y = this.game.input.activePointer.clientY;

// 				x = this.game.input.worldX;
// 				y = this.game.input.worldY;
// 			}


// 			var dx = this.sprite.position.x - x;
// 			var dy = this.sprite.position.y - y;

// 			var factor = 450 / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

// 			this.vx = dx * factor;
// 			this.vy = dy * factor;

// 			this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, x, y);

// 			//Flip dolphin when moving to the left
// 			if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
// 				this.sprite.scale.y = -1;
// 			else
// 				this.sprite.scale.y = 1;


// 		}
// 	},
// 	move: function(x, y, speed) {

// 		//If attacking, we stop moving update
// 		if (this.isAttacking) {

// 			//This is the build up before the attack
// 			if (!this.isDangerous) {
// 				this.sprite.body.velocity.x = 0;
// 				this.sprite.body.velocity.y = 0;
// 			}

// 			return
// 		}

// 		if (speed === undefined)
// 			speed = 300;

// 		if (x === undefined && y === undefined) {
// 			this.sprite.rotation = this.game.physics.arcade.moveToPointer(this.sprite, speed, this.game.input.activePointer, 500);
// 		}
// 		else
// 			this.sprite.rotation = this.game.physics.arcade.moveToXY(this.sprite, x, y, speed);



// 		this.sprite.animations.play('moveX');

// 		//Flip dolphin when moving to the left
// 		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
// 			this.sprite.scale.y = -1;
// 		else
// 			this.sprite.scale.y = 1;

// 	}
// }

// module.exports = Dolphin;
