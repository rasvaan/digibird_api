/*******************************************************************************
DigiBird blog posts retrieval

This is the server backend to collect blog posts related to DigiBird.

OPTION 2: works for both wordpress self-hosted websites and for websites hosted on wordpress.com. The WordPress XML-RPC API was included in Wordpress version 3.4 and higher.

Requires WordPress 3.4 or newer and uses the WordPress XML-RPC API
(source: https://github.com/scottgonzalez/node-wordpress).

Run with the following command:
node ./src/middlewares/blog2.js
*******************************************************************************/

var wordpress = require('wordpress');
var utils = require('../helpers/blog');

var user = 'bucurcristina';

var client = wordpress.createClient({
    // both websites work!
    url: 'https://sealincmedia.wordpress.com/',
    // url: 'http://invenit.wmprojects.nl',
    username: user,
    password: 'Cristina321'
});

// client.getTaxonomies(function(error, taxonomies) {
//   utils.dumpToFile('debug2.log', "TAXONOMIES", taxonomies);
// });

// response:
// [ { name: 'category',
//     label: 'Categories',
//     hierarchical: true,
// ................................
//    },
//   { name: 'post_tag',
//     label: 'Tags',
//     hierarchical: false,
//     public: true,
//     showUi: true,
//     labels:
//      { name: 'Tags',
//        singularName: 'Tag',
//        searchItems: 'Search Tags',
//        popularItems: 'Popular Tags',
//        allItems: 'All Tags',
//        parentItem: '',
//        parentItemColon: '',
//        editItem: 'Edit Tag',
//        viewItem: 'View Tag',
//        updateItem: 'Update Tag',
//        addNewItem: 'Add New Tag',
//        newItemName: 'New Tag Name',
//        separateItemsWithCommas: 'Separate tags with commas',
//        addOrRemoveItems: 'Add or remove tags',
//        chooseFromMostUsed: 'Choose from the most used tags',
//        menuName: 'Tags',
//        nameAdminBar: 'post_tag' },
//     cap:
//      { manageTerms: 'manage_categories',
//        editTerms: 'manage_categories',
//        deleteTerms: 'manage_categories',
//        assignTerms: 'edit_posts' },
//     objectType: [ 'post' ] },
//   { name: 'post_format',
//     label: 'Format',
//     hierarchical: false,
// ........................................
//     },
//   { name: 'mentions',
//     label: 'Mentions',
//     hierarchical: false,
// ........................................
//     } ]

// client.getTaxonomy('post_tag',
// function(error, taxonomy) {
//   utils.dumpToFile('debug2.log', "TAXONOMY", taxonomy);
// });

//response:
// { name: 'post_tag',
//   label: 'Tags',
//   hierarchical: false,
//   public: true,
//   showUi: true,
//   labels:
//    { name: 'Tags',
//      singularName: 'Tag',
//    .........................
//      menuName: 'Tags',
//      nameAdminBar: 'post_tag' },
//   cap:
//    { manageTerms: 'manage_categories',
//     ............................
//      assignTerms: 'edit_posts' },
//   objectType: [ 'post' ] }

// client.getTerms('post_tag',
// function(error, terms) {
//   utils.dumpToFile('debug2.log', "TERMS", terms);
// });

// response:
// { termId: '261731335',
//   name: 'DigiBird',
//   slug: 'digibird',
//   termTaxonomyId: '38',
//   taxonomy: 'post_tag',
//   description: '',
//   parent: '0',
//   count: 1 },

client.getPosts({
//   // a hash of key/value pairs for filtering which posts to get
//   //  title: 'DigiBird kickoff meeting'
  termNames: {'post_tag': 'DigiBird'}
  // an array of fields to return
  //['title']
  }, [],
  function(error, posts) {
    //console.log("Found " + posts.length + " posts!");
    // utils.writeOutputToFile('debug2.log', "POSTS", posts);
    utils.dumpToFile('debug2.log', "POSTS", posts);
    // error handling
});
