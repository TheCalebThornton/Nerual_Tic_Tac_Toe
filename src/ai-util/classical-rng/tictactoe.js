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