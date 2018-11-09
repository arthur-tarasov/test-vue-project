var webpack = require('webpack');
const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname,'../server/public'),
    configureWebpack: {
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000'
            }
        }
    }
}