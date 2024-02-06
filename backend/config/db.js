require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // or console.log to see it all, probably have something to handle this
    retry: {
      max: 10, // Maximum number of tries
      backoffBase: 3000,
      backoffExponent: 1.5,
      match: [
        /the database system is starting up/,
        Sequelize.ConnectionError,
        Sequelize.ConnectionRefusedError,
        Sequelize.ConnectionTimedOutError,
      ],
    },
  }
);

// Check connection between the database and server
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit with a failure code
  });

module.exports = { sequelize };
