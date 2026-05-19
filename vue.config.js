const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [],
chainWebpack: config => {

    config.plugins.delete('progress')
  }
})
