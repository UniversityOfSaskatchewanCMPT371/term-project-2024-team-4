const { Period } = require("../dist/entity");
const express = require("express");
const router = express.Router();
const myDatabase = require("../config/db");
const { logger } = require("../config/logger");

/**
 * POST: Create a new period
 * @param {*} req - req.body contains valid: name, start, end
 * @param {*} res - response to client
 * @precond req.body contains: name, start, end
 * @postcond
 * 	Success: Returns newly created Period object
 * 	Failure: Returns an error message based on what went wrong
 */
router.post("/", async (req, res) => {
	const { name, start, end } = req.body;
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const newPeriod = periodRepository.create({ name, start, end });
		await periodRepository.save(newPeriod);
		res.json(newPeriod);
	} catch (error) {
		logger.error("Error creating new Period:", error);
		res.json({ error: error.message });
	}
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
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const periods = await periodRepository.find({ relations: ["cultures"] });
		res.json(periods);
	} catch (error) {
		logger.error("Error fetching Periods:", error);
		res.json({ error: error.message });
	}
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
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const period = await periodRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["cultures"],
		});
		if (period) {
			res.json(period);
		} else {
			logger.warn(`Period with ID${req.params.id} was not found in database`);
			res.send("Period not found");
		}
	} catch (error) {
		logger.error("Error fetching Period:", error);
		res.json({ error: error.message });
	}
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
	const { id } = req.params;
	const { name, start, end } = req.body;
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		let periodToUpdate = await periodRepository.findOneBy({ id: parseInt(id) });
		if (periodToUpdate) {
			periodToUpdate.name = name;
			periodToUpdate.start = start;
			periodToUpdate.end = end;
			await periodRepository.save(periodToUpdate);
			res.json(periodToUpdate);
		} else {
			logger.warn(`Period with ID${id} was not found in the database`);
			res.json({ message: "Period not found" });
		}
	} catch (error) {
		logger.error("Error updating Period:", error);
		res.json({ error: error.message });
	}
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
	const id = parseInt(req.params.id);
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const deleteResult = await periodRepository.delete(id);
		if (deleteResult.affected > 0) {
			res.send();
		} else {
			logger.warn(`Period with ID${id} was not found in the database`);
			res.json({ message: "Period not found" });
		}
	} catch (error) {
		logger.error("Error deleting Period:", error);
		res.json({ error: error.message });
	}
});

module.exports = router;
