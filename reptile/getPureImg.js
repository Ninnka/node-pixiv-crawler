const fs = require('fs');
const path = require('path');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');

const moment = require('moment');

const refererPrefix = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=';
const illustUrlPrefix = 'https://i.pximg.net/img-original/img/2018/03/12/00/31/32/';
const illustUrlSuffix = '_p0.jpg';

const dateFormated = moment().format('YYYY-MM-DD');

function getPureImg (illustId) {
  const referer = `${refererPrefix}${illustId}`;
  const illustUrl = `${illustUrlPrefix}${illustId}${illustUrlSuffix}`;
  return new Promise((resolve, reject) => {
    console.log(`下载中:${illustId}`.gray);
    superagent
      .get(illustUrl)
      // .set('Cookie', cookiesStr)
      .set('Referer', referer)
      .end((err, res) => {
        if (err) {
          console.log(`下载失败:${illustId}`.yellow);
          console.log(err);
        } else {
          console.log(`下载成功:${illustId}`.green);
          res.body && writeBufferPureImg(res.body, illustId);
        }
      });
  })
}

function writeBufferPureImg (buffer, name) {
  const filename = `${name}_p0.jpg`;
  const dirPath = path.join(process.cwd(), `${dateFormated} pixiv`);
  if (!fsExistsSync(dirPath)) {
    fs.mkdirSync(`${dateFormated} pixiv`);
  }
  const filenameFull = path.join(dirPath, filename);
  fs.writeFile(filenameFull, buffer, (err) => {
    if (err) {
      console.log(`写入失败:${filenameFull}`.red);
      console.log(err);
    } else {
      console.log(`写入成功:${filenameFull}`.cyan);
    }
  }) 
}

function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = getPureImg
