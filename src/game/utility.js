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