// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var React = require("react");
var Pages$ReasonBlog = require("./modules/Pages.bs.js");
var Server = require("react-dom/server");
var Template__BlogPost$ReasonBlog = require("./templates/Template__BlogPost.bs.js");
var Template__BlogIndex$ReasonBlog = require("./templates/Template__BlogIndex.bs.js");

var postsDir = "./content/posts";

var blogDir = "./docs";

function renderBlogIndex(blogPosts) {
  var el = React.createElement(Template__BlogIndex$ReasonBlog.make, {
        blogTitle: "ReScript Blog",
        blogPosts: blogPosts
      });
  var html = Server.renderToString(el);
  return "<!DOCTYPE HTML>" + html;
}

function renderBlogPost(blogPost) {
  var el = React.createElement(Template__BlogPost$ReasonBlog.make, {
        blogPost: blogPost
      });
  var html = Server.renderToString(el);
  return "<!DOCTYPE HTML>" + html;
}

function makeBlog(param) {
  var createBlog = function (param) {
    return Pages$ReasonBlog.createBlog(blogDir, renderBlogPost, renderBlogIndex, param);
  };
  var __x = Pages$ReasonBlog.readPageCollection(postsDir);
  return __x.then(createBlog);
}

function make(param) {
  return makeBlog(undefined);
}

exports.postsDir = postsDir;
exports.blogDir = blogDir;
exports.renderBlogIndex = renderBlogIndex;
exports.renderBlogPost = renderBlogPost;
exports.makeBlog = makeBlog;
exports.make = make;
/* react Not a pure module */
