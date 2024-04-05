const express = require("express");
const router = express.Router();
const periodsHelper = require("../helperFiles/periodsHelper.js");
const authenticateAdmin = require("../middleware/authenticate.js");
const {
	validate,
	periodValidationRules,
} = require("../middleware/sanitize.js");

/**
 * POST: Create a new Period
 * @param {*} req - req.body containing name, start, end
 * @param {*} res - response to client
 * @precond req.body contains valid fields: name, start, end
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 *  Succesful: Returns newly created Period object
 * 	Failure: Returns error message based on what went wrong
 */
router.post(
	"/",
	authenticateAdmin,
	periodValidationRules(),
	validate,
	async (req, res) => {
		const response = await periodsHelper.newPeriod(req);
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

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
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Success: Returns the updated Period object
 * 	Failure: Returns an error message based on the issue
 */
router.put(
	"/:id",
	authenticateAdmin,
	periodValidationRules(),
	validate,
	async (req, res) => {
		const response = await periodsHelper.updatePeriod(req);
		if (response === "Period not found") {
			return res.json({ message: "Period not found" });
		}
		if (response instanceof Error) {
			return res.json({ error: response.message });
		}
		return res.json(response);
	},
);

/**
 * DELETE: delete a SINGLE existing period given an ID
 * @param {*} req - req URL parameter contains id
 * @param {*} res - response to the client
 * @precond period ID from req URL parameter exists in the database
 * @precond A valid signed token cookie must be present in the request which is checked by authenticateAdmin middleware.
 * @postcond
 * 	Succesful: Period is deleted from database; empty response sent
 * 	Failure: Returns an error message based on the issue
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
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
