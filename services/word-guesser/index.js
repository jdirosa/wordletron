const { words } = require("../../dal/data/words.json");
const { runGame } = require("../solver");
const answers = require("../../dal/data/ledger.json").games.map(
	(g) => g.answer
);
const runs = 100;

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

results.forEach((r) => {
	r.average = r.totalAttempts / (runs * answers.length);
});

results.sort((a, b) => a.totalAttempts - b.totalAttempts);

console.log({ bestAnswer: results[0] });
