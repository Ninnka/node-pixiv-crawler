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
  return new Promise(async (resolve) => {
    const { userKeyword, workType } = params;
    let page = 1;
    if (userController.page) {
      page = Number(userController.page);
    } else if (userController.start) {
      console.log('Number(userController.start)', Number(userController.start));
      page = Number(userController.start);
    }

    try {
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
    } catch (err) {
      console.log('catch error in getUserUrl');
    } finally {
      resolve();
    }
  });
}

/**
 *
 * @param {String} userUrl
 */
async function fetchUserUrl (userUrl, attemptTimes = 0) {
  return new Promise(async (resolve, reject) => {
    userController.spinner.stop();
    userController.spinner.color = 'yellow';
    userController.spinner.text = '获取页面中...';
    userController.spinner.start();
    superagent
      .get(userUrl)
      .set('Cookie', Cookie.cookiesStr())
      .timeout(60 * 1000)
      .end(async (err, res) => {
        if (err) {
          // console.log('fetchUserUrl err', err);
          // console.log(`下载网页失败:${userUrl}`.yellow);
          // console.log(`准备重新下载`.yellow);
          userController.spinner.text = `获取网页失败，准备重新下载:${userUrl}`.red;
          userController.spinner.fail();
          // * 重新连接下载
          try {
            if (attemptTimes < userController.attemptTimes) {
              const newAttempt = attemptTimes + 1;
              console.log('--------');
              console.log(`重连${mediumUrl}`.yellow.bgBlack);
              console.log(`次数${newAttempt}`.yellow.bgBlack);
              console.log('--------');
              resolve(await fetchUserUrl(userUrl, newAttempt));
            }
          } catch (err) {
          } finally {
            resolve();
          }
        } else {
          // console.log(`下载网页成功:${userUrl}`.green);
          userController.spinner.text = `获取网页成功:${userUrl}`.green;
          userController.spinner.succeed();
          try {
            if (res.res && res.res.text) {
              // const upres =
              await parseUserPage(res.res.text, userUrl);
              // upres.code === 0 && resolve();
            } else {
              userController.spinner.text = `无网页数据:${userUrl}`.yellow;
              userController.spinner.fail();
            }
          } catch (err) {
            console.log('[fetchUserUrl catch err]', err);
          } finally {
            resolve();
          }
        }
      });
  });
  // .then((res) => {}).catch((err) => {
  //   console.log(`${err.cmsg}`.red);
  // });
}

/**
 *
 * @param {String} pageContent
 * @param {String} userUrl
 */
async function parseUserPage (pageContent, userUrl) {
  return new Promise(async (resolve, reject) => {
    userController.spinner.stop();
    userController.spinner.color = 'yellow';
    userController.spinner.text = `解析页面数据中...`;
    userController.spinner.start();
    const $ = cheerio.load(pageContent);

    // * 剩余数量（如果设置了爬取图片的数量限制）
    let remainItems = userController.count ? userController.remainItems() : '';

    try {
      // * 保存用户名
      if (!userController.userName) {
        const _userName$ = $('a.user-name');
        const userName = _userName$.attr('title').trim();
        userController.setUserName(userName ? userName : '');
      }
    } catch (err) {

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
      userController.spinner.text = `解析页面数据成功，找到图片链接`;
      userController.spinner.succeed();
      let targetPList = [];
      for (let i = 0; i < itemsLen; i++) {
        const imgHref = _imageItems$.eq(i).attr('href');
        if (imgHref) {
          targetPList.push(parseUrl.fetchMediumUrl(pathController.baseUrl + imgHref.replace(/^\//, '')));
        }
      }

      Promise.all(targetPList)
        .then(res => {
          resolve();
        })
        .catch(err => {
          resolve();
        });
    } else {
      userController.spinner.text = `解析页面数据成功，此页面没有图片数据: ${userUrl}`.yellow;
      userController.spinner.warn();
      resolve();
      // console.log('此页面没有数据'.yellow);
    }
  });
}

module.exports = {
  fetchUserUrl,
  getUserUrl,
}
