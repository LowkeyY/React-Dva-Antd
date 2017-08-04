const path = require('path')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr",
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true }]
        ]
      },
      "production": {
        "extraBabelPlugins": [
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true}]
        ]
      }
  },
  proxy: {
    '/api/v1/newlogin': {
        target: 'http://192.168.0.66:8084',
        changeOrigin: true,
        pathRewrite: {"^/api/v1/" : "/"}
    },
    '/api/v1/bin': {
        target: 'http://192.168.0.66:8084',
        changeOrigin: true,
        pathRewrite: {"^/api/v1/" : "/"}
    }
  }
}
