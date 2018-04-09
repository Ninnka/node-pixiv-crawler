class PathController {

  constructor (outputPath = '') {
    this.output = outputPath;
    this.baseUrl = 'https://www.pixiv.net/';
  }

  setOutput (outputPath = '') {
    this.output = outputPath;
  }

  setBaseUrl (baseUrl = 'https://www.pixiv.net/') {
    this.baseUrl = baseUrl;
  }
}

const pathController = new PathController();

module.exports = pathController;
