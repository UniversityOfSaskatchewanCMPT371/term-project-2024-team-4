const { User } = require("../dist/user.entity");
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const { logger } = require("../config/logger");

const registerUser = async () => {
	const Users = await dataSource.getRepository(User);
	// hardcoded data

	// could be a GitHub secret
	const hardcodedUserName = "admin";
	const hardcodedPassword = "admin";

	const newUser = new User();
	newUser.userName = hardcodedUserName;
	newUser.password = await bcrypt.hash(hardcodedPassword, 10);
	await Users.save(newUser);
	logger.info("User successfully registered");
	return;
};

module.exports = registerUser;
