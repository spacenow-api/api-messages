module.exports = {
  development: {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_SCHEMA,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: process.env.DEBUG ? console.debug : false
  }
}
