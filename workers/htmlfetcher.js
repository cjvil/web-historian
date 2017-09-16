var archive = require('../helpers/archive-helpers.js');

archive.readListOfUrls((urls) => {
  archive.downloadUrls(urls);
})
