const { User } = require("../dist/user.entity");
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const { logger } = require("../config/logger");

/**
 * Registers a new user with the given username and password
 * @param {*} username - username of the new user
 * @param {*} password - password of the new user
 * @precond
 * 	- Username is unique
 * @postcond registers a new user with username and password
 */
const registerUser = async (username, password) => {
	const Users = await dataSource.getRepository(User);

	// first check if username is unique
	const userExists = await Users.findOneBy({ userName: username });
	if (userExists) {
		logger.warn(`Trying to register user: ${username} already exists.`);
		return;
	}

	// hash password and create new user
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User();
	newUser.userName = username;
	newUser.password = hashedPassword;

	// save user to database
	await Users.save(newUser);
	logger.info(`User ${username} succesfully registered`);
	return;
};

/**
 * Delete a user given a unique username
 * @param {*} username - username of an existing user
 * @precond
 * 	- username exists in the database already
 * @postcond
 * 	- user with given username is deleted from database
 * @returns
 * 	- false: if no user is deleted
 * 	- true: if user is succesfully deleteeed
 */
const deleteUserByUsername = async (username) => {
	const Users = await dataSource.getRepository(User);

	// Attempt to find user by username
	const user = await Users.findOneBy({ userName: username });
	if (!user) {
		logger.warn(`User ${username} not found for deletion.`);
		return false;
	} else {
		await Users.remove(user);
		logger.info(`User ${username} succesfully deleted`);
		return true;
	}
};

module.exports = { registerUser, deleteUserByUsername };
