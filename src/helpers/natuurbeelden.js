/*******************************************************************************
DigiBird Natuurbeelden

Functions used to interact with the Beeld&Geluid video collections.
*******************************************************************************/
var winston = require('winston');
var utils = require('./utils');
var mysql = require('mysql');
var credentials = require('./mysql_credentials');

module.exports = {
  insertVideo: function () {
    var connection = mysql.createConnection({
      host: credentials.HOST,
      user: credentials.USER,
      password: credentials.PASSWORD,
      database: credentials.DATABASE
    });

    //connection.connect();

    connection.connect(function(err){
      if(!err) {
        console.log("Database connection successful!");
      } else {
        console.log("Error connecting to database!");
      }
    });
    // connection.query("SELECT * from Video", function(err, rows, fields) {
    //   if (!err) {
    //     console.log("The solution is: ", rows);
    //   } else {
    //     console.log("Error while performing Query.");
    //   });
    // connection.query('CALL insert_video(parms)',function(err,rows){
    //   if(err) throw err;
    //
    //   console.log('Data received from Db:\n');
    //   console.log(rows[0]);
    // });

    connection.end(function(err){
    // Do something after the connection is gracefully terminated.

    });
  }
};
