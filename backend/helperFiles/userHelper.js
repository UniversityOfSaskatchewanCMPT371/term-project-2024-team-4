const { User } = require("../dist/user.entity");
const dataSource = require("../config/db");
const bcrypt = require("bcrypt");
const { logger } = require("../config/logger");

/**
 * Registers a new user with the given username, password, and flags (role, isDefaultUser)
 * Additionally, ensures only ONE default user exists
 * @param {*} username - username of the new user
 * @param {*} password - password of the new user
 * @param {*} role - admin or tester (default: admin)
 * @param {boolean} isDefaultUser - trying to register as default user? (default: false), setting to true will block registration
 * @precond
 * 	- Username is unique
 * @postcond registers a new user with username,password, and flags (role, isDefaultUser)
 */
const registerUser = async (
	username,
	password,
	role = "admin",
	isDefaultUser = true,
) => {
	const Users = await dataSource.getRepository(User);

	// first check if username exists in database already (unique)
	const userExists = await Users.findOneBy({ userName: username });
	if (userExists) {
		logger.warn(`Trying to register user: ${username} already exists`);
		return;
	}

	// next, check there is only one default user in database
	if (isDefaultUser) {
		const existingDefaultUser = await Users.findOne({
			where: { isDefaultUser: true },
		});
		if (existingDefaultUser) {
			logger.warn("Error registering user: Default user already exists");
			return;
		}
	}

	// Otherwise, create a new user
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User();
	newUser.userName = username;
	newUser.password = hashedPassword;
	newUser.role = role;
	newUser.isDefaultUser = isDefaultUser;
	newUser.isActive = true; // by default, user accounts are active

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
 * @returns {boolean}
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

/**
 * Delete a user with a given user (database) ID
 * @param {*} userId  - the ID of the user to delete
 * @returns {boolean}
 * 	- false: if no user is deleted
 * 	- true: if user is succesfully deleted
 */
// eslint-disable-next-line no-unused-vars
const deleteUserById = async (userId) => {
	const Users = await dataSource.getRepository(User);

	try {
		const userToDelete = await Users.findOneBy({ id: userId });

		// if user doesn't exist, abort
		if (!userToDelete) {
			logger.warn(`User with ID ${userId} not found.`);
			return false;
		}

		// otherwise, delete
		await Users.remove(userToDelete);
		logger.info(`User with ID ${userId} was deleted`);
		return true;
	} catch (error) {
		logger.error(`Error deleting user with ID ${userId}`);
		return false;
	}
};

/**
 * Checks if the given password matches the (encrypted) one in the database
 * @param {*} userId - the user ID for which to check the password
 * @param {*} password - the password to compare with the one in the database
 * @precond
 * 	- Given user ID is a user that exists in the database
 * @returns {boolean}
 * 	- false: if password does not match
 * 	- true: if password does match
 */
const verifyPassword = async (userId, password) => {
	const Users = await dataSource.getRepository(User);
	const user = await Users.findOneBy({ id: userId });

	// if user does not exist, return false
	if (!user) {
		logger.error(`User with ID ${userId} does not exist`);
		return false;
	}

	// otherwise, compare if passwords are matching
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		logger.warn(`Password verification failed for user ID ${userId}`);
		return false;
	} else {
		// if matching
		logger.info(`Password verified for user ID ${userId}`);
		return true;
	}
};

module.exports = { registerUser, deleteUserByUsername };