const cheerio = require('cheerio');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');

const Cookie = require('../utils/cookies');
const getPureImg = require('./getPureImg');

const urlPrefix = 'https://www.pixiv.net/member_illust.php?mode=medium&illust_id=';

/**
 * 解析传入的url
 * @param {String} mediumUrl
 */
function fetchMediumUrl (mediumUrl) {
  mediumUrl = transformMediumUrl(String(mediumUrl));
  return new Promise((resolve, reject) => {
    superagent
      .get(mediumUrl)
      .set('Cookie', Cookie.cookiesStr)
      .end((err, res) => {
        if (err) {
          console.log(`下载网页失败${mediumUrl}`.yellow);
          console.log(err);
        } else {
          console.log(`下载网页成功${mediumUrl}`.green);
          res.res && res.res.text && parseMediumPage(res.res.text);
        }
      });
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
function parseMediumPage (pageContent) {
  const $ = cheerio.load(pageContent);
  const _illust_modal$ = $('._illust_modal .wrapper .original-image');
  const dataSrc = _illust_modal$.data('src');
  dataSrc && getPureImg(dataSrc)
}

module.exports = {
  fetchMediumUrl,
  parseMediumPage,
}
