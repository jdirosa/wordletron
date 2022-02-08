let words = require("./five-letter-words.json").fiveLetterWords;
let dictionary = require("./dictionary.json");
const answer = "frame";
const showDefinitions = true;
const showGuesses = true;

const definitions = [];
const allGuesses = [];

function logIfAnswer(message, guess) {
	if (guess === answer || !guess) {
		console.log(`${guess} : ${message}`);
	}
}
function isSolved(legend) {
	return legend.every((i) => i === 0);
}
function hasPerfectMatch(legend, lastGuess, letter) {
	for (let i = 0; i < 5; i++) {
		if (legend[i] !== 0) {
			continue;
		}
		if (lastGuess[i] === letter) {
			return true;
		}
	}
}
function matches(bestGuess, guess, legend) {
	for (let i = 0; i < 5; i++) {
		// must match best guess
		if (legend[i] === 0 && bestGuess[i] !== guess[i]) {
			logIfAnswer("FIltering out because not a perfect match", guess);
			return false;
		}
		// The word must have this letter, but it must not be in this position
		if (legend[i] === 1) {
			if (bestGuess[i] === guess[i]) {
				logIfAnswer(
					"filtering out because of used letter but in wrong spot",
					guess
				);
				return false;
			}
			if (guess.indexOf(bestGuess[i]) < 0) {
				logIfAnswer("filtering out because of used letter not exist", guess);
				return false;
			}
		}
		// Cannot contain this letter
		if (legend[i] === -1) {
			const badLetter = bestGuess[i]; // letter we are filtering out
			const hasBadLetter = guess.indexOf(badLetter) >= 0;

			// cannot currently determine if there are multiple instances of that letter in the answer
			if (hasBadLetter && getLetterCount(answer, badLetter) < 1) {
				logIfAnswer(
					`filtering out because hasBadLetter '${badLetter}' and that letter appears once`,
					guess
				);
				return false;
			}
		}
	}
	return true;
}
function getLetterCount(word, letter) {
	return word.split(letter).length - 1;
}
function formatOutput(input) {
	return input === 0 ? "[ ✅ ]" : input === 1 ? "[ 👽 ]" : "[ ❌ ]";
}
function randomWord() {
	const seed = Math.floor(Math.random() * words.length);
	return words[seed];
}
function getAccuracy(guess, answer) {
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

let legend = [-1, -1, -1, -1, -1];
let tryCount = 1;

console.log("Starting game, solving for: '" + answer.toUpperCase() + "'\n");

while (!legend.every((i) => i === 0) && tryCount < 100 && words.length) {
	let bestGuess = randomWord();
	allGuesses.push(bestGuess);
	legend = getAccuracy(bestGuess, answer);

	const definition = dictionary[bestGuess]
		? `${bestGuess}: ${dictionary[bestGuess]}` + "\n"
		: "";
	definitions.push(definition);

	if (showGuesses) {
		console.log(
			`${getAccuracy(bestGuess, answer)
				.map((i) => formatOutput(i))
				.join(" ")} '${bestGuess.toUpperCase()}' guessed from a possible ${
				words.length
			} words`
		);
	}

	words = words.filter((f) => matches(bestGuess, f, legend) && f !== bestGuess);

	tryCount++;
	if (!words.length) {
		break;
	}
}

if (isSolved(legend)) {
	console.log(
		`\nWORDLETRON solved this successfully after ${tryCount - 1} attempts!`
	);
	if (showDefinitions) {
		console.log(
			`\n\n\nWant to know what all those guessed words mean?:\n\n\n${definitions.join(
				"\n--------------------------------------\n\n"
			)}`
		);
	}

	console.log(`Wordle score ${allGuesses.length}/6`);
	allGuesses.forEach((g) => {
		console.log(
			getAccuracy(g, answer)
				.map((i) => formatOutput(i))
				.join(" ")
		);
	});

	console.log(
		`\nTry to beat Wordletron at https://www.powerlanguage.co.uk/wordle/`
	);
} else {
	console.log(`\n Failed  after ${tryCount - 1} attempts!`);
}
