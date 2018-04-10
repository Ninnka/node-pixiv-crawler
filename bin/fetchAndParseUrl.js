#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const colors = require('colors');

const parseUrl = require('../reptile/parseUrl');

const pathController = require('../reptile/pathController');

program
  .version('pixiv-crawler v0.1.0', '-v, --version')
  .option('-u, --urls [address]', 'Set the url [address] for img', '')
  .option('-i, --ids [illust_id]', 'Set the [illust_id] which belong to img', '')
  .option('-o, --output [output_path]', 'Set the img [output_path]', '')
  .parse(process.argv);

let params = '';
if (program.urls) {
  console.log(`参数:${program.urls}`.blue);
  params = program.urls;
} else if (program.ids) {
  console.log(`参数:${program.ids}`.blue);
  params = program.ids;
}
pathController.setOutput(program.output);

const paramList = params.split(',');
paramList.forEach((item, index, list) => {
  if (item) {
    parseUrl.fetchMediumUrl(item.trim());
  } else {
    console.log('url或id不能为空'.red);
  }
});
