// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "./app": "/",
    "./static": "/static",
  },
  plugins: ["@snowpack/plugin-typescript"],
  packageOptions: {
    types: false,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
