import { Sequelize } from "sequelize"

import * as dotenv from "dotenv"
dotenv.config()

import { initModels, User, VerificationCode } from "./generated/init-models"

if (
  !process.env.MYSQL_DATABASE ||
  !process.env.MYSQL_USER ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_HOST ||
  !process.env.MYSQL_PORT
)
  throw new Error("Missing environment variables")

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

initModels(sequelize)

const db = {
  User,
  VerificationCode,
}

export default db
