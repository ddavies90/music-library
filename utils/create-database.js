const mysql = require('mysql2/promise');

// require path to handle file paths
const path = require('path');

// extract any command line arguments from argv
const args = process.argv.slice(2)[0];

// use args to determine if .env or .env.test should be loaded
const envFile = args === 'test' ? '../.env.test' : '../.env';

// load environment variables from env files
const {CLEARDB_DATABASE_URL} = process.env;
if (!CLEARDB_DATABASE_URL) {
    require('dotenv').config({
    path: path.join(__dirname, envFile),
});
}

// destructure environment variables from process.env
const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

// This async function will run before the app
const setUpDatabase = async () => {
    try {
        //connect to the database
        const db = CLEARDB_DATABASE_URL ?
        await mysql.createConnection(CLEARDB_DATABASE_URL) :
        await mysql.createConnection({ 
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
        });
        // create database if doesn't already exist
        !CLEARDB_DATABASE_URL && await db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        !CLEARDB_DATABASE_URL && await db.query(`USE ${DB_NAME}`);
        await db.query(`CREATE TABLE IF NOT EXISTS Artists (
            id INT PRIMARY KEY auto_increment,
            name VARCHAR(40),
            genre VARCHAR(40)
            )`);
        await db.query(`CREATE TABLE IF NOT EXISTS Albums (
            id INT PRIMARY KEY auto_increment,
            name VARCHAR(40),
            year INT(4),
            artistId INT,
            CONSTRAINT fk_artist FOREIGN KEY (artistId) 
                REFERENCES Artists(id)
            )`)
        db.close();
    } catch (err) {
        // if something goes wrong, console.log the error and environment variables
        console.log('Your environment variables may be wrong. Please double check the .env file');
        console.log('Your environment variables are:', {
            DB_NAME,
            DB_PORT,
            DB_HOST,
            DB_USER,
            DB_PASSWORD
        });
        console.log(err);
    }
};

setUpDatabase();