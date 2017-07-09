/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shapes = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function () {
	var canvas = document.getElementById('canvas-main');
	var ctx = canvas.getContext("2d");
	var score = document.getElementById('score');
	var clear = '#818c90';
	var numberOfRows = 12;
	var numberOfColumns = 20;
	var sizeOfTile = 24;

	canvas.width = numberOfRows * sizeOfTile;
	canvas.height = numberOfColumns * sizeOfTile;

	var canvasNext = document.getElementById('canvas-next');
	var ctxNext = canvasNext.getContext("2d");
	var nOfRowsNext = 6;
	var nOfColNext = 6;

	canvasNext.width = nOfRowsNext * sizeOfTile;
	canvasNext.height = nOfColNext * sizeOfTile;

	var $playBtn = $('.play-btn');
	var $playerName = $('#player-name span');
	var $gameTime = $('#game-time span');

	var hitWall = 1;
	var hitBlock = 2;
	var singleRow = 0;
	var done = false;

	var shapes = [[_shapes.I, "#ff9800"], [_shapes.J, "#9c27b0"], [_shapes.L, "#3f51b5"], [_shapes.O, "#f9e333"], [_shapes.S, "#4caf50"], [_shapes.T, "#00bcd4"], [_shapes.Z, "#f44336"]];

	var arrOfShapes = ['', ''];
	var currentShape = null;
	var nextShape = null;
	var setStart = Date.now();

	var board = []; // Create game-board
	for (var i = 0; i < numberOfColumns; i++) {
		board[i] = [];
		for (var j = 0; j < numberOfRows; j++) {
			board[i][j] = false;
		}
	}

	var boardNext = []; // Create board for next canvas
	for (var _i = 0; _i < nOfColNext; _i++) {
		boardNext[_i] = [];
		for (var _j = 0; _j < nOfRowsNext; _j++) {
			boardNext[_i][_j] = false;
		}
	}

	var countTime = function countTime() {
		// Start counting game time
		var $min = $('#minutes');
		var $sec = $('#seconds');
		var minutes = 0;
		var seconds = 0;

		var timer = setInterval(function () {
			seconds++;
			if (seconds < 10) {
				$sec.text('0' + seconds);
			} else if (seconds > 59) {
				seconds = 0;
				$sec.text('0' + seconds);
				minutes++;
				if (minutes < 10) {
					$min.text('0' + minutes);
				} else if (minutes > 59) {
					var timeout = alert('Game over!');
				} else {
					$min.text(minutes);
				}
			} else {
				$sec.text(seconds);
			}
		}, 1000);
	};

	$playBtn.on('click', function (e) {
		// Btn play - starts the game
		var $setName = prompt('Type your name: ');
		if ($setName === null) {
			return;
		}
		$playerName.text($setName);
		countTime();
		arrOfShapes[0] = newShape();
		arrOfShapes[1] = newShape();
		// console.log(arrOfShapes);
		currentShape = arrOfShapes[0];
		nextShape = arrOfShapes[1];
		drawBoard();
		drawBoardOnNext();
		startGame();
	});

	document.body.addEventListener("keydown", function (e) {
		e.preventDefault();
		switch (e.keyCode) {
			case 38:
				// up
				currentShape.rotate();
				break;
			case 40:
				// down
				currentShape.moveDown();
				break;
			case 37:
				// left
				currentShape.moveLeft();
				break;
			case 39:
				// right
				currentShape.moveRight();
			default:
		};
	});

	var newShape = function newShape() {
		// Get random shape
		var randonShape = shapes[parseInt(Math.random() * shapes.length, 10)];
		return new Shape(randonShape[0], randonShape[1]);
	};

	var startGame = function startGame() {
		// game loop
		var now = Date.now();
		var timer = now - setStart;
		if (timer > 500) {
			currentShape.moveDown();
			nextShape.drawOnBoardNext();
			setStart = now;
		}
		if (!done) {
			requestAnimationFrame(startGame);
		}
	};

	var drawPoint = function drawPoint(x, y) {
		// Drow single square on game-board
		ctx.fillRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		var style = ctx.strokeStyle;
		ctx.strokeStyle = "#5d5c5c";
		ctx.strokeRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		ctx.strokeStyle = style;
	};

	var drawPointOnNext = function drawPointOnNext(x, y) {
		// Drow single square on next block board
		ctxNext.fillRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		var style = ctxNext.strokeStyle;
		ctxNext.strokeStyle = "#5d5c5c";
		ctxNext.strokeRect(x * sizeOfTile, y * sizeOfTile, sizeOfTile, sizeOfTile);
		ctxNext.strokeStyle = style;
	};

	var drawBoard = function drawBoard() {
		// drow board on first canvas
		var backCol = ctx.fillStyle;
		for (var _i2 = 0; _i2 < numberOfColumns; _i2++) {
			for (var _j2 = 0; _j2 < numberOfRows; _j2++) {
				ctx.fillStyle = board[_i2][_j2] || clear;
				drawPoint(_j2, _i2, sizeOfTile, sizeOfTile);
			}
		}
		ctx.fillStyle = backCol;
	};

	var drawBoardOnNext = function drawBoardOnNext() {
		// drow board on next canvas
		var backCol = ctxNext.fillStyle;
		for (var _i3 = 0; _i3 < nOfColNext; _i3++) {
			for (var _j3 = 0; _j3 < nOfRowsNext; _j3++) {
				ctxNext.fillStyle = boardNext[_i3][_j3] || clear;
				drawPointOnNext(_j3, _i3, sizeOfTile, sizeOfTile);
			}
		}
		// console.log('draw');
		ctxNext.fillStyle = backCol;
	};

	var Shape = function () {
		function Shape(shapesArr, color) {
			_classCallCheck(this, Shape);

			// Class Shape
			this.shapesArr = shapesArr;
			this.firstShape = shapesArr[0];
			this.currIndex = 0;
			this.color = color;
			this.x = numberOfRows / 2 - parseInt(Math.ceil(this.firstShape.length / 2), 10);
			this.y = -2;
			this.xNext = nOfColNext / 2 - parseInt(Math.ceil(this.firstShape.length / 2), 10);
			this.yNext = nOfColNext / 2 - parseInt(Math.ceil(this.firstShape.length / 2), 10);
		}

		_createClass(Shape, [{
			key: 'rotate',
			value: function rotate() {
				var sticky = 0;
				var nextPattern = this.shapesArr[(this.currIndex + 1) % this.shapesArr.length];

				if (this.detectColision(0, 0, nextPattern)) {
					if (this.x > numberOfRows / 2) {
						sticky = -1;
					} else {
						sticky = 1;
					}
				}

				if (!this.detectColision(sticky, 0, nextPattern)) {
					this.clearPoint();
					this.x += sticky;
					this.currIndex = (this.currIndex + 1) % this.shapesArr.length;
					this.firstShape = this.shapesArr[this.currIndex];
					this.drawOnBoard();
				}
			}
		}, {
			key: 'detectColision',
			value: function detectColision(xMove, yMove, sh) {
				// Check for colision with walls and blocks
				for (var _i4 = 0; _i4 < sh.length; _i4++) {
					for (var _j4 = 0; _j4 < sh.length; _j4++) {
						if (sh[_i4][_j4]) {
							var x = this.x + _i4 + xMove;
							var y = this.y + _j4 + yMove;
							if (y >= numberOfColumns || x < 0 || x >= numberOfRows) {
								return hitWall;
							}
							if (y < 0) {
								continue;
							}
							if (board[y][x] !== false) {
								return hitBlock;
							}
						}
						continue;
					}
				}
				return 0;
			}
		}, {
			key: 'moveDown',
			value: function moveDown() {
				if (this.detectColision(0, 1, this.firstShape)) {
					this.stopMove();
					arrOfShapes[0] = arrOfShapes[1];
					arrOfShapes[1] = newShape();
					currentShape = arrOfShapes[0];
					drawBoardOnNext();
					nextShape = arrOfShapes[1];
					// console.log('moveDown');
					// console.log(currentShape);
					// console.log(nextShape);
				} else {
					this.clearPoint();
					this.y += 1;
					this.drawOnBoard();
				}
			}
		}, {
			key: 'moveRight',
			value: function moveRight() {
				if (!this.detectColision(1, 0, this.firstShape)) {
					this.clearPoint();
					this.x += 1;
					this.drawOnBoard();
				}
			}
		}, {
			key: 'moveLeft',
			value: function moveLeft() {
				if (!this.detectColision(-1, 0, this.firstShape)) {
					this.clearPoint();
					this.x -= 1;
					this.drawOnBoard();
				}
			}
		}, {
			key: 'stopMove',
			value: function stopMove() {
				// Stops shape moving
				for (var _i5 = 0; _i5 < this.firstShape.length; _i5++) {
					for (var _j5 = 0; _j5 < this.firstShape.length; _j5++) {
						if (this.y + _j5 < 0) {
							alert("Game Over!"); // Game over!
							done = true;
							clearInterval(timer);
							return;
						}
						if (!this.firstShape[_i5][_j5]) {
							continue;
						}
						board[this.y + _j5][this.x + _i5] = this.color;
					}
				}
				var fullRow = 0; // Remove full row and add points
				for (var _i6 = 0; _i6 < numberOfColumns; _i6++) {
					var _singleRow = true;
					for (var _j6 = 0; _j6 < numberOfRows; _j6++) {
						_singleRow = _singleRow && board[_i6][_j6] !== false;
					}
					if (_singleRow) {
						for (var i2 = _i6; i2 > 1; i2--) {
							for (var _j7 = 0; _j7 < numberOfRows; _j7++) {
								board[i2][_j7] = board[i2 - 1][_j7];
							}
						}
						for (var _i7 = 0; _i7 < numberOfRows; _i7++) {
							board[0][_i7] = false;
						}
						fullRow++;
					}
				}

				if (fullRow > 0) {
					singleRow += fullRow;
					drawBoard();
					score.textContent = singleRow;
				}
			}
		}, {
			key: 'clearPoint',
			value: function clearPoint() {
				// Clear color
				var backCol = ctx.fillStyle;
				ctx.fillStyle = clear;
				var x = this.x;
				var y = this.y;
				var numberOfBlocks = this.firstShape.length;
				for (var ix = 0; ix < numberOfBlocks; ix++) {
					for (var iy = 0; iy < numberOfBlocks; iy++) {
						if (this.firstShape[ix][iy]) {
							drawPoint(x + ix, y + iy);
						}
					}
				}
				ctx.fillStyle = backCol;
			}
		}, {
			key: 'drawOnBoard',
			value: function drawOnBoard() {
				var backCol = ctx.fillStyle;
				ctx.fillStyle = this.color;
				var x = this.x;
				var y = this.y;
				var numberOfBlocks = this.firstShape.length;
				for (var ix = 0; ix < numberOfBlocks; ix++) {
					for (var iy = 0; iy < numberOfBlocks; iy++) {
						if (this.firstShape[ix][iy]) {
							drawPoint(x + ix, y + iy);
						}
					}
				}
				ctx.fillStyle = backCol;
			}
		}, {
			key: 'drawOnBoardNext',
			value: function drawOnBoardNext() {
				var x = this.xNext;
				var y = this.yNext;
				var numberOfBlocks = this.firstShape.length;
				for (var ix = 0; ix < numberOfBlocks; ix++) {
					for (var iy = 0; iy < numberOfBlocks; iy++) {
						if (this.firstShape[ix][iy]) {
							ctxNext.fillStyle = this.color;
							drawPointOnNext(x + ix, y + iy);
						}
					}
				}
			}
		}]);

		return Shape;
	}();

	;
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var I = exports.I = [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]];

var J = exports.J = [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]], [[0, 1, 0], [0, 1, 0], [1, 1, 0]]];

var L = exports.L = [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]];

var O = exports.O = [[[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]];

var S = exports.S = [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]]];

var T = exports.T = [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]];

var Z = exports.Z = [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, ".container .row::before, .container .row::after {\n  display: block;\n  clear: both;\n  content: \"\";\n  height: 0;\n  visibility: hidden; }\n\n* {\n  box-sizing: border-box;\n  font-family: 'Play','Arial', sans-serif; }\n\nbody {\n  margin: 0;\n  padding: 0;\n  background: #C0C0C0; }\n\n.container {\n  width: 100%;\n  min-width: 360px;\n  height: 100vh; }\n  .container .row {\n    width: 100%; }\n    .container .row .col-1 {\n      float: left;\n      padding: 1%;\n      width: 100%;\n      min-height: 1px; }\n    .container .row .col-2 {\n      float: left;\n      padding: 1%;\n      width: 100%;\n      min-height: 1px; }\n    .container .row .col-3 {\n      float: left;\n      padding: 1%;\n      width: 100%;\n      min-height: 1px; }\n\n.tetris-game .game-info {\n  background-color: #c0c0c0;\n  text-align: center; }\n  .tetris-game .game-info .info {\n    display: inline-block;\n    padding: 0 2em;\n    font-size: 1.3em; }\n  .tetris-game .game-info #game-speed,\n  .tetris-game .game-info #game-time {\n    display: none; }\n  .tetris-game .game-info .play-btn {\n    margin-top: 20px;\n    color: white;\n    font-size: 1.3em;\n    background: gray;\n    width: 120px;\n    height: 40px;\n    border-radius: 10px;\n    box-shadow: 0px 6px 3px -3px rgba(255, 255, 255, 0.3) inset, 0px -6px 3px -3px rgba(0, 0, 0, 0.3) inset, 0px 8px 1px -1px rgba(0, 0, 0, 0.8); }\n\n.tetris-game .game-board {\n  background-color: #c0c0c0; }\n  .tetris-game .game-board h1 {\n    text-align: center;\n    color: blue;\n    position: relative;\n    top: 12px;\n    background: #c0c0c0;\n    margin: 0 auto;\n    width: 5em;\n    padding: 0 12px;\n    letter-spacing: 1px; }\n  .tetris-game .game-board .game-board-frame {\n    border: 5px solid #ecd21e;\n    width: 294px;\n    height: 430px;\n    padding: 10px;\n    margin: 0 auto; }\n    .tetris-game .game-board .game-board-frame #canvas-main {\n      margin: 0 auto;\n      width: 100%;\n      height: 100%;\n      background-color: #818c90;\n      display: block;\n      border: 1px solid #747b7d; }\n  .tetris-game .game-board .game-controls {\n    position: relative; }\n    .tetris-game .game-board .game-controls .buttons-contener {\n      z-index: 4;\n      position: absolute;\n      width: 250px;\n      height: 250px;\n      top: 10px;\n      left: 25%; }\n    .tetris-game .game-board .game-controls .vertical-buttons {\n      position: absolute;\n      background: gray;\n      width: 64px;\n      height: 186px;\n      top: 34px;\n      left: 94px;\n      border-radius: 10px;\n      box-shadow: 0px 6px 3px -3px rgba(255, 255, 255, 0.3) inset, 0px -6px 3px -3px rgba(0, 0, 0, 0.3) inset, 0px 8px 1px -1px rgba(0, 0, 0, 0.8);\n      z-index: 15; }\n    .tetris-game .game-board .game-controls .middle-circle {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background: #6e6e6e;\n      left: calc(50% - 16px);\n      top: calc(50% - 16px);\n      position: absolute;\n      box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.3) inset, 0 -1px 2px 0 rgba(255, 255, 255, 0.3) inset; }\n    .tetris-game .game-board .game-controls .horizontal-buttons {\n      position: absolute;\n      background: gray;\n      height: 64px;\n      width: 186px;\n      left: 34px;\n      top: 93px;\n      border-radius: 10px;\n      box-shadow: 0px 6px 3px -3px rgba(255, 255, 255, 0.3) inset, 0px -6px 3px -3px rgba(0, 0, 0, 0.3) inset, 0px 8px 1px -1px rgba(0, 0, 0, 0.8);\n      z-index: 10; }\n\n.tetris-game .game-next-block {\n  display: none; }\n\n@media (min-width: 650px) {\n  .container {\n    width: 100vw;\n    height: 100vh; }\n    .container .row {\n      width: 100%;\n      padding-top: 50px; }\n      .container .row .col-1 {\n        width: 32%; }\n        .container .row .col-1:nth-child(2) {\n          float: left;\n          padding: 1%;\n          width: 320px;\n          min-height: 400px; }\n  .tetris-game .game-info .info {\n    display: block;\n    padding-top: 10px; }\n  .tetris-game .game-info #player-name {\n    padding-top: 20px; }\n  .tetris-game .game-info #game-speed,\n  .tetris-game .game-info #game-time {\n    display: block; }\n  .tetris-game .game-board .game-controls {\n    display: none; }\n  .tetris-game .game-next-block {\n    display: none; } }\n\n@media (min-width: 1000px) {\n  .tetris-game .game-next-block {\n    display: block;\n    padding: 30px;\n    text-align: center; }\n    .tetris-game .game-next-block h2 {\n      font-size: 1em;\n      text-align: center;\n      color: blue;\n      position: relative;\n      top: 12px;\n      background: #c0c0c0;\n      margin: 0 auto;\n      width: 5em;\n      padding: 0 12px;\n      letter-spacing: 1px; }\n    .tetris-game .game-next-block .game-board-frame {\n      border: 3px solid #ecd21e;\n      width: 200px;\n      height: 200px;\n      padding: 10px;\n      margin: 0 auto; }\n      .tetris-game .game-next-block .game-board-frame #canvas-next {\n        display: block;\n        margin: 0 auto;\n        border: 1px solid #000000;\n        width: 100%;\n        height: 100%;\n        background-color: #818c90; } }\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);