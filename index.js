const { updateLedger } = require("./dal/leger");
const { parseDictionary } = require("./dal/parser");
const { runGame } = require("./services/solver");
const { getBestWord } = require("./services/solver/utils");

const bestWord = getBestWord();
runGame("ultra", 999, false, bestWord);
// parseDictionary();
