const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/playground/'
      : '/',

  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          quietDeps: true,
        },
      },
    },
  },
});
