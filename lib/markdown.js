const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

module.exports = md;
