const { updateLedger } = require("./dal/leger");
const { parseDictionary } = require("./dal/parser");
const { runGame } = require("./services/solver");
const {
	getBestWord,
	getGameAnswer,
	getPuzzleId,
} = require("./services/solver/utils");

// get puzzle data
const bestWord = getBestWord();
const puzzleId = getPuzzleId();
const answer = getGameAnswer(puzzleId);
const dryRun = false; // used if we don't want to record or print outputs.

runGame(answer, puzzleId, dryRun, bestWord);
