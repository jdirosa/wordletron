const { updateLedger } = require("./dal/leger");
const { parseDictionary } = require("./dal/parser");
const { runGame } = require("./services/solver");

runGame("humor", 235, false, "flare");
// parseDictionary();
