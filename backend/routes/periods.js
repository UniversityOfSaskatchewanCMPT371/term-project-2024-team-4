const express = require("express");
const router = express.Router();
const periodsHelper = require("../helperFiles/periodsHelper.js");

// POST: Create a New Period
router.post("/", async (req, res) => {
	const response = await periodsHelper.newPeriod(req);
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetch ALL Periods
 * @param {*} req - unused
 * @param {*} res - response from client contains all periods from database
 * @precond Database is accessible
 * @postcond
 * 	Success: Returns all periods from the database
 * 	Failure: Returns an error message based on what went wrong
 */
router.get("/", async (req, res) => {
	const response = await periodsHelper.getAllPeriods();
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * GET: Fetch a SINGLE period given the ID
 * @param {*} req - req URL parameter contains the period ID
 * @param {*} res - response to client
 * @precond req URL parameter contains a valid period ID that exists in the database
 * @postcond
 * 	Succesful: Returns the SINGLE requested period object
 * 	Failure: returns  an error messaged based on issue
 */

router.get("/:id", async (req, res) => {
	const response = await periodsHelper.getPeriodById(req);
	if (response === "Period not found") {
		return res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * PUT: Update a SINGLE existing period
 * @param {*} req - req URL paramter contains the period ID, req.body contains valid: name, start, end
 * @param {*} res - response to client
 * @precond req URL parameter contains existing period ID; req.body contains valid: name, start, end
 * @postcond
 * 	Success: Returns the updated Period object
 * 	Failure: Returns an error message based on the issue
 */
router.put("/:id", async (req, res) => {
	const response = await periodsHelper.updatePeriod(req);
	if (response === "Period not found") {
		return res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.json(response);
});

/**
 * DELETE: delete a SINGLE existing period given an ID
 * @param {*} req - req URL parameter contains id
 * @param {*} res - response to the client
 * @precond period ID from req URL parameter exists in the database
 * @postcond
 * 	Succesful: Period is deleted from database; empty response sent
 * 	Failure: Returns an error message based on the issue
 */
router.delete("/:id", async (req, res) => {
	const response = await periodsHelper.deletePeriod(req);
	if (response === "Period not found") {
		return res.json({ message: "Period not found" });
	}
	if (response instanceof Error) {
		return res.json({ error: response.message });
	}
	return res.send();
});

module.exports = router;
