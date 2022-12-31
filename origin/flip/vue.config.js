const px2viewport = require('postcss-px-to-viewport')
module.exports = {
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    px2viewport({
                        unitToConvert: 'px',
                        viewportWidth: 375,
                        unitPrecision: 2,
                        propList: ['*'],
                        viewportUnit: 'vw',
                        fontViewportUnit: 'vw',
                        selectorBlackList: ['.ignore'],
                        minPixelValue: 1,
                        mediaQuery: false,
                        replace: true,
                        exclude: /node_modules/,
                        include: undefined,
                        landscape: false,
                        landscapeUnit: 'vw',
                        landscapeWidth: 568
                    })
                ]
            }
        }
    }
}
