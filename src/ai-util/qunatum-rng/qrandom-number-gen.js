const classicalRngAi = require("../classical-rng/random-number-gen.js");

const ANU_CONSTANT = {
	dataType: "unit8",
	length: 1,
	size: 6, // arbitrary val to satisfy API
	maxVal: 255,
	minVal: 0
}

const ANU_URL = `http://qrng.anu.edu.au/API/jsonI.php?length=${ANU_CONSTANT.length}&type=${ANU_CONSTANT.dataType}&size=${ANU_CONSTANT.size}`;

function fallbackOnClassical (min, max, decimal) {
	return classicalRngAi.generateRandomNumber(min, max, decimal);
}

/** Generates a random number between 0 and 'max'
 * @param {Number} min the minimum possible integer for the range
 * @param {Number} max the maximum possible integer for the range
 * @param {Function} callback this is an async call, need to have a function to preform when finished
 * @param {Boolean} decimal use this flag to return decimal response instead of integer (defaulted to false)
 */
function fetchQNumber (min, max, callback, decimal) {
	// This is hosted by the Austrailian National University; It often doesnt work...
	const resp = fetch(`${ANU_URL}&time=${+ new Date}`);
	resp.then(respBody => {
		if (!respBody.success) {
			console.log("qrandom API responded with unsuccessful. Falling back on Classical RNG.");
			return callback(fallbackOnClassical(min, max, decimal));
		}
		const qrandomNum = respBody.data[0];
		const rmin = Math.ceil(min);
		// We add 1 to the max so that floor will still have a chance of selecting 'max' param
		const rmax = Math.floor(max+1);
	
		const boundary = rmax - rmin;
		const rand = ((qrandomNum / ANU_CONSTANT.maxVal) * boundary) + rmin;
		console.log("Successful call to ANU: " + rand);

		rand = decimal ? rand : Math.floor(rand);
		callback(rand);
	}).catch(err => {
		console.log("An unexpected error occured. Falling back on Classical RNG.");
		return callback(fallbackOnClassical(min, max, decimal));
	});
}


module.exports = {
	fetchQNumber: fetchQNumber
}