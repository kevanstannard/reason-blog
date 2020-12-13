// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var React = require("react");
var Server = require("react-dom/server");
var Pages$RescriptBlog = require("./modules/Pages.bs.js");
var Template__Page$RescriptBlog = require("./templates/Template__Page.bs.js");
var Template__BlogPost$RescriptBlog = require("./templates/Template__BlogPost.bs.js");
var Template__BlogIndex$RescriptBlog = require("./templates/Template__BlogIndex.bs.js");

var pagesDir = "./content/pages";

var postsDir = "./content/posts";

var outputDir = "./docs";

function prefixWithDocType(html) {
  return "<!doctype html>" + html;
}

function blogIndex(blogPosts) {
  var el = React.createElement(Template__BlogIndex$RescriptBlog.make, {
        blogPosts: blogPosts
      });
  return "<!doctype html>" + Server.renderToString(el);
}

function blogPost(blogPost$1) {
  var el = React.createElement(Template__BlogPost$RescriptBlog.make, {
        blogPost: blogPost$1
      });
  return "<!doctype html>" + Server.renderToString(el);
}

function page(page$1) {
  var el = React.createElement(Template__Page$RescriptBlog.make, {
        page: page$1
      });
  return "<!doctype html>" + Server.renderToString(el);
}

var Render = {
  prefixWithDocType: prefixWithDocType,
  blogIndex: blogIndex,
  blogPost: blogPost,
  page: page
};

function makeBlog(param) {
  var __x = Pages$RescriptBlog.readPageCollection(postsDir);
  return __x.then(function (param) {
              return Pages$RescriptBlog.createBlog(outputDir, blogPost, blogIndex, param);
            });
}

function makePages(param) {
  var __x = Pages$RescriptBlog.readPageCollection(pagesDir);
  return __x.then(function (param) {
              return Pages$RescriptBlog.createPages(outputDir, page, param);
            });
}

function make(param) {
  var __x = Pages$RescriptBlog.cleanDirectory(outputDir);
  var __x$1 = __x.then(makeBlog);
  return __x$1.then(makePages);
}

exports.pagesDir = pagesDir;
exports.postsDir = postsDir;
exports.outputDir = outputDir;
exports.Render = Render;
exports.makeBlog = makeBlog;
exports.makePages = makePages;
exports.make = make;
/* react Not a pure module */
