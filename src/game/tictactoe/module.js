const commonUtil = require("./common-util.js");
const gameUtil = require("../dom-utility.js");
const classicalRngAi = require("../../ai-util/classical-rng/tictactoe.js");
const quantumRngAi = require("../../ai-util/qunatum-rng/tictactoe.js");
// TODO Can't get this module-alias thing to work..
// const classicalRngAi2 = require("@src/ai-util/classical-rng/tictactoe.js");

const EMPTY_BOARD = {
	a1: "", a2: "", a3: "",
	b1: "", b2: "", b3: "",
	c1: "", c2: "", c3: ""
}
const CLASSICAL_AI = "classical";
const QUANTUM_AI = "quantum"

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
		aiType: CLASSICAL_AI,
		name: "RNG AI",
		key: "p2"
	}
}

let gameState = {
	gameActive: false,
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
	startNextTurn();
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
			if (gameState.activePlayer.aiType === CLASSICAL_AI) {
				const aiMove = classicalRngAi.makeAMove(gameState.board);
				AIUpdateBoardState(aiMove);
			} else if (gameState.activePlayer.aiType === QUANTUM_AI){
				quantumRngAi.requestAMove(gameState.board, AIUpdateBoardState)
			} else {
				console.error("Invalid game setup!")
			}
		}
	}
}

function startTicTacToe (aiType) {
	if (aiType) {players.p2.aiType = aiType};
	gameState.board = JSON.parse(JSON.stringify(EMPTY_BOARD));
	gameState.gameActive = true;
	gameState.activePlayer = players.p1;
	document.getElementById("board").classList.remove("hide");
	gameUtil.displayPlayerTurn(gameState.activePlayer);
}

function onCellClicked (e) {
	if (!commonUtil.isMoveValid(e.target.id, gameState)) {
		return;
	}
	updateBoardStateAndHTML(e.target);
	startNextTurn();
}

function onClassicalRngClick (e) {
	startTicTacToe(CLASSICAL_AI);
	e.target.closest("ul").classList.add("hide");
}

function onQuantumRNGClick (e) {
	startTicTacToe(QUANTUM_AI);
	e.target.closest("ul").classList.add("hide");
}

function onInit () {
	function callback(e) {
		var e = window.e || e;
		// TODO scope this to the gameBoard
		if (e.target.tagName === "TD" && e.target.closest("table").id === "board") {
			onCellClicked(e);
		}
		if (e.target.id === "classiclRngBtn") {
			onClassicalRngClick(e);
		}
		if (e.target.id === "quantumRngBtn") {
			onQuantumRNGClick(e);
		}
	
		return;
	}
	
	// bind event listeners
	if (document.addEventListener) {
		document.addEventListener('click', callback, false);
	} else {
		document.attachEvent('onclick', callback);
	}
}

module.exports = {
	init: onInit
}