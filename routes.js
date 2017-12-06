const Accounts = require('./app/controllers/accounts');
const Assets = require('./app/controllers/assets');
const Socialnetwork = require('./app/controllers/socialnetwork');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/timeline', config: Socialnetwork.timeline },
  { method: 'POST', path: '/submitpost', config: Socialnetwork.submitPost },
  { method: 'POST', path: '/search', config: Socialnetwork.searchForUsers },
  { method: 'GET', path: '/user/{user}', config: Socialnetwork.user },
  { method: 'GET', path: '/deletepost/{post}', config: Socialnetwork.deletePost },
  { method: 'GET', path: '/follow/{user}', config: Socialnetwork.follow },
  { method: 'GET', path: '/unfollow/{user}', config: Socialnetwork.unfollow },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
