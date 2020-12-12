// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var React = require("react");
var Template__Html$ReasonBlog = require("./Template__Html.bs.js");

function Template__BlogPost(Props) {
  var blogPost = Props.blogPost;
  return React.createElement(Template__Html$ReasonBlog.make, {
              title: blogPost.title,
              children: null
            }, React.createElement("p", undefined, React.createElement("a", {
                      href: "/"
                    }, "← Back to index")), React.createElement("h1", undefined, blogPost.title), React.createElement("p", undefined, blogPost.date.toDateString()), React.createElement("div", {
                  dangerouslySetInnerHTML: {
                    __html: blogPost.body
                  }
                }));
}

var make = Template__BlogPost;

exports.make = make;
/* react Not a pure module */
