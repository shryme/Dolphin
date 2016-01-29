
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








