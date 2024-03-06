require("dotenv").config();
const { DataSource } = require("typeorm");
const { User } = require("../dist/user.entity");
const {
	Catalogue,
	Site,
	Region,
	Period,
	Culture,
	BladeShape,
	BaseShape,
	HaftingShape,
	CrossSection,
	Artifact,
	Material,
	ArtifactType,
	ProjectilePoint,
} = require("../dist/entity");

const dataSource = new DataSource({
	type: process.env.DB_DIALECT,
	host: process.env.DB_HOST,
	port: 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: true,
	entities: [
		User,
		Catalogue,
		Site,
		Region,
		Period,
		Culture,
		BladeShape,
		BaseShape,
		HaftingShape,
		CrossSection,
		Artifact,
		Material,
		ArtifactType,
		ProjectilePoint,
	],
});

//dataSource.initialize().then(() => console.log("connected to DB succesfully!"));

module.exports = dataSource;
