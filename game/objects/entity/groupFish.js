
var Fish = require('../sprites/fish');


function GroupFish(game, pos, prop) {
	this.game = game;


	this.isNervous = prop.nervous;



	this.create(pos, prop);

}

GroupFish.prototype = {
	create: function(pos, prop) {

		var groupHeight = pos.height;
		var groupWidth = pos.width;
		var groupCount = Number(prop.count);

		var numberWidth;
		var numberHeight;

		if (prop.sprite.indexOf('.') === -1)
			prop.sprite += ".png";

		var frame = this.game.cache.getFrameData("fish").getFrameByName("fish1_1.png");

		var fishWidth = frame.width;
		var fishHeight = frame.height;

		numberWidth = Math.floor(groupWidth / fishWidth);
		numberHeight = Math.floor(groupHeight / fishHeight);

		var listPos = new Array();

		for (var i = 0; i < numberHeight; i++) {
			for (var j = 0; j < numberWidth; j++) {

				listPos.push({x: j * fishWidth + pos.x, y: i * fishHeight + pos.y});

			}
		}


		var listTaken = new Array();

		this.listSprite = new Array();

		for (var i = 0; i < groupCount; i++) {

			if (listPos.length === 0)
				break;

			var rnd = Math.floor((Math.random() * listPos.length));

			if (listTaken.indexOf(rnd) === -1) {
				listTaken.push(rnd);
				var curPos = listPos[rnd];
				var sprite = new Fish(this.game, curPos.x, curPos.y, this, prop.sprite);
				sprite.create();
				this.listSprite.push(sprite);
			}
			else
				i--;

		}

	},
	update: function() {


	}
}

module.exports = GroupFish;
