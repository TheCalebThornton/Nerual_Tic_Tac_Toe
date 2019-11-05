const playerOne = {
	allignment: "X",
	key: "P1"
}

const aiPlayer = {
	allignment: "O",
	key: "AI"
}
const winningCombinations = [
	["a1", "a2", "a3"],
	["b1", "b2", "b3"],
	["c1", "c2", "c3"],
	["a1", "b2", "c3"],
	["a3", "b2", "c1"]
];

let gameState = {
	gameActive: true,
	playerTurn: playerOne,
	board: {
		a1: "", a2: "", a3: "",
		b1: "", b2: "", b3: "",
		c1: "", c2: "", c3: ""
	}
};

function evaluateBoard () {
	const board = gameState.board;
	// check for win conditions:
	const placementKeys = Object.keys(board).filter(key => board[key] === gameState.playerTurn.allignment);
	let winFound;
	for (let i=0; !winFound && i < winningCombinations.length; i++) {
		const combo = winningCombinations[i];
		// TODO how can we improve this?
		winFound = placementKeys.indexOf(combo[0]) !== -1 &&
		placementKeys.indexOf(combo[1]) !== -1  &&
		placementKeys.indexOf(combo[2]) !== -1 ;
	};
	if (winFound) {
		console.log("WIN!");
		//Display winning message
	} else {
		//Change player turn if no win condition
		console.log("Next Turn!");
	}
	return {};
}

function updateBoardStateAndHTML (e) {
	let boardClone, moveValue;
	try {
		boardClone = JSON.parse(JSON.stringify(gameState.board));
		moveValue = gameState.playerTurn.allignment;
		boardClone[e.target.id] = moveValue;
	} catch (e) {
		console.error(e);
		// do not update html or state if there is an error.
		return;
	}
	e.target.innerHTML = moveValue;
	gameState.board = boardClone;
}

function isMoveValid (e) {
	if (!gameState.gameActive) {
		return false;
	}
	if (gameState.playerTurn === "AI") {
		return false;
	}
	// Space is occupied
	if (gameState.board[e.target.id] !== "") {
		return false
	}

	return true;
}

function onCellClicked (e) {
	if (!isMoveValid(e)) {
		return;
	}
	updateBoardStateAndHTML(e);
	evaluateBoard();
}

document.addEventListener("DOMContentLoaded", function(){
	// on click: 
	//  1. validate move (player turn, game active, legal move)
	//  2. evaluateBoard (is the game over? Which side won, X or O. Display winner message based on allignment)
	//  3. Game not over, PCs turn (RNG selection of turn, add a 500ms timer to placement)

	function callback(e) {
		var e = window.e || e;
		console.log(e.target.tagName);
		if (e.target.tagName === 'TD') {
			onCellClicked(e);
		}
	
		return;
	}
	
	if (document.addEventListener)
		document.addEventListener('click', callback, false);
	else
		document.attachEvent('onclick', callback);
});