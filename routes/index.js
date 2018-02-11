const home = require('./home');
const users = require('./users');

const routes = (app) => {
  app.use('/', home);
  app.use('/users', users);
};

module.exports = routes;
