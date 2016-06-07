//here javascript client interaction for blog posts (page blog.hbs)

"use strict";

var titlePost = "DigiBird kickoff meeting";

// test jQuery
function getBlogPosts(){
  var title = $("<h1></h1>").text(titlePost);
  $("#posts").append(title);
}
