const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   port: dbConfig.DBPORT,
//   ssl: true,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   },
//   dialectOptions: {
//         "ssl": {
//             require: true,
//         }
//     },
// });

const sequelize = new Sequelize({
    username: dbConfig.USER,
    database: dbConfig.DB,
    password: dbConfig.PASSWORD,
    host: dbConfig.HOST,
    port: dbConfig.DBPORT,
    ssl: true,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
     },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.invites = require("./invites.model.js")(sequelize, Sequelize);
db.records = require("./records.model.js")(sequelize, Sequelize);

module.exports = db;
