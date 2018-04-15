const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');
const moment = require('moment');

const referer = 'https://www.pixiv.net/';
const illustUrlPrefix = 'https://i.pximg.net';

const pathController = require('./PathController');
const userController = require('./UserController');

/**
 *
 * @param {String} imgPath
 */
function getPureImg (imgPath) {
  const { illustId, name } = spliceIllustInfoFormPath(imgPath);
  const illustUrl = transformIllustUrl(imgPath);
  fetchPureImg(illustUrl, name);
}

/**
 *
 * @param {String} imgPath
 */
function getPureMangaImg (imgPath) {
  const { illust_id, page } = spliceParamsFormPath(imgPath);
  fetchPureImg(imgPath, `${illust_id}_p${page}.jpg`);
}

/**
 *
 * @param {String} illustUrl
 */
function fetchPureImg (illustUrl, filename, pageAttemptTimes = 0) {
  return new Promise((resolve, reject) => {
    console.log(`下载图片中:${filename}`.gray);
    superagent
      .get(illustUrl)
      // .set('Cookie', cookiesStr)
      .set('Referer', referer)
      .timeout(60 * 1000)
      .end((err, res) => {
        if (err) {
          console.log(`下载图片失败:${filename}`.yellow);
          console.log(err);
          // * 重新连接下载
          if (pageAttemptTimes < userController.pageAttemptTimes) {
            const newAttempt = pageAttemptTimes + 1;
            console.log(`重连次数${newAttempt}`.yellow.bgWhite);
            fetchPureImg(illustUrl, filename, newAttempt);
          }
        } else {
          console.log(`下载图片成功:${filename}`.green);
          res.body && writeBufferPureImg(res.body, filename);
        }
      });
  })
}

/**
 *
 * @param {Buffer} buffer
 * @param {String} filename
 */
function writeBufferPureImg (buffer, filename) {
  let dirPath = '';
  if (pathController.output) {
    dirPath = path.resolve(process.cwd(), pathController.output);
  } else {
    const dateFormated = moment().format('YYYY-MM-DD');
    dirPath = path.join(process.cwd(), `${dateFormated} pixiv`);
  }
  if (!fsExistsSync(dirPath)) {
    fs.mkdirSync(`${dirPath}`);
  }
  const filenameFull = path.join(dirPath, filename);
  fs.writeFile(filenameFull, buffer, (err) => {
    if (err) {
      console.log(`写入失败:${filenameFull}`.red);
      console.log(err);
    } else {
      console.log(`写入成功:${filenameFull}`.cyan);
    }
  });
}

/**
 *
 * @param {String} imgPath
 */
function spliceIllustInfoFormPath (imgPath) {
  const pathList = imgPath.split('/');
  const filename = pathList.pop();
  return {
    illustId: filename.split('_')[0],
    name: filename
  };
}

/**
 *
 * @param {String} imgPath
 */
function spliceParamsFormPath (imgPath) {
  const query = imgPath.split('?');
  const res = querystring.parse(query[1] ? query[1] : '');
  return res;
}

/**
 *
 * @param {String} imgPath
 */
function transformIllustUrl (imgPath) {
  return imgPath.includes(illustUrlPrefix) ? imgPath : `${illustUrlPrefix}${imgPath}`;
}

/**
 *
 * @param {String} path
 */
function fsExistsSync (path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  getPureImg,
  getPureMangaImg,
}
