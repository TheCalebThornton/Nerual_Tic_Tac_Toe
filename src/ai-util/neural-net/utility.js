const rng = require ("../../classical-rng/random-number-gen.js");

function sigmoidFn(x, deriv) {
	return deriv ? x*(1-x) : 1/(1+Math.exp(-x))
}


function trainNeuralNetwork (patterns, weight, iterations) {
	const iter = iterations > 0 ? iterations : 10000;
	let syn0 = weight,
		l0 = JSON.parse(JSON.stringify(patterns)),
		l1,
		l1_err;

	for (let i=0; i < iter; i++) {
		// forward propagation
		// Need a math libaray for dot Function ?
		l1 = nonlin(np.dot(l0,syn0))
 
		// how much did we miss?
		l1_err = patterns[i].solution - l1
		
		// multiply how much we missed by the
		// slope of the sigmoid at the values in l1
		l1_delta = l1_err * nonlin(l1,True)
		
		// update weights
		syn0 += np.dot(l0.T,l1_delta)
	}

	return {
		weight: syn0,
		accuracy: l1
	}
}

function answer (neuralProperties, patternUnsolved) {
	// TODO how can I translate neural props to run the AI
}


module.exports = {
	trainNeuralNetwork: trainNeuralNetwork,
	answer: answer
}