const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '../.env.test'),
});

const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;    

const dropDatabase = async () => {
    try {
      // connect to the database
    const db = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
    });

    // create the database if it doesn't already exist
    await db.query(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    db.end();

    } catch (err) {
    // if something goes wrong, console.log the error and the current environment variables
    console.log(
    `Your environment variables might be wrong. Please double check .env file`
    );
    console.log('Environment Variables are:', {
        DB_PASSWORD,
        DB_NAME,
        DB_USER,
        DB_HOST,
        DB_PORT,
    });
    console.log(err);
    }
};

dropDatabase();