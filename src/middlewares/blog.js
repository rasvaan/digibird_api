//here server backend to collect blog posts

//run with the following command:
//node ./src/middlewares/blog.js

var fs = require('fs');
var util = require('util');
var path = require('path');
var WP = require('wordpress-rest-api');

var date = new Date();
var logFile = fs.createWriteStream(path.resolve(__dirname, '..', 'debug.log'),
                {flags: 'w'});
var wp = new WP({ endpoint: 'https://sealincmedia.wordpress.com/' });

console.log("wp:\n", wp);
console.log('--------------------\n');

var users = wp.users().then(function(data) {
  console.log('users in!');
  console.log = function(data) {
    logFile.write('--------------------\n');
    logFile.write('USERS, ', date.getFullYear(), '-',
      date.getMonth(), '-', date.getDate(), ' ', date.getHours(), ':',
      date.getMinutes(), ':', date.getSeconds(),'\n');
    logFile.write('--------------------\n');
    logFile.write(util.format(data) + '\n');
    logFile.write('--------------------\n');
  }
}).catch(function(err) {
    //handle error
    console.log('error!!!');
    console.log = function(err) {
      logFile.write('--------------------\n');
      logFile.write('ERROR, ', date.getFullYear(), '-',
        date.getMonth(), '-', date.getDate(), ' ', date.getHours(), ':',
        date.getMinutes(), ':', date.getSeconds(),'\n');
      logFile.write('--------------------\n');
      logFile.write('err \n');
      logFile.write('--------------------\n');
    }
  });

  // //VERSION 1: with callbacks
  // wp.posts()
  //   .author('bucurcristina')
  //   .tag('digibird')
  //   .get(function(err, data) {
  //       if (err){
  //         //handle error
  //       }
  //       //do something with returned posts
  //   });
  //
  // //VERSION 2: with promises
  // wp.posts().filter({
  //     author_name: 'bucurcristina',
  //     tag: 'digibird'
  // }).then(function(data) {
  //     //do something with returned posts
  //   }).catch(function(err) {
  //     //handle error
  //   });
