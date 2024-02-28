const { DataTypes } = require("sequelize");
const { sequelize } = require("./config/db");

const User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM,
		values: ["basic", "admin"],
		allowNull: false,
		defaultValue: "basic",
	},
});

// Catalogue Model
const Catalogue = sequelize.define("Catalogue", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

// Site Model
const Site = sequelize.define("Site", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	location: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	region: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

// ArtifactType Model
const ArtifactType = sequelize.define("ArtifactType", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	fieldsDefinition: {
		type: DataTypes.JSON,
		allowNull: false,
	},
});

// Artifact Model
const Artifact = sequelize.define("Artifact", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	customAttributes: {
		type: DataTypes.JSON,
		defaultValue: {},
	},
});

// Relationships
// need to specificy foreign key cause we used 'as' and sequilize duplicates naming when we do
Catalogue.hasMany(Site, { as: "sites", foreignKey: "catalogueId" });
Site.belongsTo(Catalogue, { as: "catalogue", foreignKey: "catalogueId" });

Site.hasMany(Artifact, { as: "artifacts", foreignKey: "siteId" });
Artifact.belongsTo(Site, { as: "site", foreignKey: "siteId" });

ArtifactType.hasMany(Artifact, {
	as: "artifacts",
	foreignKey: "artifactTypeId",
});
Artifact.belongsTo(ArtifactType, {
	as: "artifactType",
	foreignKey: "artifactTypeId",
});

const synchModels = async () => {
	try {
		await sequelize.sync({ force: true }); // Use force: true only for development
		console.log("All models were synchronized successfully.");
	} catch (error) {
		console.error("Failed to synchronize models:", error);
		throw error; // Rethrow the error to handle it in app.js
	}
};

module.exports = {
	User,
	Catalogue,
	Site,
	ArtifactType,
	Artifact,
	synchModels,
};
