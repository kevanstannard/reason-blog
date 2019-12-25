// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Glob = require("glob");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");

function toPromise(error, data) {
  return new Promise((function (resolve, reject) {
                if (error == null) {
                  if (data == null) {
                    return reject(Caml_builtin_exceptions.not_found);
                  } else {
                    return resolve(data);
                  }
                } else {
                  return reject(error);
                }
              }));
}

function onReadPosts2(error, data) {
  return toPromise(error, data).then((function (data) {
                console.log(data);
                return Promise.resolve(/* () */0);
              }));
}

function onData(data) {
  console.log(data);
  return /* () */0;
}

function onReadPosts(error, data) {
  if (error == null) {
    console.log(data);
    return /* () */0;
  } else {
    console.log(error);
    return /* () */0;
  }
}

function readPosts(param) {
  Glob("./content/posts/*.md", onReadPosts);
  return /* () */0;
}

Glob("./content/posts/*.md", onReadPosts);

exports.toPromise = toPromise;
exports.onReadPosts2 = onReadPosts2;
exports.onData = onData;
exports.onReadPosts = onReadPosts;
exports.readPosts = readPosts;
/*  Not a pure module */
