const { updateLedger } = require("./dal/leger");
const { parseDictionary } = require("./dal/parser");
const { runGame } = require("./services/solver");
const {
	getBestWord,
	getGameAnswer,
	getPuzzleId,
} = require("./services/solver/utils");

const bestWord = getBestWord();
const puzzleId = getPuzzleId();
const answer = getGameAnswer(puzzleId);
runGame(answer, puzzleId, false, bestWord);
