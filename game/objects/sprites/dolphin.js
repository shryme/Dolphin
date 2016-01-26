
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









