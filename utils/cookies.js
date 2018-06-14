const moment = require('moment');

function cookiesStringTransform (params) {
  const entries = Object.entries(params);
  let res = '';
  entries.forEach(element => {
    res = res + ` ${element[0]}=${element[1].value};`
  });
  return res.trim();
}

const cookiesObj = {
  PHPSESSID: {
    value: '4262444_6c671d2904969d37f1ac355c0c7ed4a8',
    domain: '.pixiv.net',
    path: '/',
    expires: '2018-07-12T06:19:27.371Z',
    httpOnly: true,
    secure: true,
  },
  // __juicer_jid_9i3nsdfP_: {
  //   value: '',
  //   domain: '.booth.pm',
  //   path: '/',
  //   expires: '2038-01-19T03:14:07.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // __juicer_uid_9i3nsdfP_: {
  //   value: '73b2859f7966134daa40dee9d0d08687c1c21b09',
  //   domain: '.booth.pm',
  //   path: '/',
  //   expires: '2038-01-19T03:14:07.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // __utma: {
  //   value: '235335808.1760922969.1508658602.1520957397.1521271220.60',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-03-16T07:20:20.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // // __utmb: '235335808.3.10.1523170327',
  // // __utmc: '235335808',
  // // __utmt: '1',
  // __utmv: {
  //   value: '235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=4262444=1^9=p_ab_id=9=1^10=p_ab_id_2=6=1^11=lang=zh=1',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-03-16T07:20:20.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // __utmz: {
  //   value: '235335808.1521271220.60.22.utmcsr=youtube.com|utmccn=(referral)|utmcmd=referral|utmcct=/',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2018-09-15T19:20:20.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // _ga_b: {
  //   name: '_ga',
  //   value: 'GA1.2.628467667.1508658806',
  //   domain: '.booth.pm',
  //   path: '/',
  //   expires: '2019-12-08T14:24:33.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // _ga_p: {
  //   name: '_ga',
  //   value: 'GA1.2.1760922969.1508658602',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2019-12-08T14:24:33.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // _td: {
  //   name: '_td_b',
  //   value: '2a103784-cd0d-43e5-98c4-ac69418e619f',
  //   domain: '.booth.pm',
  //   path: '/',
  //   expires: '2019-10-22T07:53:29.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // _td: {
  //   name: '_td_p',
  //   value: '13b1a019-4e63-4b38-d02b-fe2e0a9c16c5',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-03-05T15:41:09.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // _tdim: {
  //   value: 'a471ea9c-bbfc-45de-d760-773ee7cc682a',
  //   domain: 'www.pixiv.net',
  //   path: '/',
  //   expires: '2019-03-06T15:41:09.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // a_type: {
  //   value: '0',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-06-11T06:19:27.370Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // b_type: {
  //   value: '1',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-06-11T06:19:27.370Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // c_type: {
  //   value: '23',
  //   domain: '.pixiv.net',
  //   path: '/',
  //   expires: '2020-06-11T07:20:53.849Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // login_ever: {
  //   value: '1',
  //   domain: '.www.pixiv.net',
  //   path: '/',
  //   expires: '2022-10-21T07:50:10.000Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // p_ab_id: {
  //   value: '9',
  //   domain: '.www.pixiv.net',
  //   path: '/',
  //   expires: '2022-10-21T07:49:50.982Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // p_ab_id_2: {
  //   value: '6',
  //   domain: '.www.pixiv.net',
  //   path: '/',
  //   expires: '2022-10-21T07:49:50.982Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // p_ab_id_2: {
  //   value: '0',
  //   domain: '.www.pixiv.net',
  //   path: '/',
  //   expires: '2020-05-31T10:28:22.163Z',
  //   httpOnly: false,
  //   secure: false,
  // },
  // yuid: {
  //   value: 'QSElOHQ58',
  //   domain: 'www.pixiv.net',
  //   path: '/',
  //   expires: '2020-04-18T14:45:19.165Z',
  //   httpOnly: false,
  //   secure: false,
  // },
};

const cookiesStr = cookiesStringTransform(cookiesObj);

async function setCookie (page) {
  const cookies = Object.entries(cookiesObj);
  let targetPros = [];
  return new Promise(async (resolve, reject) => {
    for (cookie of cookies) {
      let name = cookie[1].name ? cookie[1].name : cookie[0];
      let expires = moment(cookie[1].expires).unix();
      const data = {
        ...cookie[1],
        name,
        expires
      };
      try {
        targetPros.push(page.setCookie(data));
      } catch (err) {
        console.log('setCookie err', err);
      }
    }
    Promise.all(targetPros)
      .then(res => {
        resolve(page);
      })
      .catch(err => {
        console.log('setCookie promise all catch err', err);
        reject();
      });
  });
}

module.exports = {
  cookiesStringTransform,
  cookiesObj,
  cookiesStr,
  setCookie,
};
