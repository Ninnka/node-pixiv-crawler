#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const parseUserUrl = require('../reptile/parseUserUrl');

const pathController = require('../reptile/pathController');

program
  .version('pixiv-crawler v0.1.0', '-v, --version')
  .option('-u, --urls [address]', 'Set the url [address] for img', '')
  .option('-i, --ids [illust_id]', 'Set the [illust_id] which belong to img', '')
  .option('-t, --type [work_type]', 'Set the [work_type] which for crawling, optionals: 1.illust; 2.bookmark. default: illust', 'illust')
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
    // parseUserUrl.fetchUserUrl(item.trim());
    parseUserUrl.getUserUrl({
      userKeyword: item.trim(),
      workType: program.type
    });
  } else {
    console.log('url或id不能为空'.red);
  }
});
