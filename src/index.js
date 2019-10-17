import 'dotenv/config';
import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

const USER_PATH = '/home/rwieruch';

const GITHUB_TO_DIR = {
  'rwieruch/blog_iamliesa_content': `${USER_PATH}/blog_iamliesa`,
  'rwieruch/blog_robinwieruch_content': `${USER_PATH}/blog_robinwieruch`,
  'rwieruch/github-webhook-automatic-blog-deployment': `${USER_PATH}/Webhooks/webhooks-blog`,
  'rwieruch/api.purchasing-power-parity.com': `${USER_PATH}/Microservices/api.purchasing-power-parity.com`,
};

http
  .createServer((req, res) => {
    req.on('data', chunk => {
      const signature = `sha1=${crypto
        .createHmac('sha1', process.env.SECRET)
        .update(chunk)
        .digest('hex')}`;

      const isAllowed = req.headers['x-hub-signature'] === signature;

      const body = JSON.parse(chunk);

      const isMaster = body?.ref === 'refs/heads/master';
      const directory = GITHUB_TO_DIR[(body?.repository?.full_name)];

      if (isAllowed && isMaster && directory) {
        try {
          exec(`cd ${directory} && bash webhook.sh`);
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(8080);
