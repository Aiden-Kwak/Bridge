const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = (app) => {
    app.use(
        createProxyMiddleware("/", {
            target: "http://127.0.0.1:8000",
            changeOrigin: true,
        }),
        createProxyMiddleware("/login", {
            target: "http://localhost:8000",
            changeOrigin: true,
        }),
        createProxyMiddleware("/diary", {
            target: "http://localhost:8000",
            changeOrigin: true,
        }),
        createProxyMiddleware("/api", {
            target: "http://localhost:8000",
            changeOrigin: true,
        }),
    );
}