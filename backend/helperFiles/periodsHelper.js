const { Period } = require("../dist/entity");
const myDatabase = require("../config/db");

/**
 *
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
 *
 */
async function getAllPeriods() {
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const periods = await periodRepository.find({ relations: ["cultures"] });
		// res.json(periods);
		return periods;
	} catch (error) {
		console.error("Error fetching Periods:", error);
		return error;
		// res.json({ error: error.message });
	}
}

/**
 *
 */
async function getPeriodById(req) {
	try {
		const periodRepository = await myDatabase.getRepository(Period);
		const period = await periodRepository.findOne({
			where: { id: parseInt(req.params.id) },
			relations: ["cultures"],
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
 *
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
 *
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
