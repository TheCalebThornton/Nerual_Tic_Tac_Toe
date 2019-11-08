const aiUtil = require ("../utility.js");
const boardPatterns = require ("./board-patterns.json");

const boardStatesAndSolutions = [
	{
		state: {
			a1:"",a2:"",a3:"",
			b1:"",b2:"",b3:"",
			c1:"",c2:"",c3:""
		},
		solution: "b2"
	}
];

// initialize weights randomly
// TODO digest this: -> 2*np.random.random((3,1)) - 1
const weight0 = 2*rng.generateRandomNumber(0, 1, true) - 1;

function makeAMove (board) {
	neuralProperties = aiUtil.trainNeuralNetwork(boardStatesAndSolutions, weight0, 10000);
	return aiUtil.answer(neuralProperties, board);
}


module.exports = {
	makeAMove: makeAMove
}