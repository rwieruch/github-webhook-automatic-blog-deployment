var secret = `Cp"1n00}IU')3"aCEP0`;
var repo = '/home/rwieruch/blog_robinwieruch_new';

let http = require('http');
let crypto = require('crypto');

const exec = require('child_process').exec;

http
  .createServer((req, res) => {
    req.on('data', chunk => {
      const sig = `sha1=${crypto
        .createHmac('sha1', secret)
        .update(chunk.toString())
        .digest('hex')}`;

      console.log(req);

      if (req.headers['x-hub-signature'] === sig) {
        // exec(
        //   'cd ' +
        //     repo +
        //     ' && git pull --rebase origin master && npm run build'
        // );
      }
    });

    res.end();
  })
  .listen(8080);
