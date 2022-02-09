const dictionary = require("../../../dal/data/dictionary.json");
const { updateLedger } = require("../../../dal/leger");

/** Returns true if the game is solved */
function isSolved(scoreCard) {
	return scoreCard.every((i) => i === 0);
}

/**
 * Given a previous guess, current guess,
 * and previous guess' scoreCard, determine
 * if the new guess is a match */
function isMatch(bestGuess, guess, scoreCard, answer) {
	for (let i = 0; i < 5; i++) {
		// must match best guess
		if (scoreCard[i] === 0 && bestGuess[i] !== guess[i]) {
			return false;
		}
		// The word must have this letter, but it must not be in this position
		if (scoreCard[i] === 1) {
			if (bestGuess[i] === guess[i]) {
				return false;
			}
			if (guess.indexOf(bestGuess[i]) < 0) {
				return false;
			}
		}
		// Cannot contain this letter
		if (scoreCard[i] === -1) {
			const badLetter = bestGuess[i]; // letter we are filtering out
			const hasBadLetter = guess.indexOf(badLetter) >= 0;

			// cannot currently determine if there are multiple instances of that letter in the answer
			if (hasBadLetter && getLetterCount(answer, badLetter) < 1) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Get the number of instances of a letter in a given word
 * @param {*} word
 * @param {*} letter
 * @returns
 */
function getLetterCount(word, letter) {
	return word.split(letter).length - 1;
}

/**
 * Make the numerical array a fun UI friendly output
 * @param {*} input
 * @returns
 */
function formatOutput(input) {
	return input === 0 ? "[ ✅ ]" : input === 1 ? "[ 👽 ]" : "[ ❌ ]";
}

/**
 * returns a random word from a list of words
 */
function randomWord(words) {
	const seed = Math.floor(Math.random() * words.length);
	return words[seed];
}

/**
 * Given a guess and an answer, returns the score card
 * @param {*} guess
 * @param {*} answer
 * @returns
 */
function getScoreCard(guess, answer) {
	const response = [-1, -1, -1, -1, -1];
	// -1 is not not existing, 0 is a perfect match, 1 is a match but wrong position

	// first pass is get the perfect matches
	for (let i = 0; i < 5; i++) {
		const guessLetter = guess[i];
		if (guessLetter === answer[i]) {
			response[i] = 0;
		}
	}

	// next pass
	for (let i = 0; i < 5; i++) {
		if (response[i] === 0) {
			continue;
		}
		const guessLetter = guess[i];
		if (answer.indexOf(guessLetter) < 0) {
			response[i] = -1;
			continue;
		}
		// letter exists. need to make sure duplicates work correctly. This answer is not good enough. 3 of the same would break it
		if (
			getLetterCount(guess, guessLetter) <= getLetterCount(answer, guessLetter)
		) {
			response[i] = 1;
		}
	}
	return response;
}

function printGuess(guess, answer, words) {
	log(
		`${getScoreCard(guess, answer)
			.map((i) => formatOutput(i))
			.join(" ")} '${guess.toUpperCase()}' guessed from a possible ${
			words.length
		} words`
	);
}

/**
 * Returns the matching definition. TODO: If the definition references another def, get that
 */
function getDefinition(word) {
	return dictionary[word] ? `${word}: ${dictionary[word]}` + "\n" : "";
}

function printResults(
	scoreCard,
	attempts,
	showDefinitions,
	allGuesses,
	answer,
	puzzleId
) {
	if (isSolved(scoreCard)) {
		log(`\nWORDLETRON solved this successfully after ${attempts} attempts!`);

		// Print the definitions
		if (showDefinitions) {
			log(
				`\n\n\nWant to know what all those guessed words mean?:\n\n\n${allGuesses
					.map((g) => getDefinition(g))
					.join("\n--------------------------------------\n\n")}`
			);
		}

		// Score!
		log(`Wordle ${puzzleId} ${allGuesses.length}/6`);

		// Scorecard
		allGuesses.forEach((g) => {
			log(
				getScoreCard(g, answer)
					.map((i) => formatOutput(i))
					.join(" ")
			);
		});

		// Tag the ending
		log(`\nTry to beat Wordletron at https://www.powerlanguage.co.uk/wordle/`);
	} else {
		log(`\n Failed  after ${attempts} attempts!`);
	}
}

/** compute */
/**
 * Saves the results of the game
 * @param {*} guesses
 * @param {*} answer
 * @param {*} puzzleId
 */
function saveResults(guesses, answer, puzzleId) {
	const score = guesses.map((g) => getScoreCard(g, answer));

	updateLedger(
		new Date(new Date().setHours(0, 0, 0, 0)).toDateString(),
		puzzleId,
		score,
		answer
	);
}

function log(message) {
	const shouldLog = true;
	if (shouldLog) {
		console.log(message);
	}
}

exports.log = log;
exports.saveResults = saveResults;
exports.printResults = printResults;
exports.printGuess = printGuess;
exports.getDefinition = getDefinition;
exports.isSolved = isSolved;
exports.isMatch = isMatch;
exports.randomWord = randomWord;
exports.getScoreCard = getScoreCard;
exports.formatOutput = formatOutput;
exports.getLetterCount = getLetterCount;
