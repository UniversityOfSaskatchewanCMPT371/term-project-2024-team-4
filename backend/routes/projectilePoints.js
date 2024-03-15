const express = require("express");
const router = express.Router();
const projectilePointsHelper = require("../helperFiles/projectilePointsHelper.js");

// POST: Create a new ProjectilePoint
// This endpoint handles the creation of a new ProjectilePoint.
// It extracts various properties from the request body, including related entities like Culture and BladeShape.
// Each related entity is fetched from the database to ensure it exists before associating it with the new ProjectilePoint.
router.post("/", async (req, res) => {
	const newProjectilePoint =
		await projectilePointsHelper.newProjectilePoint(req);
	if (newProjectilePoint instanceof Error) {
		res.status(500).json({ error: newProjectilePoint.message });
	}
	res.status(201).json(newProjectilePoint);
});

router.get("/", async (req, res) => {
	const projectilePoints =
		await projectilePointsHelper.getAllProjectilePoints();
	if (projectilePoints instanceof Error) {
		res.json({ error: projectilePoints.message });
	}
	res.json(projectilePoints);
});

router.get("/:id", async (req, res) => {
	const projectilePoint =
		await projectilePointsHelper.getProjectilePointFromId(req);
	if (projectilePoint === "ProjectilePoint not found") {
		return res.json({ message: "ProjectilePoint not found" });
	}
	if (projectilePoint instanceof Error) {
		res.json({ error: projectilePoint.message });
	}
	res.json(projectilePoint);
});

// PUT: Update a ProjectilePoint
router.put("/:id", async (req, res) => {
	const projectilePoint =
		await projectilePointsHelper.updateProjectilePoint(req);
	if (projectilePoint === "ProjectilePoint not found") {
		return res.json({ message: "ProjectilePoint not found" });
	}
	if (projectilePoint instanceof Error) {
		res.json({ error: projectilePoint.message });
	}
	res.json(projectilePoint);
});

router.delete("/:id", async (req, res) => {
	const result = await projectilePointsHelper.deleteProjectilePoint(req);
	if (result === "ProjectilePoint not found") {
		res.json({ message: "ProjectilePoint not found" });
	}
	if (result instanceof Error) {
		res.json({ error: result.message });
	}
});

module.exports = router;
