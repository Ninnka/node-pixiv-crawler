function cookiesStringTransform (params) {
  const entries = Object.entries(params);
  let res = '';
  entries.forEach(element => {
    res = res + ` ${element[0]}=${element[1]};`
  });
  return res.trim();
}

const cookiesObj = {
  PHPSESSID: '4262444_838cdd5f577b2c2bd3525335b8020677',
  __cfduid: 'd4036ffbd07f3e753b3290ce6e3b3a7ee1523170351',
  __utma: '235335808.454134352.1521441271.1523170327.1523170327.1',
  __utmb: '235335808.3.10.1523170327',
  __utmc: '235335808',
  __utmt: '1',
  __utmv: '235335808.|2=login%20ever=yes=1^3=plan=normal=1^5=gender=male=1^6=user_id=4262444=1^9=p_ab_id=6=1^10=p_ab_id_2=8=1^11=lang=zh=1',
  __utmz: '235335808.1523170327.1.1.utmcsr=accounts.pixiv.net|utmccn=(referral)|utmcmd=referral|utmcct=/login',
  _ga: 'GA1.2.454134352.1521441271',
  _gid: 'GA1.2.97208334.1523170274',
  a_type: '0',
  b_type: '1',
  c_type: '23',
  device_token: '8991da2eec7d5b2040db59a8a1f877cc',
  is_sensei_service_user: '1',
  login_bc: '1',
  login_ever: 'yes',
  module_orders_mypage: '%5B%7B%22name%22%3A%22sketch_live%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22tag_follow%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22recommended_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22showcase%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22everyone_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22following_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22mypixiv_new_illusts%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22fanbox%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22featured_tags%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22contests%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22user_events%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22sensei_courses%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22spotlight%22%2C%22visible%22%3Atrue%7D%2C%7B%22name%22%3A%22booth_follow_items%22%2C%22visible%22%3Atrue%7D%5D',
  p_ab_id: '6',
  p_ab_id_2: '8',
  tag_view_ranking: 'eYrgnBd8yx~KgtLZpp18O~-HFtqPPU12~kxSeeOQL7R'
};

const cookiesStr = cookiesStringTransform(cookiesObj);

module.exports = {
  cookiesStringTransform,
  cookiesObj,
  cookiesStr,
};
