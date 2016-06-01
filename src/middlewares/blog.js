//here server backend to collect blog posts

//run with the following command:
//node ./src/middlewares/blog.js

var fs = require('fs');
var util = require('util');
var path = require('path');
var WP = require('wordpress-rest-api');

var logFile = fs.createWriteStream(path.resolve(__dirname, '..', 'debug.log'),
                {flags: 'w'});
var wp = new WP({
  //endpoint: 'https://sealincmedia.wordpress.com/wp-json',
  endpoint: 'http://invenit.wmprojects.nl/wp-json',
  username: 'replaceWithUsername',
  password: 'replaceWithPassword'
});

var date = new Date();
var harvestDate = date.getFullYear() + '-' + date.getMonth() + '-' +
                    date.getDate() + ' ' + date.getHours() + ':' +
                    date.getMinutes() + ':' + date.getSeconds();

//get info about users
wp.users().then(function(users) {
  // do something with the returned users
  console.log('users in!');
  logFile.write('-------------------------\n');
  logFile.write(' USERS, ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(util.format(users));
  logFile.write('\n-------------------------\n');
}).catch(function(err) {
  // handle error
  console.log('Error retrieving users! Check log file for more info.');
  logFile.write('-------------------------\n');
  logFile.write(' ERROR: users, ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(err);
  logFile.write('\n-------------------------\n');
});

//retrieve blog posts
wp.posts().then(function(posts) {
  // do something with all the returned posts
  console.log('posts in!');
  logFile.write('-------------------------\n');
  logFile.write(' POSTS, ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(util.format(posts));
  logFile.write('\n-------------------------\n');
}).catch(function(err) {
  // handle error
  console.log('Error retrieving posts! Check log file for more info');
  logFile.write('-------------------------\n');
  logFile.write(' ERROR: posts, ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(err);
  logFile.write('\n-------------------------\n');
});

//retrieve filtered blog posts: by user, by tag, etc.
var user = 'cristina';

wp.posts().filter({
  author_name: user
}).then(function(posts) {
  // do something with the returned filtered posts
  console.log('filtered posts in!');
  logFile.write('-------------------------\n');
  logFile.write('FILTERED POSTS BY USER ' +
    user + ' ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(util.format(posts));
  logFile.write('\n-------------------------\n');
}).catch(function(err) {
  // handle error
  console.log('Error retrieving posts! Check log file for more info');
  logFile.write('-------------------------\n');
  logFile.write(' ERROR: filtered posts, ' + harvestDate + '\n');
  logFile.write('-------------------------\n');
  logFile.write(err);
  logFile.write('\n-------------------------\n');
});


//helper code -> delete last!
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
