
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

		// this.sprite.body.data.updateAABB();

	}
}

module.exports = Dolphin;









