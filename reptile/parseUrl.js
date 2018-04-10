const path = require('path');
const cheerio = require('cheerio');
const request = require('superagent');
const superagent = require('superagent-charset')(request);
const colors = require('colors');

const Cookie = require('../utils/cookies');
const pureImg = require('./getPureImg');
const pathController = require('./pathController');

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
      .timeout(25 * 1000)
      .end((err, res) => {
        if (err) {
          console.log(`下载网页失败:${mediumUrl}`.yellow);
          console.log(err);
        } else {
          console.log(`下载网页成功:${mediumUrl}`.green);
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
  const _multiple$ = $('.works_display a.multiple');
  if (_multiple$[0]) {
    // * 图源是multiple的情况
    const multipleDataSrc = _multiple$.attr('href');
    multipleDataSrc && fetchMultipleHref(multipleDataSrc);
  } else {
    // * 图源不是multiple的情况
    const _illust_modal$ = $('._illust_modal .wrapper .original-image');
    const dataSrc = _illust_modal$.data('src');
    dataSrc && pureImg.getPureImg(dataSrc)
  }
}

/**
 *
 * @param {String} multipleHref
 */
function fetchMultipleHref (multipleHref) {
  multipleHref = pathController.baseUrl + multipleHref;
  return new Promise((resolve, reject) => {
    superagent
      .get(multipleHref)
      .set('Cookie', Cookie.cookiesStr)
      .timeout(25 * 1000)
      .end((err, res) => {
        if (err) {
          console.log(`下载图片列表网页失败:${multipleHref}`.yellow);
          console.log(err);
        } else {
          console.log(`下载图片列表网页成功:${multipleHref}`.green);
          res.res && res.res.text && parseMultipleContent(res.res.text);
        }
      });
  });
}

/**
 *
 * @param {String} pageContent
 */
function parseMultipleContent (pageContent) {
  const $ = cheerio.load(pageContent);
  const _itemContainerList$ = $('.item-container a.full-size-container');
  const len = _itemContainerList$.length;
  for (let i = 0; i < len; i++) {
    const imgHref = _itemContainerList$.eq(i).attr('href');
    imgHref && fetchPureMangaPage(pathController.baseUrl + imgHref.replace(/^\//, ''));
  }
}

/**
 *
 * @param {String} imgHref
 */
function fetchPureMangaPage (imgHref) {
  return new Promise((resolve, reject) => {
    superagent
      .get(imgHref)
      .set('Cookie', Cookie.cookiesStr)
      .timeout(25 * 1000)
      .end((err, res) => {
        if (err) {
          console.log(`下载图片网页失败:${imgHref}`.yellow);
          console.log(err);
        } else {
          console.log(`下载图片网页成功:${imgHref}`.green);
          res.res && res.res.text && parsePureMangaImg(res.res.text);
        }
      });
  });
}

/**
 *
 * @param {String} pageContent
 */
function parsePureMangaImg (pageContent) {
  const $ = cheerio.load(pageContent);
  const img$ = $('body > img');
  const imgSrc = img$.attr('src');
  imgSrc && pureImg.getPureImg(imgSrc);
}

module.exports = {
  fetchMediumUrl,
  parseMediumPage,
  fetchMultipleHref,
  parseMultipleContent
}
