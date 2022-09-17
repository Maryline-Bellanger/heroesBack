const heroesRouter = require('./heroesRoutes');

const apiRouter = (app) => {
  app.use('/heroes', heroesRouter);
};

module.exports = apiRouter;