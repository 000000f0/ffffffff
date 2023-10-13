const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Define the API endpoint to be proxied
    createProxyMiddleware({
      target: 'https://deva4.fly.dev', // The target URL to proxy requests to
      changeOrigin: true, // Change the origin of the host header to the target URL
    })
  );
};
