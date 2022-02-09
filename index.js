const { updateLedger } = require("./dal/leger");

updateLedger(new Date().setHours(0, 0, 0, 0), 100, [
	[-1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1],
]);
