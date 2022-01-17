const fs = require('fs');
const path = require('path');
const http = require('http');
const md = require('./lib/markdown');

function generator() {
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

  fs.writeFile('./posts/index.md', '# Heading', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('created index.md file');
  });
}

function builder() {
  if (!fs.existsSync('posts')) {
    console.error('"posts" folder not found. Please generate a project first.');
    return;
  } else {
    fs.readdir('posts', (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      for (let file of files) {
        if (fs.lstatSync(path.join('posts', file)).isFile() && path.extname(file) === '.md') {
          const result = md.render(fs.readFileSync(path.join('posts', file)).toString());
          fs.writeFile(`${path.basename(file, path.extname(file))}.html`, result, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      }
    });
  }
}

function serve() {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('index.html').pipe(res);
  });

  server.listen(3000, '127.0.0.1', () => {
    console.log('Server started');
  });
}

generator();
builder();
serve();
