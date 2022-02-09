const allWords =
	require("../../dal/data/five-letter-words.json").fiveLetterWords;

const {
	isMatch,
	randomWord,
	isSolved,
	getScoreCard,
	getDefinition,
	printGuess,
	printResults,
	saveResults,
} = require("./utils/index");

// settings
const showDefinitions = false;
const showGuesses = true;

function runGame(answer, puzzleId, dryRun = false, firstGuess = "") {
	let words = [...allWords];
	// game vars
	const definitions = [];
	const allGuesses = [];
	let scoreCard = [-1, -1, -1, -1, -1];
	let tryCount = 0;

	while (!isSolved(scoreCard) && tryCount < 100 && words.length) {
		// Grab a guess, and score it
		let bestGuess =
			tryCount === 0 && firstGuess ? firstGuess : randomWord(words);
		allGuesses.push(bestGuess);
		scoreCard = getScoreCard(bestGuess, answer);

		// Log the definitions
		definitions.push(getDefinition(bestGuess));

		if (showGuesses && !dryRun) {
			printGuess(bestGuess, answer, words);
		}

		words = words.filter(
			(f) => isMatch(bestGuess, f, scoreCard, answer) && f !== bestGuess
		);

		tryCount++;
		if (!words.length) {
			break;
		}
	}

	if (!dryRun) {
		printResults(
			scoreCard,
			tryCount - 1,
			showDefinitions,
			allGuesses,
			answer,
			puzzleId
		);
	}

	if (!dryRun) {
		saveResults(allGuesses, answer, puzzleId);
	}

	return allGuesses.length;
}

// runGame("elder", 233);
exports.runGame = runGame;
