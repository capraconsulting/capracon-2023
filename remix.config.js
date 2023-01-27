/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    v2_meta: true,
  },
  serverBuildTarget: "cloudflare-pages",
  server: "./server.ts",
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "functions/[[path]].js",
  // publicPath: "/build/",
};
