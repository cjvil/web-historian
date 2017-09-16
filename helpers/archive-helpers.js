var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


exports.readListOfUrls = function(callback) {
  var filePath = exports.paths.list;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    } else {
      var urls = data.toString().split('\n');
      callback(urls);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    var isInList = urls.indexOf(url) !== -1;
    callback(isInList);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.readListOfUrls(function(urlArray) {
    urlArray.push(url);
    fs.writeFileSync(exports.paths.list, urlArray.join('\n'));
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, function(err, data) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    exports.isUrlArchived(urls[i], function(isArchived) {
      if (!isArchived) {
        fs.writeFileSync(exports.paths.archivedSites + '/' + url, url);
      }
    });
  }
};
