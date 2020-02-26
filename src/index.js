import 'dotenv/config';
import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

const USER_PATH = '/home/rwieruch';

const GITHUB_TO_DIR = {
  'rwieruch/nextjs-firebase-authentication': [
    `${USER_PATH}/Websites/courses.robinwieruch.de`,
  ],
  'rwieruch/content-courses.robinwieruch.de': [
    `${USER_PATH}/Websites/courses.robinwieruch.de`,
  ],
  'rwieruch/gatsby-personal-brand': [
    `${USER_PATH}/Websites/blog_iamliesa`,
    `${USER_PATH}/Websites/blog_robinwieruch`,
    `${USER_PATH}/Websites/roadtoreact.com`,
    `${USER_PATH}/Websites/roadtographql.com`,
    `${USER_PATH}/Websites/roadtofirebase.com`,
    `${USER_PATH}/Websites/roadtoredux.com`,
  ],
  'rwieruch/roadtoreact.com': [
    `${USER_PATH}/Websites/roadtoreact.com/content`,
  ],
  'rwieruch/roadtographql.com': [
    `${USER_PATH}/Websites/roadtographql.com/content`,
  ],
  'rwieruch/roadtofirebase.com': [
    `${USER_PATH}/Websites/roadtofirebase.com/content`,
  ],
  'rwieruch/roadtoredux.com': [
    `${USER_PATH}/Websites/roadtoredux.com/content`,
  ],
  'rwieruch/blog_iamliesa_content': [
    `${USER_PATH}/Websites/blog_iamliesa/content`,
  ],
  'rwieruch/blog_robinwieruch_content': [
    `${USER_PATH}/Websites/blog_robinwieruch/content`,
  ],
  'rwieruch/github-webhook-automatic-blog-deployment': [
    `${USER_PATH}/Webhooks/webhooks-blog`,
  ],
  'rwieruch/api.purchasing-power-parity.com': [
    `${USER_PATH}/Microservices/api.purchasing-power-parity.com`,
  ],
  'rwieruch/purchasing-power-parity.com': [
    `${USER_PATH}/Websites/purchasing-power-parity.com`,
  ],
  'rwieruch/reisebuero-bergfelde.de': [
    `${USER_PATH}/Websites/bergfelde-reisen`,
  ],
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
      const directory = GITHUB_TO_DIR[body?.repository?.full_name];

      if (isAllowed && isMaster && directory && directory.length) {
        try {
          directory.forEach(entry => exec(`cd ${entry} && bash webhook.sh`));
          console.log(directory);
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(8080);
