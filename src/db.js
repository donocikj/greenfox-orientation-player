"use strict";

const mysql = require(`mysql`);


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err)=> {
    if(err) {
        console.error(err);
        return;
    }
    console.log(`connected to database`);
})

module.exports= {
    connection: connection,
    queryWithErrorResponse: handleSqlWithError,
    queryPromise: sqlPromise
}


function handleSqlWithError(statement, res) {
    console.log(`handling statement ${statement}`);
    return sqlPromise(statement)
        // .then(result => result)
        .catch(error => databaseError(error, res));
}


function databaseError(error, res) {
    console.log(`databaseError has been called`);
    console.error(error);
    res.status(500).json({ error: `Error connecting to the database`});
}


function sqlPromise(statement) {
    return new Promise((resolve, reject) => {
        connection.query(statement, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
