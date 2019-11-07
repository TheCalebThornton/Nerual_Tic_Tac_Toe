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