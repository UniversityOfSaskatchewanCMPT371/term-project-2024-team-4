require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
      host: process.env.DB_HOST,
      dialect: "postgres",
      logging: false, // or console.log to see it all, probably have something to handle this
  }
);

  module.exports = { sequelize};
