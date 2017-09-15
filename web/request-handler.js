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
    var writeUrlToFile = function(data, url) {
      console.log('url', url);
      var content = JSON.parse(data);
      content[url] = true;
      console.log('content', content);
      fs.writeFile(__dirname + '/../archives/sites.txt', JSON.stringify(content), (err) => {
        if (err) {
          res.writeHead(404);
          res.end();  
        } else {
          res.writeHead(302, helpers.headers);
          res.end();
        }
      });
      // fs.open(__dirname + '/../archives/sites.txt', 'w+', (err, fd) => {
      //   if (err) {
      //     console.log('Error opening archives');
      //     res.writeHead(404);
      //     res.end();
      //   } else {
      //     console.log('Opened file just fine');
      //     fs.write(fd, '{"stuff":"stuff"}');
      //     res.writeHead(302, helpers.headers);
      //     res.end();
      //   }
      // });
    };
    
    var urlReq = '';
    req.on('data', (chunk) => {
      urlReq += chunk;
    });
    req.on('end', () => {
      urlReq = urlReq.slice(4);
      helpers.archiveUrl(res, urlReq, writeUrlToFile);
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
