const rng = require ("./qrandom-number-gen.js");

function requestAMove (board, callback) {
	const potentialMoves = Object.keys(board).filter(key => board[key] === "");
	function translateIndexToMove (movesIndex) {
		callback(potentialMoves[movesIndex]);
	}
	// The following call is async, when it finsishes, it will invoke the callback with a selection
	rng.fetchQNumber(0, potentialMoves.length -1, translateIndexToMove);
}


module.exports = {
	requestAMove: requestAMove
}