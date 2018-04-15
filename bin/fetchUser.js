#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const parseUserUrl = require('../reptile/parseUserUrl');

const pathController = require('../reptile/PathController');
const userController = require('../reptile/UserController');

program
  .version('pixiv-crawler v0.1.0', '-v, --version')
  .option('-u, --urls [address]', 'Set the url [address] for img', '')
  .option('-i, --ids [illust_id]', 'Set the [illust_id] which belong to img', '')
  .option('-t, --type [work_type]', 'Set the [work_type] which for crawling, optionals: 1.illust; 2.bookmark. default: illust', 'illust')
  .option('-c, --count [count_limit]', 'Set the crawled picture [count_limit]', '')
  .option('-p, --page [page_limit]', 'Set the crawled picture [page]_limit]' , '')
  .option('-s, --start [start_page]', 'Set the [start_page]', '')
  .option('-f, --finish [finish_page]', 'Set the [finish_page]', '')
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

userController.setCount(Number(program.count));
userController.setStartPage(Number(program.start));
userController.setFinishPage(Number(program.finish));
userController.setPage(Number(program.page));

const paramList = params.split(',');
paramList.forEach((item, index, list) => {
  if (item) {
    parseUserUrl.getUserUrl({
      userKeyword: item.trim(),
      workType: program.type
    });
  } else {
    console.log('url或id不能为空'.red);
  }
});
