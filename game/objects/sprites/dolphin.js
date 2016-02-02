
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









