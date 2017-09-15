var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var url = require('url');
var fs = require('fs');

var methods = {
  GET: function(req, res, pathname) {
    if (pathname === '/') {
      helpers.serveAssets(res, '/public/index.html', (data) => {
        res.writeHead(200, helpers.headers);
        res.end(data.toString());
      });
    } else {
      helpers.serveAssets(res, pathname, (data) => {
        res.writeHead(200, helpers.headers);
        res.end(data.toString());
      });
    }
  },
  POST: function(req, res, pathname) {
    // var writeUrlToFile = function(data, url) {
    //   var content = JSON.parse(data);
    //   content[url] = true;
    //   fs.writeFile(__dirname + '/../archives/sites.txt', JSON.stringify(content), (err) => {
    //     if (err) {
    //       res.writeHead(404);
    //       res.end();  
    //     } else {
    //       res.writeHead(302, helpers.headers);
    //       res.end();
    //     }
    //   });
    // };
    
    var urlReq = '';
    req.on('data', (chunk) => {
      urlReq += chunk;
    });
    req.on('end', () => {
      urlReq = urlReq.slice(4);
      // helpers.archiveUrl(res, urlReq, writeUrlToFile);
      fs.appendFile(archive.paths.list, `${urlReq}` + '\n', (err) => {
        if (err) {
          res.writeHead(404);
          res.end();  
        } else {
          res.writeHead(302, helpers.headers);
          res.end();
        }
      });
    });
    
    
    
  }
};


exports.handleRequest = function (req, res) {
  var pathname = url.parse(req.url, true).pathname;
  var action = methods[req.method];
  
  if (action) {
    methods[req.method](req, res, pathname);
  }
  
};
