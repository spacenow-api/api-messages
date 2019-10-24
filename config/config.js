module.exports = {
  development: {
    dialect: 'mysql',
    database: process.env.DATABASE_SCHEMA,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: process.env.DEBUG ? console.debug : false,
    underscored: true,
    freezeTableName: true
  }
}
