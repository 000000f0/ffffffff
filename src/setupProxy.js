const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://deva4.fly.dev',
      changeOrigin: true,
    })
  );
};
