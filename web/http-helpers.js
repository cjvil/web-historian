var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var requestHandler = require('./request-handler.js');
var _ = require('underscore');

exports.headers = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-expose-headers': 'Location',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html',
  'Location': '/'
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(__dirname + '/public' + asset, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end();
    } else {
      if (asset.endsWith('.css')) {
        callback(data, {'Content-Type': 'text/css'});
      } else {
        callback(data, exports.headers);
      }
    }
  });
};

exports.getURLs = function(res, req, asset, callback) {
  fs.readFile(archive.paths.archivedSites + asset, function(err, data) {
    if (err) {
      archive.isUrlInList(asset.slice(1), (isInList) => {
        if (!isInList) {
          archive.addUrlToList(asset.slice(1), () => {
            res.writeHead(404);
            res.end();
          });
        } else {
          requestHandler.methods.GET(req, res, '/loading.html');
        }
      });
    } else {
      callback(data);
    }
  });
};

exports.postURL = function(urlReq, req, res) {
  if (urlReq.startsWith('www.')) {
    archive.isUrlInList(urlReq, function(isInList) {
      if (!isInList) {
        archive.addUrlToList(urlReq, () => {
          // var newHeader = _.extend({'Location': '/loading.html'}, exports.headers);
          exports.headers['Location'] = '/loading.html';
          res.writeHead(302, exports.headers);
          res.end();
        });
      } else {
        archive.isUrlArchived(urlReq, (archived) => {
          if (archived) {
            // var newHeader = _.extend({'Location': '/' + urlReq}, exports.headers);
            exports.headers['Location'] = '/' + urlReq;
            res.writeHead(302, exports.headers);
            res.end();
          } else {
            exports.headers['Location'] = '/loading.html';
            res.writeHead(302, exports.headers);
            res.end();
          }
        });
      }
    });
  }
};



