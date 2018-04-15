const path = require('path');
const cheerio = require('cheerio');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');

const Cookie = require('../utils/cookies');
const parseUrl = require('./parseUrl');
const pathController = require('./PathController');
const userController = require('./UserController');

const userUrlPrefix = 'https://www.pixiv.net/member_illust.php?type=illust';
const userBookmarkPrefix = 'https://www.pixiv.net/bookmark.php?rest=show';

let countBadge = 0;

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

function checkNextPageStatus (currentPage) {
  if (userController.page ||
    userController.count === userController.counted ||
    currentPage === userController.totalPage ||
    currentPage === userController.finish) {
    return false;
  }
  return true;
}

/**
 *
 * @param {Object} params
 */
async function getUserUrl (params) {
  const { userKeyword, workType } = params;
  let page = 1;
  if (userController.page) {
    page = Number(userController.page);
  } else if (userController.start) {
    console.log('Number(userController.start)', Number(userController.start));
    page = Number(userController.start);
  }

  for (;;) {
    let userUrl = '';
    if (workType === 'illust') {
      userUrl = `${userUrlPrefix}&id=${userKeyword}&p=${page}`;
    } else if (workType === 'bookmark') {
      userUrl = `${userBookmarkPrefix}&id=${userKeyword}&p=${page}`;
    }
    if (userUrl) {
      await fetchUserUrl(userUrl);
      const nextPageStatus = checkNextPageStatus(page);
      if (nextPageStatus) {
        page = Number(page) + 1;
      } else {
        break;
      }
    } else {
      console.log('生成用户的地址失败'.red);
    }
  }
}

/**
 *
 * @param {String} userUrl
 */
function fetchUserUrl (userUrl, attemptTimes = 0) {
  return new Promise((resolve, reject) => {
    superagent
      .get(userUrl)
      .set('Cookie', Cookie.cookiesStr)
      .timeout(60 * 1000)
      .end(async (err, res) => {
        if (err) {
          console.log(`下载网页失败:${userUrl}`.yellow);
          console.log(err);
          console.log(`准备重新下载`.yellow);
          // * 重新连接下载
          if (attemptTimes < userController.attemptTimes) {
            const newAttempt = attemptTimes + 1;
            console.log(`重连次数${newAttempt}`.yellow.bgWhite);
            fetchUserUrl(userUrl, newAttempt);
          }
          // reject({
          //   cmsg: '[fetchUserUrl catch err]',
          //   body: err,
          // });
        } else {
          console.log(`下载网页成功:${userUrl}`.green);
          if (res.res && res.res.text) {
            try {
              const upres = await parseUserPage(res.res.text);
              upres.code === 0 && resolve();
            } catch (err) {
              console.log('[fetchUserUrl catch err]', err);
            }
          }
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
  return new Promise(async (resolve, reject) => {
    const $ = cheerio.load(pageContent);

    // * 剩余数量（如果设置了爬取图片的数量限制）
    let remainItems = userController.count ? userController.remainItems() : '';

    // * 保存用户名
    if (!userController.userName) {
      const _userName$ = $('a.user-name');
      const userName = _userName$.attr('title').trim();
      userController.setUserName(userName ? userName : '');
    }

    // * 保存用户作品数或收藏数
    if (userController.totalCount === '') {
      const _countBadge$ = $('.count-badge');
      let tmpCB = Number(parseInt(_countBadge$.text().trim()));
      countBadge = !isNaN(tmpCB) ? tmpCB : 0;
      userController.setTotalCount(countBadge);
      userController.setTotalPage(countBadge > 0 ? countBadge / 20 + 1 : 0);
    }

    const _imageItems$ = $('._image-items .image-item .work');
    let itemsLen = _imageItems$.length;
    if (itemsLen > 0) {
      if (remainItems !== '') {
        itemsLen = itemsLen > remainItems ? remainItems : itemsLen;
        userController.setCounted(userController.counted + itemsLen);
      }
      for (let i = 0; i < itemsLen; i++) {
        const imgHref = _imageItems$.eq(i).attr('href');
        imgHref && parseUrl.fetchMediumUrl(pathController.baseUrl + imgHref.replace(/^\//, ''));
      }
      resolve({
        code: 0,
        type: 'parseUserPage'
      })
    } else {
      resolve({
        code: 0,
        type: 'parseUserPage'
      })
      console.log('此页面没有数据'.yellow);
    }
  });
}

module.exports = {
  fetchUserUrl,
  getUserUrl,
}
