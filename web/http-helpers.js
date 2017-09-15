var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(__dirname + asset, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end();
    } else {
      callback(data);
    }
  });
};

exports.archiveUrl = function(res, url, callback) {
  console.log('inside archive url!', url);
  fs.readFile(__dirname + '/../archives/sites.txt', function(err, data) {
    console.log(__dirname + '/../archives/sites.txt');
    if (err) {
      console.log('error with archiving');
      res.writeHead(404);
      res.end();
    } else {
      callback(data, url);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
