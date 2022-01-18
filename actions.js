const fs = require('fs');
const path = require('path');
const http = require('http');
const md = require('./lib/markdown');

function generate() {
  const dirsTobeCreated = ['posts', 'templates'];

  for (let dir of dirsTobeCreated) {
    fs.mkdir(dir, (err) => {
      if (err) {
        console.warn(err);
        return;
      }
      console.log(`Created ${dir}`);
    });
  }

  fs.writeFile('./posts/example.md', '# This is an example blog post', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('created example.md file');
  });
}

function build(dir = 'posts') {
  if (!fs.existsSync(dir)) {
    console.error('"posts" folder not found. Please generate a project first.');
    return;
  } else {
    fs.mkdirSync('dist/posts', { recursive: true });
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      let postLinks = [];
      for (let file of files) {
        if (fs.lstatSync(path.join(dir, file)).isFile() && path.extname(file) === '.md') {
          converMdFileToHTML(file);
          const fileName = path.basename(file, path.extname(file));
          console.log(fileName, 'filename');
          postLinks.push(`<a href="posts/${fileName}.html">${fileName}</a>`);
          // use post links to build index.html page with the list of all blog posts
        }
      }
      fs.writeFile(`${path.join('dist', 'index')}.html`, `<html><body>${postLinks}</body></html>`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  }
}

function converMdFileToHTML(file, rootDir = 'posts') {
  const result = md.render(fs.readFileSync(path.join(rootDir, file)).toString());
  // TODO: read and write via streams for better performance
  fs.writeFile(`${path.join('dist', rootDir, path.basename(file, path.extname(file)))}.html`, result, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

function watchDirectory(dir = 'posts') {
  fs.watch(dir, (eventType, fileName) => {
    build(dir);
  });
}

function serve() {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (req.url === '/') {
      fs.createReadStream('./dist/index.html').pipe(res);
    } else if (req.url.indexOf('/posts' > -1)) {
      fs.createReadStream(`./dist${req.url}`).pipe(res);
    } else {
      res.end(`<h1>404 not found</h1>`);
    }
  });

  watchDirectory();

  server.listen(3001, '127.0.0.1', () => {
    console.log('Server started');
  });
}

module.exports = { generate, build, serve };
