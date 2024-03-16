# Radiant Retreats (SERN)

Radiant Retreats is a useful booking app made with the SERN stack. I've used Sequelize Associations to organize data, similar to how it's done with Mongoose. This might change how the app works a bit, but it helps keep things organized. I've also added Stripe for payments, so reservations are double-checked before you buy them. This makes sure the prices are right, even if someone tries to mess with them on the website. The app has features like searching and paging through listings. You can search for listings by country or budget, which makes it easier to find what you're looking for. There are three types of users: admin, host, and guest. The first person to sign up becomes the admin. Admins can approve hosts and manage their requests. Hosts can create listings and see how much they've earned. Guests can book reservations and see which dates are available using a calendar. They can also leave reviews and see ratings for each listing. When hosts want to get their earnings, they can request a payout. The admin reviews these requests and pays them out if everything looks good. The application also have a very beautiful interface so you will enjoy using it.

## Technologies Used

- [Sequelize](https://sequelize.org/): A powerful and flexible Node.js ORM for SQL databases.
- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Node.js](https://nodejs.org/): JavaScript runtime built on Chrome's V8 JavaScript engine.
- [MySQL](https://www.mysql.com/): An open-source relational database management system.

## Setup Instructions

1st - Download the project

2nd - Run the following command "npm install" (install dependencies)

3rd - Change directory into the src/client folder and run "npm install".

4th - Create a .env file in the root of the src/client folder and add the following key value pair: REACT_APP_STRIPE_PUBLISHABLE_KEY

5th - Run "npm run build" in the src/client folder to create a production ready application.

6th - Now create a .env file in the root of your entire project with the following key value pairs: MYSQL_USER, MYSQL_USER_PASSWORD, JWT_SECRET, JWT_LIFETIME, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, and STRIPE_SECRET_KEY

Note: The cloud values must be from Cloudinary, which is where we host our images.

7th - Open up your MySQL server and create a database called RADIANT_RETREATS. So just copy paste this code in and execute it

CREATE DATABASE RADIANT_RETREATS;

8th - Type the following command "npm run start" to start application

DONE