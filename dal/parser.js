const fs = require("fs");
const path = require("path");

export function parseDictionary() {
	const dict = require("./data/dictionary.json");

	const words = Object.keys(dict);
	const wordsJson = JSON.stringify({ words });
	const fiveLetterWords = words
		.filter(
			(w) => w.length === 5 && w.indexOf("-") === -1 && w.indexOf(" ") === -1
		)
		.sort((a, b) => a.localeCompare(b));
	const fiveLetterWOrdsJson = JSON.stringify({ fiveLetterWords });

	fs.writeFileSync(path.resolve("./data/words.json"), wordsJson);
	fs.writeFileSync(
		path.resolve("./data/five-letter-words.json"),
		fiveLetterWOrdsJson
	);
}
