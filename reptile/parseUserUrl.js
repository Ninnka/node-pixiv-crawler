const path = require('path');
const cheerio = require('cheerio');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');

const Cookie = require('../utils/cookies');
const parseUrl = require('./parseUrl');
const pathController = require('./pathController');

const userUrlPrefix = 'https://www.pixiv.net/member_illust.php?type=illust';
const userBookmarkPrefix = 'https://www.pixiv.net/bookmark.php?rest=show';

/**
 *
 * @param {String | Number} id
 */
function getUserUrlById (prefix, id) {
  return `${prefix}&id=${id}`;
}

/**
 *
 * @param {String} prefix
 * @param {String | Number} page
 */
function setUserUrlPage (prefix, page) {
  return `${prefix}&p=${page}`;
}

/**
 *
 * @param {Object} params
 */
function getUserUrl (params) {
  const { userKeyword, workType } = params;
  const page = 1;
  let userUrl = '';
  if (workType === 'illust') {
    userUrl = `${userUrlPrefix}&id=${userKeyword}&p=${page}`;
  } else if (workType === 'bookmark') {
    userUrl = `${userBookmarkPrefix}&id=${userKeyword}&p=${page}`;
  }
  if (userUrl) {
    fetchUserUrl(userUrl);
  } else {
    console.log('生成用户的地址失败'.red);
  }
}

/**
 *
 * @param {String} userUrl
 */
function fetchUserUrl (userUrl) {
  return new Promise((resolve, reject) => {
    superagent
      .get(userUrl)
      .set('Cookie', Cookie.cookiesStr)
      .timeout(25 * 1000)
      .end((err, res) => {
        if (err) {
          console.log(`下载网页失败:${userUrl}`.yellow);
          console.log(err);
          reject({
            cmsg: '[fetchUserUrl catch err]',
            body: err,
          })
        } else {
          console.log(`下载网页成功:${userUrl}`.green);
          res.res && res.res.text && parseUserPage(res.res.text);
        }
      });
  }).then((res) => {}).catch((err) => {
    console.log(`${err.cmsg}`.red);
  });
}

/**
 *
 * @param {String} pageContent
 */
function parseUserPage (pageContent) {
  const $ = cheerio.load(pageContent);
  const _imageItems$ = $('._image-items .image-item .work');
  const itemsLen = _imageItems$.length;
  for (let i = 0; i < itemsLen; i++) {
    const imgHref = _imageItems$.eq(i).attr('href');
    imgHref && parseUrl.fetchMediumUrl(pathController.baseUrl + imgHref.replace(/^\//, ''));
  }
}

module.exports = {
  fetchUserUrl,
  getUserUrl,
}
