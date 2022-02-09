const { getLetterCount } = require("../services/solver/utils/");

const fs = require("fs");
const path = require("path");

function parseDictionary() {
	const dict = require("./data/dictionary.json");

	const words = Object.keys(dict);
	const wordsJson = JSON.stringify({ words });
	const fiveLetterWords = words
		.filter(
			(w) => w.length === 5 && w.indexOf("-") === -1 && w.indexOf(" ") === -1
		)
		.sort((a, b) => a.localeCompare(b));
	const noDuplicateLetters = fiveLetterWords.filter((f) =>
		f.split("").every((l) => getLetterCount(f, l) === 1)
	);

	const fiveLetterWOrdsJson = JSON.stringify({ fiveLetterWords });
	const noDuplicateLettersJson = JSON.stringify({ noDuplicateLetters });

	fs.writeFileSync(
		path.resolve(
			"/home/james/repos/personal/wordletron/dal/data/no-dupes.json"
		),
		noDuplicateLettersJson
	);
	// fs.writeFileSync(path.resolve("./data/words.json"), wordsJson);
	// fs.writeFileSync(
	// 	path.resolve("./data/five-letter-words.json"),
	// 	fiveLetterWOrdsJson
	// );
}

parseDictionary();
exports.parseDictionary = parseDictionary;
