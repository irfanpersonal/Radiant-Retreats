const Sequelize = require('sequelize');

const sequelize = new Sequelize('RADIANT_RETREATS', 'root', process.env.MYSQL_DATABASE_PASSWORD, {
    dialect: 'mysql',
    pool: {
        idle: Infinity
    }
});

const connectDB = () => {
    return sequelize.authenticate();
}

module.exports = {connectDB, sequelize};