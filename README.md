# Radiant Retreats (SERN)

Radiant Retreats is an awesome booking app created using the SERN stack. I've utilized Sequelize Associations to create the "ref, populate" effect from Mongoose and made sure to document every step of the process. This changed the usual model structure a bit. I also integrated Stripe into the application and ensured the reservation is verified before purchase. So, even if someone messes with the price in the front end, it will show the corrected price. All of this makes the payment process super secure and ready to go. I also added proper pagination and search functionality for the listings. This is perfect for finding a specific listing, filtering by country, and meeting your budget. Unlike previous projects, this one has a new way to move between pages that doesn't rely on complicated useEffects. Now, changing the page is done directly through extraReducers, making the need for tricky navigation tricks a thing of the past.

## Technologies Used

- [Sequelize](https://sequelize.org/): A powerful and flexible Node.js ORM for SQL databases.
- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Node.js](https://nodejs.org/): JavaScript runtime built on Chrome's V8 JavaScript engine.
- [MySQL](https://www.mysql.com/): An open-source relational database management system.

## Setup Instructions

1st - Download the project

2nd - Run the following command "npm install" (install dependencies)

3rd - Create a .env file in root with the following key value pairs: MYSQL_DATABASE_PASSWORD, JWT_SECRET, JWT_LIFETIME, and STRIPE_SECRET_KEY. 

4th - Open up your MySQL server and create a database called RADIANT_RETREATS. So just copy paste this code in an execute it

CREATE DATABASE RADIANT_RETREATS;

5th - Go to the index.js file of the client folder and update the public stripe key with yours. Restart the build process. 

6th - Type the following command "npm run start" to start application

DONE