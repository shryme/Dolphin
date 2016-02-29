
function Sparkle(game) {
	this.emitter = game.add.emitter(0, 0, 1000);
	this.emitter.makeParticles('sparkle', ['sparkle1.png','sparkle2.png', 'sparkle3.png', 'sparkle4.png', 'sparkle5.png']);
	this.emitter.minParticleSpeed.setTo(-200, -300);
	this.emitter.maxParticleSpeed.setTo(200, -100);
	this.emitter.gravity = 500;
	this.emitter.alpha = 1;
}

Sparkle.prototype.start = function(sprite) {
	this.emitter.x = sprite.x;
	this.emitter.y = sprite.y;
	this.emitter.start(true, 5000, null, 100);
}

Sparkle.prototype.update = function() {
	var emitter = this.emitter;
	this.emitter.forEachAlive( function(p) {
		p.alpha = p.lifespan / emitter.lifespan;
	});
}


module.exports = Sparkle;









