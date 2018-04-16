class UserController {

  constructor (params = {
    count: '',
    start: '',
    finish: '',
    page: ''
  }) {
    const { count, start, finish, page } = params;
    this.count = count;
    this.start = start;
    this.finish = finish;
    this.page = page;
    this.userName = '';
    this.totalCount = '';
    this.totalPage = '';
    this.counted = 0;
    this.attemptTimes = 5;
    this.pageAttemptTimes = 5;
    this.cFilenamePrefix = '';
    this.cFilenameSuffix = '';
  }

  setCount (count = '') {
    this.count = count;
  }

  setStartPage (start = '') {
    this.start = start;
  }

  setFinishPage (finish = '') {
    this.finish = finish;
  }

  setPage (page = '') {
    this.page = page;
  }

  setUserName (userName = '') {
    this.userName = userName;
  }

  setTotalCount (totalCount = '') {
    this.totalCount = totalCount;
  }

  setTotalPage (totalPage = '') {
    this.totalPage = totalPage;
  }

  setCounted (counted = 0) {
    this.counted = counted;
  }

  setAttemptTimes (attemptTimes = 5) {
    this.attemptTimes = attemptTimes;
  }

  setPageAttemptTimes (pageAttemptTimes = 5) {
    this.pageAttemptTimes = pageAttemptTimes;
  }

  setCfilename (cFilename = '') {
    if (cFilename !== '') {
      const regexpPrefix = /.*(?=\{fn\})/g;
      let resPrefix = regexpPrefix.exec(cFilename);
      const regexpSuffix = /(?<=\{fn\}).*/g;
      let resSuffix = regexpSuffix.exec(cFilename);
      this.cFilenamePrefix = resPrefix[0];
      this.cFilenameSuffix = resSuffix[0];
    }
  }

  remainItems () {
    return this.count - this.counted;
  }

}

const userController = new UserController();

module.exports = userController;
