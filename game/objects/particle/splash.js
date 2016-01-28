
function Splash(game, sprite) {
	this.emitter = game.add.emitter(0, 0, 1000);
	this.emitter.makeParticles('waterdrops', ['1.png','2.png', '3.png', '4.png']);
	this.emitter.minParticleSpeed.setTo(-200, -300);
	this.emitter.maxParticleSpeed.setTo(200, -100);
	this.emitter.gravity = 500;
}

Splash.prototype.start = function(sprite) {
	this.emitter.x = sprite.x;
	this.emitter.y = sprite.y;

	this.emitter.start(true, 10000, null, 2);
}


module.exports = Splash;









