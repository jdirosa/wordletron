const fs = require("fs");
const path = require("path");
const ledger = require("./data/ledger.json");

/**
 * Returns the ledger of past runs
 */
function getLedger() {
	return ledger;
}

/** Get a ledger item by date or puzzleId */
function getLedgerItem(date, puzzleId) {}

/**
 * Upserts a ledger item
 * @param {*} date The date of the puzzle
 * @param {*} id The puzzle number
 * @param {*} scoreboard The scoreboard
 */
function updateLedger(date, id, score, answer) {
	let ledger = getLedger();
	let gameIndex = -1;

	// Determine if the ledger exists. Create if not
	if (Object.keys(ledger).indexOf("games") < 0) {
		console.log("No ledger found. Creating one...");
		ledger = {
			games: [],
		};
	}

	// Attempt to find the game
	if (ledger.games.length) {
		gameIndex = ledger.games.findIndex((g) => g.id === id);
	}

	if (gameIndex >= 0) {
		ledger.games[gameIndex] = { date, id, score, answer };
	} else {
		ledger.games.push({ date, id, score, answer });
	}
	ledger.games.sort((a, b) => a.id - b.id);
	fs.writeFileSync(
		path.resolve("/home/james/repos/personal/wordletron/dal/data/ledger.json"),
		JSON.stringify(ledger, null, 2)
	);
}

exports.updateLedger = updateLedger;
