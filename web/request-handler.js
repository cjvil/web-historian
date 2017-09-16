var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var url = require('url');

var methods = {
  GET: function(req, res, pathname) {
    if (pathname === '/') {
      helpers.serveAssets(res, '/index.html', (data) => {
        res.writeHead(200, helpers.headers);
        res.end(data.toString());
      });
    } else if (pathname.startsWith('/www.')) {
      helpers.getURLs(res, req, pathname, (data) => {
        res.writeHead(200, helpers.headers);
        res.end(data.toString());
      });
    } else {
      helpers.serveAssets(res, pathname, (data, header) => {
        res.writeHead(200, header);
        res.end(data.toString());
      });
    }
  },
  POST: function(req, res, pathname) {
    console.log(req.url);
    var urlReq = '';
    req.on('data', (chunk) => {
      urlReq += chunk;
    });
    req.on('end', function() {
      urlReq = urlReq.slice(4);
      helpers.postURL(urlReq, req, res);
    });
  },
  OPTIONS: function(req, res) {
    res.writeHead(200, helpers.headers);
    res.end();
  }
};

exports.methods = methods;


exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  var action = methods[req.method];
  
  if (action) {
    methods[req.method](req, res, pathname);
  }
  
};
