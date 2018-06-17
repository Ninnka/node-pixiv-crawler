const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const chalk = require('chalk');
const moment = require('moment');

const referer = 'https://www.pixiv.net/';
const illustUrlPrefix = 'https://i.pximg.net';

const pathController = require('./PathController');
const userController = require('./UserController');

/**
 *
 * @param {String} imgPath
 */
async function getPureImg (imgPath) {
  return new Promise(async (resolve, reject) => {
    const { illustId, name } = spliceIllustInfoFormPath(imgPath);
    const illustUrl = transformIllustUrl(imgPath);
    await fetchPureImg(illustUrl, name);
    resolve();
  });
}

/**
 *
 * @param {String} imgPath
 */
async function getPureMangaImg (imgPath) {
  return new Promise(async (resolve, reject) => {
    const { illust_id, page } = spliceParamsFormPath(imgPath);
    await fetchPureImg(imgPath, `${illust_id}_p${page}.jpg`);
    resolve();
  });
}

/**
 *
 * @param {String} illustUrl
 */
async function fetchPureImg (illustUrl, filename, pageAttemptTimes = 0) {
  return new Promise(async (resolve, reject) => {
    userController.spinner.stop();
    userController.spinner.color = 'yellow';
    userController.spinner.text = chalk.gray(`下载图片中: ${filename}`);
    userController.spinner.start();
    superagent
      .get(illustUrl)
      // .set('Cookie', cookiesStr)
      .set('Referer', referer)
      .timeout(60 * 1000)
      .end(async (err, res) => {
        if (err) {
          userController.spinner.text = chalk.red(`下载图片失败: ${filename}`);
          userController.spinner.fail();
          // console.log(err);
          // * 重新连接下载
          if (pageAttemptTimes < userController.pageAttemptTimes) {
            const newAttempt = pageAttemptTimes + 1;
            console.log('--------');
            console.log(chalk.yellow.bgBlack(`重新下载: ${illustUrl}`));
            console.log(chalk.yellow.bgBlack(`尝试次数: ${newAttempt}`));
            console.log('--------');
            resolve(await fetchPureImg(illustUrl, filename, newAttempt));
          } else {
            resolve();
          }
        } else {
          userController.spinner.text = chalk.green(`下载图片成功: ${filename}`);
          userController.spinner.succeed();
          if (res.body) {
            await writeBufferPureImg(res.body, filename);
          }
          resolve();
        }
      });
  })
}

/**
 *
 * @param {Buffer} buffer
 * @param {String} filename
 */
async function writeBufferPureImg (buffer, filename) {
  return new Promise((resolve, reject) => {
    let dirPath = '';
    if (pathController.output) {
      dirPath = path.resolve(process.cwd(), pathController.output);
    } else {
      const dateFormated = moment().format('YYYY-MM-DD');
      dirPath = path.join(process.cwd(), `${dateFormated} pixiv`);
    }
    if (userController.userName) {
      dirPath = dirPath + ` ${userController.userName}`;
    }
    if (!fsExistsSync(dirPath)) {
      fs.mkdirSync(`${dirPath}`);
    }
    const filenameList = filename.split('.');
    filename = userController.cFilenamePrefix + filenameList[0] + userController.cFilenameSuffix + `.${filenameList[1]}`;
    const filenameFull = path.join(dirPath, filename);

    userController.spinner.color = 'yellow';
    userController.spinner.text = `保存图片中...`;
    userController.spinner.start();

    fs.writeFile(filenameFull, buffer, (err) => {
      if (err) {
        // console.log(`保存失败:${filenameFull}`.red);
        userController.spinner.text = chalk.red(`保存失败`);
        userController.spinner.fail();
        // console.log(err);
        resolve();
      } else {
        // console.log(`保存成功:${filenameFull}`.cyan);
        userController.spinner.text = chalk.cyan(`保存成功: ${filenameFull}`);
        userController.spinner.succeed();
        resolve();
      }
    });
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
