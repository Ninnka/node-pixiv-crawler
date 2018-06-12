#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');
const parseUrl = require('../reptile/parseUrl');

const pathController = require('../reptile/PathController');
const userController = require('../reptile/UserController');

program
  .version('pixiv-crawler v0.4.1', '-v, --version')
  .option('-u, --urls [address]', 'Set the url [address] for img', '')
  .option('-i, --ids [illust_id]', 'Set the [illust_id] which belong to img', '')
  .option('-o, --output [output_path]', 'Set the img [output_path]', '')
  .option('-n, --file-name [file_name]', 'Custom [file_name]', '')
  .parse(process.argv);

let params = '';
if (program.urls) {
  // console.log(`参数:${program.urls}`.blue);
  params = program.urls;
} else if (program.ids) {
  // console.log(`参数:${program.ids}`.blue);
  params = program.ids;
}
pathController.setOutput(program.output);
userController.setCfilename(program.fileName);

const paramList = params.split(',');
let targetPList = [];
paramList.forEach((item) => {
  if (item) {
    const res = parseUrl.fetchMediumUrl(item.trim());
    targetPList.push(res);
  } else {
    console.log('url或id不能为空'.red);
  }
});

Promise.all(targetPList)
  .then(async (res) => {
    finishProcess();
  })
  .catch(err => {
    console.log('paramList forEach Promise all catch err', err);
    finishProcess();
  });

async function finishProcess () {
  try {
    await userController.closeBrowser();
  } catch (err) {
    console.log('closeBrowser catch err', err);
  } finally {
    process.exit(0);
  }
}
