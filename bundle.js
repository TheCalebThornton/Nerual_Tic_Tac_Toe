(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/** Generates a random number between 0 and 'max'
 * @param {Number} min the minimum possible integer for the range
 * @param {Number} max the maximum possible integer for the range
 * @param {Boolean} decimal use this flag to return decimal response instead of integer (defaulted to false)
 */
function generateRandomNumber (min, max, decimal) {
	const rmin = Math.ceil(min);
	// We add 1 to the max so that floor will still have a chance of selecting 'max' param
	const rmax = Math.floor(max+1);
	const boundary = (rmax - rmin) + rmin;
	const rand = (Math.random() * boundary) + min;
	if (decimal) {
		return rand;
	} else {
		return Math.floor(rand);
	}
}


module.exports = {
	generateRandomNumber: generateRandomNumber
}
},{}],2:[function(require,module,exports){
const rng = require ("./random-number-gen.js");

function selectAMoveFromList (potentialMoves) {
	const rand = rng.generateRandomNumber(0, potentialMoves.length -1);
	return potentialMoves[rand];
}

function makeAMove (board) {
	const potentialMoves = Object.keys(board).filter(key => board[key] === "");;
	return selectAMoveFromList(potentialMoves);
}


module.exports = {
	makeAMove: makeAMove
}
},{"./random-number-gen.js":1}],3:[function(require,module,exports){
const WINNING_COMBINATIONS = [
	["a1", "a2", "a3"],
	["b1", "b2", "b3"],
	["c1", "c2", "c3"],
	["a1", "b1", "c1"],
	["a2", "b2", "c2"],
	["a3", "b3", "c3"],
	["a1", "b2", "c3"],
	["a3", "b2", "c1"]
];

function isMoveValid (targetId, gameState) {
	if (!gameState.gameActive) {
		return false;
	}
	// re-eval this check
	if (gameState.playerTurn === "AI") {
		return false;
	}
	// Space is occupied
	if (gameState.board[targetId] !== "") {
		return false
	}

	return true;
}

function isGameWin (board, allignment) {
	const placementKeys = Object.keys(board).filter(key => board[key] === allignment);
	let winFound = false;
	for (let i=0; !winFound && i < WINNING_COMBINATIONS.length; i++) {
		const combo = WINNING_COMBINATIONS[i];
		// TODO how can we improve this?
		winFound = placementKeys.indexOf(combo[0]) !== -1 &&
		placementKeys.indexOf(combo[1]) !== -1  &&
		placementKeys.indexOf(combo[2]) !== -1 ;
	};
	return winFound;
}

function isGameTie (board) {
	const boardKeys = Object.keys(board);
	return boardKeys.length === boardKeys.filter(key => board[key] !== "").length;
}

function checkForGameOver (board, allignment) {
	const isWin = isGameWin(board, allignment);
	const isTie = isWin ? false : isGameTie(board);
	return {
		isWin: isWin,
		isTie: isTie,
		isOver: isWin || isTie
	}
}

module.exports = {
	isMoveValid: isMoveValid,
	checkForGameOver: checkForGameOver
}

},{}],4:[function(require,module,exports){
const commonUtil = require("./common-util.js");
const gameUtil = require("../utility.js");
const classicalRngAi = require("../../ai-util/classical-rng/tictactoe.js");
// TODO Can't get this module-alias thing to work..
// const classicalRngAi2 = require("@src/ai-util/classical-rng/tictactoe.js");

let players = {
	p1: {
		allignment: "X",
		isAI: false,
		name: "Player One",
		key: "p1"
	},
	p2: {
		allignment: "O",
		isAI: true,
		name: "RNG AI",
		key: "p2"
	}
}

let gameState = {
	gameActive: true,
	activePlayer: players.p1,
	board: {
		a1: "", a2: "", a3: "",
		b1: "", b2: "", b3: "",
		c1: "", c2: "", c3: ""
	}
};

// TODO this should be refactored to a separate file that handles the boardState properties and updates the HTML whenever the state changes
function updateBoardStateAndHTML (target) {
	let boardClone, moveValue;
	try {
		boardClone = JSON.parse(JSON.stringify(gameState.board));
		moveValue = gameState.activePlayer.allignment;
		boardClone[target.id] = moveValue;
	} catch (e) {
		console.error(e);
		// do not update html or state if there is an error.
		return;
	}
	// This needs to be an Atomic process
	target.innerHTML = moveValue;
	gameState.board = boardClone;
}

function AIUpdateBoardState (boardKey) {
	updateBoardStateAndHTML(document.getElementById(boardKey));
}

function declareEndGame (gameResult) {
	if (gameResult.isWin) {
		gameUtil.displayWinner(gameState.activePlayer);
	} else if (gameResult.isTie) {
		gameUtil.displayTie();
	}
}

function startNextTurn () {
	const gameResult = commonUtil.checkForGameOver(gameState.board, gameState.activePlayer.allignment);
	if (gameResult.isOver) {
		gameState.gameActive = false;
		declareEndGame(gameResult);
	}

	// Transition to the next player's turn
	if (gameState.gameActive) {
		gameState.activePlayer = gameState.activePlayer.key === "p1" ? players.p2 : players.p1;
		gameUtil.displayPlayerTurn(gameState.activePlayer);

		if (gameState.activePlayer.isAI) {
			const aiMove = classicalRngAi.makeAMove(gameState.board);
			AIUpdateBoardState(aiMove);
			startNextTurn();
		}
	}
}

function onCellClicked (e) {
	if (!commonUtil.isMoveValid(e.target.id, gameState)) {
		return;
	}
	updateBoardStateAndHTML(e.target);
	startNextTurn();
}

function onInit () {
	function callback(e) {
		var e = window.e || e;
		if (e.target.tagName === 'TD') {
			onCellClicked(e);
		}
	
		return;
	}

	gameState
	
	if (document.addEventListener) {
		document.addEventListener('click', callback, false);
	} else {
		document.attachEvent('onclick', callback);
	}
}

module.exports = {
	init: onInit
}
},{"../../ai-util/classical-rng/tictactoe.js":2,"../utility.js":5,"./common-util.js":3}],5:[function(require,module,exports){
const MESSAGE_BANNER_SELECTOR = "#messageBanner";

function displayWinner (player) {
	let bannerContainer = document.querySelector(MESSAGE_BANNER_SELECTOR);
	const playerName = player.name || player.allignment;
	bannerContainer.innerHTML = `
		<h2 class="winner">${playerName} wins! </h2>
	`;
}

function displayTie () {
	let bannerContainer = document.querySelector(MESSAGE_BANNER_SELECTOR);
	bannerContainer.innerHTML = `
		<h2 class="tie">Tie game! </h2>
	`;
}

function displayPlayerTurn (player) {
	let bannerContainer = document.querySelector(MESSAGE_BANNER_SELECTOR);
	const playerName = player.name || player.allignment;
	bannerContainer.innerHTML = `
		<h2 class="turn-message">${playerName}'s turn.</h2>
	`;
}


module.exports = {
	displayWinner: displayWinner,
	displayTie: displayTie,
	displayPlayerTurn: displayPlayerTurn
};
},{}],6:[function(require,module,exports){
const tictactoe = require("./game/tictactoe/module.js");

document.addEventListener("DOMContentLoaded", function () {
	tictactoe.init();
}); 
},{"./game/tictactoe/module.js":4}]},{},[6]);
