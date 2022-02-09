const { noDuplicateLetters: words } = require("../../dal/data/no-dupes.json");
const { runGame } = require("../solver");
const answers = require("../../dal/data/ledger.json").games.map(
	(g) => g.answer
);
const runs = 50;

function tryRun(word, answer) {
	return runGame(answer, "NONE", true, word);
}

const results = words.map((w) => {
	return {
		word: w,
		totalAttempts: 0,
		average: 0,
	};
});

answers.forEach((answer) => {
	words.forEach((w) => {
		const idx = results.findIndex((r) => r.word === w);
		for (i = 0; i < runs; i++) {
			const result = tryRun(w, answer);
			results[idx].totalAttempts += result;
		}
	});
});

results.sort((a, b) => a.totalAttempts - b.totalAttempts);

results[0].average = results[0].totalAttempts / (runs * answers.length);

results[results.length - 1].average =
	results[results.length - 1].totalAttempts / (runs * answers.length);

console.log({
	runs,
	bestAnswer: results[0],
	worstAnswer: results[results.length - 1],
});
