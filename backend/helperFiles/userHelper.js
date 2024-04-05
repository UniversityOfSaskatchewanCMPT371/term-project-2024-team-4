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

	// check there is only one default user in database
	if (isDefaultUser) {
		const existingDefaultUser = await Users.findOne({
			where: { isDefaultUser: true },
		});
		if (existingDefaultUser) {
			logger.warn("Error registering user: Default user already exists");
			return;
		}
	}

	// check if username exists in database already (unique)
	const userExists = await Users.findOneBy({ userName: username });
	if (userExists) {
		logger.warn(`Trying to register user: ${username} already exists`);
		return;
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

/**
 * Update existing password to new password
 * Note: Verify password before this (in route)
 * @param {*} userId the user for which to update the password
 * @param {*} newPassword the password for which to replace the old password
 * @preconds
 * 	- the user Id is a user that exists in the database
 * @returns {boolean}
 * 	- false: if password was not succesfully changed
 * 	- true: if password was succesfully changed
 */
const updatePassword = async (userId, newPassword) => {
	const Users = await dataSource.getRepository(User);

	try {
		const user = await Users.findOneBy({ id: userId });
		if (!user) {
			logger.error(`User with ID ${userId} does not exist.`);
			return false;
		}

		// hash new password and save
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await Users.save(user);
		logger.info(`Password updated for user ID ${userId}`);
		return true;
	} catch (error) {
		logger.error(`Error updating password for user ${userId}`);
		return false;
	}
};

/**
 * Update existing password to new password
 * Note: Verify password before this (in route)
 * @param {*} userId the user for which to update the username
 * @param {*} newUsername the new username for which to replace the old one
 * @precond
 * 	- the user ID is a user that exists in the database
 * @returns
 * 	- false: if username was not succesfully changed
 * 	- true: if username was successfully changed
 */
const updateUsername = async (userId, newUsername) => {
	const Users = await dataSource.getRepository(User);

	try {
		const user = await Users.findOneBy({ id: userId });
		if (!user) {
			logger.error(`User with ID ${userId} does not exist`);
			return false;
		}

		// otherwise, replace username
		user.userName = newUsername;
		await Users.save(user);
		logger.info(`Username updated for user ID ${userId} to ${newUsername}`);
		return true;
	} catch (error) {
		logger.error(`Error updating username for user ID ${userId}`);
		return false;
	}
};

/**
 * Resets the credentials of the user tagged `isDefaultUser`
 * Credentials specified in .ENV File
 * @precond
 * 	- There exists a user flagged as isDefaultUser in the database
 * 	- The ENV File contains two variables: DEFAULT_USERNAME, DEFAULT_PASSWORD
 * @postcond
 * 	- Default user's credentials are reset to the values specified in the database
 * @returns {boolean}
 * 	- false: if the reset could not be carried out
 * 	- true: if default user's credentials were succesfully reset
 */
const resetDefaultUserCredentials = async () => {
	// first, find the user
	const Users = await dataSource.getRepository(User);
	const defaultUser = await Users.findOne({
		where: { isDefaultUser: true },
	});

	if (!defaultUser) {
		logger.error(
			"Trying to reset default credentials: Default user was not found in the database",
		);
		return false;
	}

	// retrieve default credentials from .ENV
	const defaultUsername = process.env.DEFAULT_USERNAME;
	const defaultPassword = process.env.DEFAULT_PASSWORD;
	if (!defaultUsername || !defaultPassword) {
		logger.error(
			"Trying to reset default credentials: Default credentials are not set in .env file.",
		);
		return false;
	}

	// otherwise, carry on with the reset
	const hashedPassword = await bcrypt.hash(defaultPassword, 10);

	// update with new credentials
	defaultUser.userName = defaultUsername;
	defaultUser.password = hashedPassword;

	try {
		await Users.save(defaultUser);
		logger.info(`Default user credentials reset to ${defaultUsername}`);
		return true;
	} catch (error) {
		logger.error("Failed to reset default user credentials.", error);
		return false;
	}
};

module.exports = {
	registerUser,
	deleteUserByUsername,
	deleteUserById,
	verifyPassword,
	updatePassword,
	updateUsername,
	resetDefaultUserCredentials,
};
