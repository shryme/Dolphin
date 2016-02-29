
var Splash = require('./splash');
var Sparkle = require('./sparkle');


function Particles(game) {

	this.splashParticle = new Splash(game);
	this.sparkleParticle = new Sparkle(game);

}

Particles.prototype.splash = function(sprite) {
	this.splashParticle.start(sprite);
}

Particles.prototype.sparkle = function(sprite) {
	this.sparkleParticle.start(sprite);
}

Particles.prototype.update = function() {
	this.splashParticle.update();
	this.sparkleParticle.update();
}


module.exports = Particles;








