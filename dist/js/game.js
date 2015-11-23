(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(900, 600, Phaser.AUTO, 'netmag-phaser');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":8,"./states/gameover":9,"./states/menu":10,"./states/play":11,"./states/preload":12}],2:[function(require,module,exports){

var Shark = require('../sprites/shark');


function BasicEnemy(game, group, x, y) {
	this.game = game;

	this.entity = new Shark(game, group, x, y);
	this.entity.create();

}

BasicEnemy.prototype = {
	create: function() {

	},
	update: function(target) {

		if (!this.entity.update())
			return;


		if (this.game.physics.arcade.distanceBetween(this.entity.sprite, target.sprite) < 300)
			this.entity.move(target, 400);
		else
			this.entity.idle();

		if (this.game.physics.arcade.distanceBetween(this.entity.sprite, target.sprite) < 90)
			this.entity.attack(target);

	}
}

module.exports = BasicEnemy;

},{"../sprites/shark":6}],3:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Friend(game, group, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, group, x, y);
	this.entity.create();

}

Friend.prototype = {
	create: function() {

	},
	update: function() {

		if (!this.entity.update())
			return;

		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToXY(this.entity.sprite, 300, 300) > 100)
			this.entity.move(300, 300, 400);
		else
			this.entity.idle();

	}
}

module.exports = Friend;

},{"../sprites/dolphin":5}],4:[function(require,module,exports){

var Dolphin = require('../sprites/dolphin');


function Player(game, group, x, y) {
	this.game = game;

	this.entity = new Dolphin(game, group, x, y);
	this.entity.create();

}

Player.prototype = {
	create: function() {

	},
	update: function(cursors) {

		if (!this.entity.update())
			return;


		if (this.game.input.activePointer.isDown)
			this.entity.attack();
		else if (this.game.physics.arcade.distanceToPointer(this.entity.sprite, this.game.input.activePointer) > 20)
			this.entity.move();
		else
			this.entity.idle();


	}
}

module.exports = Player;

},{"../sprites/dolphin":5}],5:[function(require,module,exports){

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

	this.sprite.animations.add('moveX', list, 10, true, false);
	this.sprite.animations.add('moveXY', listXY, 10, true, false);
	this.sprite.animations.add('idle', ['r2.png', 'r3.png'], 2, true, false);
	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 10);
	this.sprite.animations.play('moveX');

	this.isAttacking = false;
	this.isDangerous = false;


	var fctStartAttacking = this.startAttack.bind(this);
	this.attackAnimation.onComplete.add(fctStartAttacking);



	this.attackDuration = 750;
	this.attackEnding;

	this.hp = 777;

}

Dolphin.prototype = {
	create: function() {

	},
	update: function() {

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
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}


			return false;

		}

		return true;

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



	},
	startAttack: function() {
		this.attackEnding = this.game.time.time + this.attackDuration;
		this.isDangerous = true;

	},
	stopAttack: function() {
		this.isAttacking = false;
		this.isDangerous = false;
	},
	attack: function(x, y) {
		if (!this.isAttacking) {

			this.isAttacking = true;
			this.sprite.animations.play('attack');



			if (x === undefined && y === undefined) {
				x = this.game.input.worldX;
				y = this.game.input.worldY;
			}


			var dx = this.sprite.position.x - x;
			var dy = this.sprite.position.y - y;

			var attackDistance = 700;
			var factor = attackDistance / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

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


	},
	hurt: function(dmg) {
		this.hp -= dmg;
	}
}

module.exports = Dolphin;










},{}],6:[function(require,module,exports){

function Shark(game, group, x, y) {
	this.game = game;


	if (x === undefined && y === undefined) {
		x = 0;
		y = 0;
	}

	if (group !== undefined) {
		this.sprite = group.create(x, y, 'shark', 'm1.png');
	} else {
		this.sprite = this.game.add.sprite(x, y, 'shark', 'm1.png');
	}

	this.game.physics.arcade.enableBody(this.sprite);
	this.sprite.body.gravity.y = 0;
	this.sprite.body.collideWorldBounds = true;

	this.sprite.body.allowRotation = false;
	this.sprite.anchor.setTo(.5, .5);

	this.sprite.body.setSize(75, 50, 0, 0);


	var listMove = new Array();
	var listAttack = new Array();

	for (var i = 1; i <= 5; i++) {
		listMove.push('m' + i + '.png');
	}

	listAttack.push('a1.png');
	listAttack.push('a2.png');

	this.sprite.animations.add('move', listMove, 10, true, false);
	this.sprite.animations.add('idle', ['m1.png', 'm2.png'], 2, true, false);
	this.attackAnimation = this.sprite.animations.add('attack', listAttack, 5);
	this.sprite.animations.play('move');


	var fctAttackComplete = this.attackComplete.bind(this);
	this.attackAnimation.onComplete.add(fctAttackComplete);

	this.currentTarget;
	this.isAttacking = false;

	this.dmg = 1;

}

Shark.prototype = {
	create: function() {

	},
	update: function() {

		return true;

	},
	idle: function() {

		this.sprite.animations.play('idle');
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
	},
	attackComplete: function() {
		this.isAttacking = false;
		this.currentTarget.hurt(this.dmg);
	},
	attack: function(target) {
		this.currentTarget = target;
		this.isAttacking = true;
		this.sprite.animations.play('attack');
	},
	move: function(target, speed) {

		this.sprite.rotation = this.game.physics.arcade.moveToObject(this.sprite, target.sprite, speed);

		if (!this.isAttacking)
			this.sprite.animations.play('move');

		//Flip dolphin when moving to the left
		if (this.sprite.rotation < -1.5 || this.sprite.rotation > 1.5)
			this.sprite.scale.y = -1;
		else
			this.sprite.scale.y = 1;

	}
}

module.exports = Shark;










},{}],7:[function(require,module,exports){
//For require.js
if (typeof define === "function" && define.amd) {
	define("easystar", [], function() {
		return EasyStar;
	});
}

//For browserify and node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = EasyStar;
}
//NameSpace
var EasyStar = EasyStar || {};

/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.costSoFar = costSoFar;
	this.simpleDistanceToTarget = simpleDistanceToTarget;

	/**
	* @return {Number} Best guess distance of a cost using this node.
	**/
	this.bestGuessDistance = function() {
		return this.costSoFar + this.simpleDistanceToTarget;
	}
};

//Constants
EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;
/**
* This is an improved Priority Queue data type implementation that can be used to sort any object type.
* It uses a technique called a binary heap.
*
* For more on binary heaps see: http://en.wikipedia.org/wiki/Binary_heap
*
* @param {String} criteria The criteria by which to sort the objects.
* This should be a property of the objects you're sorting.
*
* @param {Number} heapType either PriorityQueue.MAX_HEAP or PriorityQueue.MIN_HEAP.
**/
EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;

	//Constructor
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	/**
	* Inserts the value into the heap and sorts it.
	*
	* @param value The object to insert into the heap.
	**/
	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		bubbleUp(this.length-1);
	}

	/**
	* Peeks at the highest priority element.
	*
	* @return the highest priority element
	**/
	this.getHighestPriorityElement = function() {
		return queue[0];
	}

	/**
	* Removes and returns the highest priority element from the queue.
	*
	* @return the highest priority element
	**/
	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		swapUntilQueueIsCorrect(0);
		return oldRoot;
	}

	var bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = getParentOf(index);
		if (evaluate(index,parent)) {
			swap(index,parent);
			bubbleUp(parent);
		} else {
			return;
		}
	}

	var swapUntilQueueIsCorrect = function(value) {
		var left = getLeftOf(value);
		var right = getRightOf(value);
		if (evaluate(left,value)) {
			swap(value,left);
			swapUntilQueueIsCorrect(left);
		} else if (evaluate(right,value)) {
			swap(value,right);
			swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			swapUntilQueueIsCorrect(0);
		}
	}

	var swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	}

	var evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}

		var selfValue;
		var targetValue;

		//Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			selfValue = queue[self][criteria]();
			targetValue = queue[target][criteria]();
		} else {
			selfValue = queue[self][criteria];
			targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	}

	var getParentOf = function(index) {
		return Math.floor(index/2)-1;
	}

	var getLeftOf = function(index) {
		return index*2 + 1;
	}

	var getRightOf = function(index) {
		return index*2 + 2;
	}
};

//Constants
EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
};
/**
*	EasyStar.js
*	github.com/prettymuchbryce/EasyStarJS
*	Licensed under the MIT license.
*
*	Implementation By Bryce Neal (@prettymuchbryce)
**/
EasyStar.js = function() {
	var STRAIGHT_COST = 10;
	var DIAGONAL_COST = 14;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	/**
	* Sets the collision grid that EasyStar uses.
	*
	* @param {Array|Number} tiles An array of numbers that represent
	* which tiles in your grid should be considered
	* acceptable, or "walkable".
	**/
	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			//Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			//Number
			acceptableTiles = [tiles];
		}
	};

	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	}

	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	}

	/**
	* Sets the collision grid that EasyStar uses.
	*
	* @param {Array} grid The collision grid that this EasyStar instance will read from.
	* This should be a 2D Array of Numbers.
	**/
	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	/**
	* Sets the tile cost for a particular tile type.
	*
	* @param {Number} The tile type to set the cost for.
	* @param {Number} The multiplicative cost associated with the given tile.
	**/
	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	/**
	* Sets the number of search iterations per calculation.
	* A lower number provides a slower result, but more practical if you
	* have a large tile-map and don't want to block your thread while
	* finding a path.
	*
	* @param {Number} iterations The number of searches to prefrom per calculate() call.
	**/
	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};

	/**
	* Avoid a particular point on the grid,
	* regardless of whether or not it is an acceptable tile.
	*
	* @param {Number} x The x value of the point to avoid.
	* @param {Number} y The y value of the point to avoid.
	**/
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	/**
	* Stop avoiding a particular point on the grid.
	*
	* @param {Number} x The x value of the point to stop avoiding.
	* @param {Number} y The y value of the point to stop avoiding.
	**/
	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	/**
	* Stop avoiding all additional points on the grid.
	**/
	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	/**
	* Find a path.
	*
	* @param {Number} startX The X position of the starting point.
	* @param {Number} startY The Y position of the starting point.
	* @param {Number} endX The X position of the ending point.
	* @param {Number} endY The Y position of the ending point.
	* @param {Function} callback A function that is called when your path
	* is found, or no path is found.
	*
	**/
	this.findPath = function(startX, startY ,endX, endY, callback) {
		//No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw "You can't set a path without first calling setAcceptableTiles() on EasyStar.";
		}
		//No grid was set
		if (collisionGrid === undefined) {
			throw "You can't set a path without first calling setGrid() on EasyStar.";
		}

		//Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 ||
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 ||
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw "Your start or end point is outside the scope of your grid.";
		}

		//Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callback([]);
		}

		//End point is not an acceptable tile.
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callback(null);
			return;
		}

		//Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callback;

		instance.openList.insert(coordinateToNode(instance, instance.startX,
			instance.startY, null, STRAIGHT_COST));

		instances.push(instance);
	};

	/**
	* This method steps through the A* Algorithm in an attempt to
	* find your path(s). It will search 4 tiles for every calculation.
	* You can change the number of calculations done in a call by using
	* easystar.setIteratonsPerCalculation().
	**/
	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			//Couldn't find a path.
			if (instances[0].openList.length===0) {
				instances[0].callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.y < collisionGrid.length-1) {
				checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x > 0) {
				checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
			}
		}
	};

	//Private methods follow

	var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;

		if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
			instance.isDoneCalculating = true;
			var path = [];
			var pathLen = 0;
			path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
			pathLen++;
			path[pathLen] = {x: searchNode.x, y:searchNode.y};
			pathLen++;
			var parent = searchNode.parent;
			while (parent!=null) {
				path[pathLen] = {x: parent.x, y:parent.y};
				pathLen++;
				parent = parent.parent;
			}
			path.reverse();
			instance.callback(path);
		}

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {

					var node = coordinateToNode(instance, adjacentCoordinateX,
						adjacentCoordinateY, searchNode, cost);

					if (node.list === undefined) {
						node.list = EasyStar.Node.OPEN_LIST;
						instance.openList.insert(node);
					} else if (node.list === EasyStar.Node.OPEN_LIST) {
						if (searchNode.costSoFar + cost < node.costSoFar) {
							node.costSoFar = searchNode.costSoFar + cost;
							node.parent = searchNode;
						}
					}
					break;
				}
			}

		}
	};

	//Helpers

	var coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1)) * STRAIGHT_COST;
	};
}
/*
 * PathFinderPlugin License: MIT.
 * Copyright (c) 2013 appsbu-de
 * https://github.com/appsbu-de/phaser_plugin_pathfinding
 */

/**
 * Constructor.
 *
 * @param parent
 * @constructor
 */
Phaser.Plugin.PathFinderPlugin = function (parent) {

    if (typeof EasyStar !== 'object') {
        throw new Error("Easystar is not defined!");
    }

    this.parent = parent;
    this._easyStar = new EasyStar.js();
    this._grid = null;
    this._callback = null;
    this._prepared = false;
    this._walkables = [0];

};

Phaser.Plugin.PathFinderPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.PathFinderPlugin.prototype.constructor = Phaser.Plugin.PathFinderPlugin;

/**
 * Set Grid for Pathfinding.
 *
 * @param grid          Mapdata as a two dimensional array.
 * @param walkables     Tiles which are walkable. Every other tile is marked as blocked.
 * @param iterationsPerCount
 */
Phaser.Plugin.PathFinderPlugin.prototype.setGrid = function (grid, walkables, iterationsPerCount) {
    iterationsPerCount = iterationsPerCount || null;

    this._grid = [];
    for (var i = 0; i < grid.length; i++)
    {
        this._grid[i] = [];
        for (var j = 0; j < grid[i].length; j++)
        {
            if (grid[i][j])
                this._grid[i][j] = grid[i][j].index;
            else
                this._grid[i][j] = 0
        }
    }
    this._walkables = walkables;

    this._easyStar.setGrid(this._grid);
    this._easyStar.setAcceptableTiles(this._walkables);

    // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
    for (i = 0; i < walkables.length; i++)
    {
        this.setTileCost(walkables[i], 1);
    }

    if (iterationsPerCount !== null) {
        this._easyStar.setIterationsPerCalculation(iterationsPerCount);
    }
};

/**
 * Sets the tile cost for a particular tile type.
 *
 * @param tileType {Number} The tile type to set the cost for.
 * @param cost {Number} The multiplicative cost associated with the given tile.
 */
Phaser.Plugin.PathFinderPlugin.prototype.setTileCost = function (tileType, cost) {
    this._easyStar.setTileCost(tileType, cost);
};

/**
 * Set callback function (Uh, really?)
 * @param callback
 */
Phaser.Plugin.PathFinderPlugin.prototype.setCallbackFunction = function (callback) {
    this._callback = callback;
};

/**
 * Prepare pathcalculation for easystar.
 *
 * @param from  array 0: x-coords, 1: y-coords ([x,y])
 * @param to    array 0: x-coords, 1: y-coords ([x,y])
 */
Phaser.Plugin.PathFinderPlugin.prototype.preparePathCalculation = function (from, to) {
    if (this._callback === null || typeof this._callback !== "function") {
        throw new Error("No Callback set!");
    }

    var startX = from[0],
        startY = from[1],
        destinationX = to[0],
        destinationY = to[1];

    this._easyStar.findPath(startX, startY, destinationX, destinationY, this._callback);
    this._prepared = true;
};

/**
 * Start path calculation.
 */
Phaser.Plugin.PathFinderPlugin.prototype.calculatePath = function () {
    if (this._prepared === null) {
        throw new Error("no Calculation prepared!");
    }

    this._easyStar.calculate();
};

},{}],8:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],9:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.gameoverbg = this.game.add.sprite(0, 0, 'gameover');
    this.score_text = this.game.add.text(this.game.world.centerX, 325, this.game.score, { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.score_text.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],10:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.background = this.game.add.sprite(0, 0, 'menu');

		this.background.height = this.game.height;
		this.background.width = this.game.width;

		var button = this.game.add.button(this.game.world.centerX - 95, 200, 'dolphin', play, this, 2, 1, 0);
    function play() {
    	this.game.state.start('play');
    }

	},
	update: function() {

	}
};

module.exports = Menu;

},{}],11:[function(require,module,exports){

'use strict';

var Player = require('../objects/entity/player');
var Friend = require('../objects/entity/friend');
var Shark = require('../objects/entity/basicEnemy');

var Path = require('../plugins/phaser_pathfinding-0.2.0');

function Play() {}
Play.prototype = {
	create: function() {

		this.showDebug = true;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// background
		this.bg = this.game.add.sprite(0, 0, 'background');


		//Load tiles
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('basic', 'tileset');

		//Create block layer, and add collision
		this.blockLayer = this.map.createLayer('block');
		this.blockLayer.resizeWorld();
		this.map.setCollisionBetween(0, 5);


		//Set background size with the size if the tileset
		this.bg.height = this.map.widthInPixels;
		this.bg.width = this.map.heightInPixels;
		this.game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);



		this.list = new Array();
		this.listEnemy = new Array();

		//Group of dolphins
		this.groupDolphins = this.game.add.group();

		//Group of dolphins
		this.groupSharks = this.game.add.group();


		//Us
		var spawn = this.map.objects.spawn[0];
		this.player = new Player(this.game, this.groupDolphins, spawn.x, spawn.y);

		var listObjectsDolphins = this.map.objects.dolphins;

		for (var i = 0; i < listObjectsDolphins.length;  i++) {
			var cur = listObjectsDolphins[i];
			var dolphin = new Friend(this.game, this.groupDolphins, cur.x, cur.y);

			this.list.push(dolphin);
		}

		var listObjectsSharks = this.map.objects.sharks;

		for (var i = 0; i < listObjectsSharks.length;  i++) {
			var cur = listObjectsSharks[i];
			var shark = new Shark(this.game, this.groupDolphins, cur.x, cur.y);

			this.listEnemy.push(shark);
		}


		//Add camera to follow our player
		this.game.camera.follow(this.player.entity.sprite);

		this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.debugKey.onDown.add(this.toggleDebug, this);



		this.txtHp = this.game.add.text(10, 10, "Hp: 100", { font: "65px Arial", fill: "#bb00ff", align: "center"});
		this.txtHp.fixedToCamera = true;
		this.txtHp.cameraOffset.setTo(10, 10);



		this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
		this.pathfinder.setGrid(this.blockLayer.layer.data, [-1]);


		this.graphics = this.game.add.graphics(0, 0);
		var graph = this.graphics;

		this.pathfinder.setCallbackFunction(function(path) {
			graph.lineStyle(2, 0x0000FF, 1);
			path = path || [];
			// console.log(path);
			// for (var i = 0; i < path.length; i++) {
			// 	graph.drawRect(path[i].x * 32, path[i].y * 32, 32, 32);
			// }
		});











	},

	update: function() {

		// var x = Math.floor(this.player.entity.sprite.x / 32);
		// var y = Math.floor(this.player.entity.sprite.y / 32);
		// this.pathfinder.preparePathCalculation([0,0], [x, y]);
		// this.pathfinder.calculatePath();

		//Get cursor
		var cursors = this.game.input.keyboard.createCursorKeys();

		//Update our player
		this.player.update(cursors);

		//Update all friends
		var game = this.game;
		var blocks = this.blockLayer;
		this.list.forEach(function(f) {
			f.update();
			game.physics.arcade.collide(f.entity.sprite, blocks);
		});

		var player = this.player.entity;
		this.listEnemy.forEach(function(f) {
			f.update(player);
			game.physics.arcade.collide(f.entity.sprite, blocks);
		});

		//Collide with friends
		this.game.physics.arcade.collide(this.groupDolphins);

		//Colision of sharks
		this.game.physics.arcade.collide(this.groupSharks);

		//Collision between sharks and dolphins
		this.game.physics.arcade.collide(this.groupDolphins, this.groupSharks);

		//Collide with blocks
		this.game.physics.arcade.collide(this.player.entity.sprite, this.blockLayer);


		this.txtHp.text = "Hp: " + this.player.entity.hp;

	},

	render: function() {

		if (this.showDebug) {

			this.game.debug.bodyInfo(this.player.entity.sprite, 32, 32);
			this.game.debug.body(this.player.entity.sprite);


			var game = this.game;
			this.list.forEach(function(f) {
				game.debug.body(f.entity.sprite);
			});
			this.listEnemy.forEach(function(f) {
				game.debug.body(f.entity.sprite);
			});

		}

	},



	toggleDebug: function() {
		this.showDebug = !this.showDebug;

		if (!this.showDebug)
		{
			this.game.debug.reset();
		}

		this.graphics.clear();
	}

};

module.exports = Play;








},{"../objects/entity/basicEnemy":2,"../objects/entity/friend":3,"../objects/entity/player":4,"../plugins/phaser_pathfinding-0.2.0":7}],12:[function(require,module,exports){

'use strict';
function Preload() {
	this.asset = null;
	this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('yeoman', 'assets/player.png');

		this.load.image('menu', 'assets/background.png');
		this.load.image('background', 'assets/background.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('creature_1', 'assets/creature_1.png');
		this.load.image('creature_2', 'assets/creature_2.png');
		this.load.image('creature_3', 'assets/creature_3.png');
		this.load.image('gameover', 'assets/background.png');

		this.load.tilemap('tilemap', 'assets/tilemaps/level0.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tileset', "assets/tilemaps/tileset.png");

		//this.load.spritesheet('dolphin', 'assets/sprites.png', 164, 72);

		this.load.atlasJSONHash('dolphin', 'assets/sprites/dolphin.png', 'assets/sprites/dolphin.json');
		this.load.atlasJSONHash('shark', 'assets/sprites/shark.png', 'assets/sprites/shark.json');


	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if(!!this.ready) {
			this.game.state.start('menu');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;

},{}]},{},[1])