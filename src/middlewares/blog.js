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
var wp = new WP({
  //endpoint: 'https://sealincmedia.wordpress.com/wp-json',
  endpoint: 'http://invenit.wmprojects.nl/wp-json',
  username: 'replaceWithUsername',
  password: 'replaceWithPassword'
});

console.log("wp:\n", wp);
console.log('--------------------\n');

// console.log('me start');
// var me = wp.users().me();
// console.log(me);
// console.log('me end');
//
// console.log('users start');
// var users = wp.users();
// console.log(users);
// console.log('users end');
//
// console.log('posts start');
// var posts = wp.posts().author('cristina').get();
// console.log(posts);
// console.log('posts end');

// wp.posts()
//   .get(function(err, data) {
//       if (err){
//         //handle error
//         console.log('UPS...');
//         console.log(err);
//       }
//       //do something with returned posts
//       console.log('uraaa!!!');
//   });

//VERSION 2: with promises
wp.posts().then(function(data) {
  //do something with returned posts
  console.log('uraaa!!!');
}).catch(function(err) {
  //handle error
  console.log('UPS...');
  console.log(err);
});

// var users = wp.users().then(function(data) {
//   console.log('users in!');
//   logFile.write('-------------------------\n');
//   logFile.write(' USERS, ' + date.getFullYear() + '-' +
//     date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' +
//     date.getMinutes() + ':' + date.getSeconds() + '\n');
//   logFile.write('-------------------------\n');
//   logFile.write(util.format(data));
//   logFile.write('\n-------------------------\n');
// }).catch(function(err) {
//   //handle error
//   console.log('error!!!');
//   logFile.write('-------------------------\n');
//   logFile.write(' ERROR, ' + date.getFullYear() + '-' +
//     date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' +
//     date.getMinutes() + ':' + date.getSeconds() + '\n');
//   logFile.write('-------------------------\n');
//   //logFile.write(err);
//   logFile.write('\n-------------------------\n');
// });

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
