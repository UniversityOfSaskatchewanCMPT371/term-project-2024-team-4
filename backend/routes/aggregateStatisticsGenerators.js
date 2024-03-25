const express = require("express");
const router = express.Router();
const aggregateStatisticsConstroller = require("../controllers/aggregateStatisticsController.js");

//GET: Point Type Aggregate Statistics
router.get("/pointType/:id", async (req, res) => {
	const aggregatePointTypeStatistics =
		await aggregateStatisticsConstroller.aggregatePointTypeStatistics(req);
	if (aggregatePointTypeStatistics === "ArtifactType not found") {
		return res.json({ message: "ArtifactType not found" });
	}
	if (aggregatePointTypeStatistics instanceof Error) {
		return res.json({ error: aggregatePointTypeStatistics.message });
	}
	if (aggregatePointTypeStatistics === null) {
		return res.json({
			message: "aggregatePointTypeStatistics() Got Empty Input",
		});
	}
	return res.json(aggregatePointTypeStatistics);
});

//GET: Site Aggregate Statistics
router.get("/site/:id", async (req, res) => {
	const aggregateSiteStatistics =
		await aggregateStatisticsConstroller.aggregateSiteStatistics(req);
	if (aggregateSiteStatistics === "Site not found") {
		return res.json({ message: "Site not found" });
	}
	if (aggregateSiteStatistics instanceof Error) {
		return res.json({ error: aggregateSiteStatistics.message });
	}
	if (aggregateSiteStatistics === null) {
		return res.json({ message: "aggregateSiteStatistics() Got Empty Input" });
	}
	return res.json(aggregateSiteStatistics);
});

//GET: Catalogue Aggregate Statistics
router.get("/catalogue/:id", async (req, res) => {
	const aggregateCatalogueStatistics =
		await aggregateStatisticsConstroller.aggregateCatalogueStatistics(
			parseInt(req.params.id),
		);
	if (aggregateCatalogueStatistics === "Catalogue not found") {
		return res.json({ message: "Catalogue not found" });
	}
	if (aggregateCatalogueStatistics instanceof Error) {
		return res.json({ error: aggregateCatalogueStatistics.message });
	}
	if (aggregateCatalogueStatistics === null) {
		return res.json({
			message: "aggregateCatalogueStatistics() Got Empty Input",
		});
	}
	const resultMapToObject = deepMapToObject(aggregateCatalogueStatistics);

	return res.json(resultMapToObject);
	// return res.json(aggregateCatalogueStatistics);
});

//Helper function for deep map conversion for statistics
function deepMapToObject(map) {
	const out = {};
	map.forEach((value, key) => {
		out[key] = value instanceof Map ? deepMapToObject(value) : value;
	});
	return out;
}

module.exports = router;
