
var jsonAudio = {
	"water_splash": {
		"start": 0,
		"end": 4.7542857142857144,
		"loop": false
	},
	"dolphin_attack": {
		"start": 6,
		"end": 7.885260770975057,
		"loop": false
	},
	"shark_attack": {
		"start": 9,
		"end": 10,
		"loop": false
	},
	"waterfall": {
		"start": 15,
		"end": 23.7902947845805,
		"loop": false
	}
}

function Audio(game) {

	this.game = game;

	this.fx = this.game.add.audio('sfx');
	this.fx.allowMultiple = true;


	for(var key in jsonAudio){
		var s = jsonAudio[key];
		this.fx.addMarker(key, s.start, s.end - s.start);
	}

	this.game.customAudio = this;

}

Audio.prototype.play = function(name) {
	this.fx.play(name);
}

Audio.prototype.playSplash = function() {
	this.fx.play('water_splash');
}

Audio.prototype.playDolphinAttack = function() {
	this.fx.play('dolphin_attack');
}

Audio.prototype.playSharkAttack = function() {
	this.fx.play('shark_attack');
}

Audio.prototype.mute = function() {

	for(var key in this.fx.markers){
		var m = this.fx.markers[key];
		m.volume = 0;
	}

}

Audio.prototype.unmute = function() {

	for(var key in this.fx.markers){
		var m = this.fx.markers[key];
		m.volume = 1;
	}

}


module.exports = Audio;









