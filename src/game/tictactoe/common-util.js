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
