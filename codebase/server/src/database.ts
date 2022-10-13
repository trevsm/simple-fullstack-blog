import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'

import { initModels, user, post } from '../models/init-models'

dotenv.config()

if (
  !process.env.MYSQL_DATABASE ||
  !process.env.MYSQL_USER ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_HOST ||
  !process.env.MYSQL_PORT
)
  throw new Error('Missing environment variables')

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT as string),
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
)

initModels(sequelize)

const db = {
  user,
  post,
}

export default db
