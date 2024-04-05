const { Period } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 * GET: Fetch ALL Periods
 * @param {*} req - an object containing items: name, start, end
 * @precond Database is accessible
 * @postcond
 * 	Success: Returns all periods from the database
 * 	Failure: Returns an error message based on what went wrong
 */
async function newPeriod(req) {
	const { name, start, end } = req.body;
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const newPeriod = periodRepository.create({ name, start, end });
		await periodRepository.save(newPeriod);
		// res.json(newPeriod);
		return newPeriod;
	} catch (error) {
		console.error("Error creating new Period:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * GET: Fetch ALL Periods
 * @precond Database is accessible
 * @postcond
 * 	Success: Returns all periods from the database
 * 	Failure: Returns an error message based on what went wrong
 */
async function getAllPeriods() {
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const periods = await periodRepository.find({
			relations: [
				"cultures",
				"cultures.bladeShapes",
				"cultures.baseShapes",
				"cultures.haftingShapes",
				"cultures.crossSections",
				"cultures.materials",
			],
		});
		// res.json(periods);
		return periods;
	} catch (error) {
		console.error("Error fetching Periods:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * GET: Fetch a SINGLE period given the ID
 * @param {*} req - req URL parameter contains the period ID
 * @precond req URL parameter contains a valid period ID that exists in the database
 * @postcond
 * 	Succesful: Returns the SINGLE requested period object
 * 	Failure: returns  an error messaged based on issue
 */
async function getPeriodById(req) {
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const period = await periodRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: [
				"cultures",
				"cultures.bladeShapes",
				"cultures.baseShapes",
				"cultures.haftingShapes",
				"cultures.crossSections",
				"cultures.materials",
			],
		});
		if (period) {
			// res.json(period);
			return period;
		} else {
			return "Period not found";
			// res.send("Period not found");
		}
	} catch (error) {
		console.error("Error fetching Period:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * PUT: Update a SINGLE existing period
 * @param {*} req - req URL paramter contains the period ID, req.body contains valid: name, start, end
 * @precond req URL parameter contains existing period ID; req.body contains valid: name, start, end
 * @postcond
 * 	Success: Returns the updated Period object
 * 	Failure: Returns an error message based on the issue
 */
async function updatePeriod(req) {
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
			// res.json(periodToUpdate);
			return periodToUpdate;
		} else {
			// res.json({ message: "Period not found" });
			return "Period not found";
		}
	} catch (error) {
		console.error("Error updating Period:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 * DELETE: delete a SINGLE existing period given an ID
 * @param {*} req - req URL parameter contains id
 * @precond period ID from req URL parameter exists in the database
 * @postcond
 * 	Succesful: Period is deleted from database; empty response sent
 * 	Failure: Returns an error message based on the issue
 */
async function deletePeriod(req) {
	const id = parseInt(req.params.id);
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const deleteResult = await periodRepository.delete(id);
		if (deleteResult.affected > 0) {
			// res.send();
			return;
		} else {
			return "Period not found";
			// res.json({ message: "Period not found" });
		}
	} catch (error) {
		console.error("Error deleting Period:", error);
		return error;
		// res.json({ error: error.message });
	}
}

module.exports = {
	newPeriod,
	getAllPeriods,
	getPeriodById,
	updatePeriod,
	deletePeriod,
};
