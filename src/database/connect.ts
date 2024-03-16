// To get started using Sequelize with TypeScript, we first need to install 
// 'sequelize', 'sequelize-typescript', and then the database we will use. 
// This is the recommended way of setting up Sequelize with TypeScript.

import {Sequelize} from 'sequelize-typescript';
// First load in sequelize from the 'sequelize-typescript' third party module, which
// is a constructor function.

// We then want to make an instance of class Sequelize. And inside of it we want to
// pass in some settings. These settings define our connection to the database.
const sequelize = new Sequelize({
    database: 'RADIANT_RETREATS', // The database name
    username: process.env.MYSQL_USER, // The username for the user to your database
    password: process.env.MYSQL_USER_PASSWORD, // The password for the user to your database
    dialect: 'mysql', // What Database are you using?
    models: [__dirname + '/models'], // Where are the Models located?
    // __dirname takes us to the file we are in "connect.ts", './models' then takes us to the 
    // models folder. 
    logging: false // If you don't like the real time SQL commands to be show for each
    // transaction you can turn them off by setting "logging" to false. Although it is
    // super convienient to have it is also very annoying.
});

// We then want to run the sync method on sequelzie. This will make the updated 
// changes to our database.
const syncTables = async() => {
    await sequelize.sync();
}

syncTables();

// Export/Share the instance of class Sequelize. 
export default sequelize;

// Now all you have to do is load this file into you app.ts file. And if you get
// no errors that means you successfully connected to your database.