const cheerio = require('cheerio');
// const request = require('superagent');
// const superagent = require('superagent-charset')(request);
const puppeteer = require('puppeteer');

const Cookie = require('../utils/cookies');
const pureImg = require('./getPureImg');
const pathController = require('./PathController');
const userController = require('./UserController');

const urlPrefix = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=';

/**
 * 解析传入的url，打开单个页面
 * @param {String} mediumUrl
 */
async function fetchMediumUrl (mediumUrl, pageAttemptTimes = 0) {
  mediumUrl = transformMediumUrl(String(mediumUrl));
  return new Promise(async (resolve, reject) => {
    try {
      let browser = null;
      if (!userController.browser) {
        browser = await puppeteer.launch();
        userController.setBrowser(browser);
      }
      let page = await userController.browser.newPage();
      const cookies = await page.cookies(mediumUrl);
      if (cookies.length <= 0) {
        page = await Cookie.setCookie(page);
      }
      try {
        userController.spinner.stop();
        userController.spinner.color = 'yellow';
        userController.spinner.text = '进入页面中...';
        userController.spinner.start();

        await page.goto(mediumUrl);
        userController.spinner.text = '进入页面成功';
        userController.spinner.succeed();
        const content = await page.content();
        try {
          await parseMediumPage(content);
          resolve();
        } catch (err) {
          resolve();
        }
      } catch (err) {
        userController.spinner.text = '进入页面失败';
        userController.spinner.fail();

        if (pageAttemptTimes < userController.pageAttemptTimes) {
          await page.close();
          const newAttempt = pageAttemptTimes + 1;
          console.log('--------');
          console.log(`重连${mediumUrl}`.yellow.bgBlack);
          console.log(`次数${newAttempt}`.yellow.bgBlack);
          console.log('--------');
          resolve(await fetchMediumUrl(mediumUrl, newAttempt));
        } else {
          console.log(`跳转到目标页面失败:${mediumUrl}`.yellow);
          await page.close();
          resolve();
        }
      }
    } catch (err) {
      console.log('[async fetchMediumUrl catch err in promise]', err);
      resolve();
    }
  });
}

/**
 *
 * @param {String} url
 */
function transformMediumUrl (url) {
  return url.includes(urlPrefix) ? url : `${urlPrefix}${url}`;
}

/**
 *
 * @param {String} pageContent
 */
async function parseMediumPage (pageContent) {
  return new Promise(async (resolve, reject) => {
    userController.spinner.stop();
    userController.spinner.color = 'yellow';
    userController.spinner.text = '解析页面内容中...';
    userController.spinner.start();

    const $ = cheerio.load(pageContent);

    // * 图源
    const _illust_modal$ = $('div[role=presentation] > a');

    if (_illust_modal$) {
      // * 图源不是multiple的情况
      try {
        const dataSrc = _illust_modal$.attr('href');
        if (dataSrc && dataSrc.includes('http')) {
          await pureImg.getPureImg(dataSrc);
        } else if (dataSrc) {
          await fetchMultipleHref(dataSrc);
        } else {
          userController.spinner.stop();
          userController.spinner.color = 'yellow';
          userController.spinner.text = '没有内容';
          userController.spinner.warn();
        }
      } catch (err) {
        resolve();
      }
    } else {
      userController.spinner.stop();
      userController.spinner.color = 'yellow';
      userController.spinner.text = '没有找到节点';
      userController.spinner.fail();
    }
    resolve();
  });
}

/**
 *
 * @param {String} multipleHref
 */
async function fetchMultipleHref (multipleHref, pageAttemptTimes = 0) {
  multipleHref = pathController.baseUrl.replace(/\/$/, '') + multipleHref;
  return new Promise(async (resolve, reject) => {
    try {
      let browser = null;
      if (!userController.browser) {
        browser = await puppeteer.launch();
        userController.setBrowser(browser);
      }
      let page = await userController.browser.newPage();
      const cookies = await page.cookies(multipleHref);
      if (cookies.length <= 0) {
        page = await Cookie.setCookie(page);
      }
      try {
        userController.spinner.stop();
        userController.spinner.color = 'yellow';
        userController.spinner.text = '进入Manga模式页面中...';
        userController.spinner.start();
        await page.goto(multipleHref);
        userController.spinner.text = '进入Manga模式页面成功';
        userController.spinner.succeed();
        const content = await page.content();
        try {
          await parseMultipleContent(content);
          resolve();
        } catch (err) {
          resolve();
        }
      } catch (err) {
        userController.spinner.text = '进入Manga模式页面失败';
        userController.spinner.fail();
        if (pageAttemptTimes < userController.pageAttemptTimes) {
          await page.close();
          const newAttempt = pageAttemptTimes + 1;
          console.log('--------');
          console.log(`重连${multipleHref}`.yellow.bgBlack);
          console.log(`次数${newAttempt}`.yellow.bgBlack);
          console.log('--------');
          resolve(await fetchMultipleHref(multipleHref, newAttempt));
        } else {
          console.log(`跳转到目标页面失败:${multipleHref}`.yellow);
          await page.close();
          resolve();
        }
      }
    } catch (err) {
      console.log('[async fetchMediumUrl catch err in promise]', err);
      resolve();
    }

    // superagent
    //   .get(multipleHref)
    //   .set('Cookie', Cookie.cookiesStr)
    //   .timeout(60 * 1000)
    //   .end((err, res) => {
    //     if (err) {
    //       console.log(`下载图片列表网页失败:${multipleHref}`.yellow);
    //       console.log(err);
    //       // * 重新连接下载
    //       if (pageAttemptTimes < userController.pageAttemptTimes) {
    //         const newAttempt = pageAttemptTimes + 1;
    //         console.log(`重连次数${newAttempt}`.yellow.bgWhite);
    //         fetchMultipleHref(multipleHref, newAttempt);
    //       }
    //     } else {
    //       console.log(`下载图片列表网页成功:${multipleHref}`.green);
    //       res.res && res.res.text && parseMultipleContent(res.res.text);
    //     }
    //   });
  });
}

/**
 *
 * @param {String} pageContent
 */
async function parseMultipleContent (pageContent) {
  return new Promise(async (resolve, reject) => {
    userController.spinner.stop();
    userController.spinner.color = 'yellow';
    userController.spinner.text = '解析Manga模式页面中...';
    userController.spinner.start();

    const $ = cheerio.load(pageContent);

    const _itemContainerList$ = $('.item-container a');
    const len = _itemContainerList$.length;

    if (len > 0) {
      userController.spinner.text = '解析Manga模式页面成功，找到图片链接';
      userController.spinner.succeed();
    } else {
      userController.spinner.text = '解析Manga模式页面成功，没有图片链接';
      userController.spinner.warn();
      resolve();
    }

    let targetP = [];
    for (let i = 0; i < len; i++) {
      const href = _itemContainerList$.eq(i).attr('href');
      if (href) {
        targetP.push(fetchPureMangaPage(pathController.baseUrl + href.replace(/^\//, '')));
        // let dataSrc = imgHref.replace(/img-master/, 'img-original');
        // dataSrc = dataSrc.replace(/_master1200/, '');
        // dataSrc = dataSrc.replace(/jpg/, 'png');
      }
    }

    Promise.all(targetP)
      .then(res => {
        resolve();
      })
      .catch(err => {
        resolve();
      });
  });
}

/**
 *
 * @param {String} pageHref
 */
async function fetchPureMangaPage (pageHref, pageAttemptTimes = 0) {
  return new Promise(async (resolve, reject) => {
    try {
      let browser = null;
      if (!userController.browser) {
        browser = await puppeteer.launch();
        userController.setBrowser(browser);
      }
      let page = await userController.browser.newPage();
      const cookies = await page.cookies(pageHref);
      if (cookies.length <= 0) {
        page = await Cookie.setCookie(page);
      }
      try {
        userController.spinner.stop();
        userController.spinner.color = 'yellow';
        userController.spinner.text = '进入Manga图片源页面中...';
        userController.spinner.start();
        await page.goto(pageHref);
        userController.spinner.text = '进入Manga图片源页面成功';
        userController.spinner.succeed();
        const content = await page.content();
        try {
          await parsePureMangaImg(content);
          resolve();
        } catch (err) {
          resolve();
        }
      } catch (err) {
        userController.spinner.text = '进入Manga图片源页面失败';
        userController.spinner.fail();
        if (pageAttemptTimes < userController.pageAttemptTimes) {
          await page.close();
          const newAttempt = pageAttemptTimes + 1;
          console.log('--------');
          console.log(`重连${pageHref}`.yellow.bgBlack);
          console.log(`次数${newAttempt}`.yellow.bgBlack);
          console.log('--------');
          resolve(await fetchPureMangaPage(pageHref, newAttempt));
        } else {
          console.log(`跳转到目标页面失败:${pageHref}`.yellow);
          await page.close();
          resolve();
        }
      }
    } catch (err) {
      console.log('[async fetchMediumUrl catch err in promise]', err);
      resolve();
    }
  });
}

/**
 *
 * @param {String} pageContent
 */
async function parsePureMangaImg (pageContent) {
  return new Promise(async (resolve, reject) => {
    const $ = cheerio.load(pageContent);
    const img$ = $('body > img');
    const imgSrc = img$.attr('src');
    if (imgSrc) {
      await pureImg.getPureImg(imgSrc);
    }
    resolve();
  });
}

module.exports = {
  fetchMediumUrl,
  parseMediumPage,
  fetchMultipleHref,
  parseMultipleContent
}
