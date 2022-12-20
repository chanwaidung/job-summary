class Poster {
    constructor(canvasELe, width, height) {
        this.width = width
        this.height = height
        this.devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio
        this.canvasEle = typeof canvasELe === 'string' ? document.querySelector(canvasELe) : canvasELe
        if(typeof this.canvasEle === 'undefined' || !this.canvasEle) throw new Error()
        this.canvasCtx = this.canvasEle.getContext('2d')
        this.clickableArea = []
        this.strengthenCanvas()
    }

    /**
    *@name: strengthenCanvas
    *@args: void
    *@return: void
    *@description: 适配高倍屏
    *@author: WE!D
    *@time: 2022/12/20
    */
    strengthenCanvas() {
        const { devicePixelRatio, canvasEle, width, height, canvasCtx } = this
        // 将画布大小放大devicePixelRatio倍
        canvasEle.width = width * devicePixelRatio
        canvasEle.height = height * devicePixelRatio
        canvasEle.style.width = width + 'px'
        canvasEle.style.height = height + 'px'
        // 将canvas上下文像素点放大devicePixelRatio倍
        canvasCtx.scale(devicePixelRatio, devicePixelRatio)
    }

    /**
    *@name: getImage
    *@args: imageSource:string
    *@return: Promise
    *@description: 获取图片实例
    *@author: WE!D
    *@time: 2022/12/20
    */
    static async getImage(imageSource) {
        return new Promise((resolve, reject) => {
            try {
                const image = new Image()
                image.src = imageSource
                image.onload = function () {
                    resolve(this)
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }

    /**
    *@name: drawBackground
    *@args: imageSource:string, width:画布宽度单位px, height:画布高度单位px
    *@return: Promise
    *@description: 绘制canvas背景
    *@author: WE!D
    *@time: 2022/12/20
    */
    async drawBackground(imageSource, width, height) {
        const image = await  Poster.getImage(imageSource)
        this.canvasCtx.drawImage(image, 0, 0, width, height)
    }

    /**
    *@name: drawButton
    *@args: x:画笔开始于画布的横坐标, y:画笔开始于画布的纵坐标, width:按钮宽度单位vw, height:按钮高度单位vw
    *@return: { x:画布横坐标, y:画布纵坐标, width:按钮宽度单位vw, height:按钮高度单位vw }
    *@description: 绘制按钮
    *@author: WE!D
    *@time: 2022/12/20
    */
    drawButton(x=0, y=0, width=100, height=60) {
        const { canvasCtx } = this
        const copyX = Poster.getRealPx(x),
              copyY = Poster.getRealPx(y),
              copyWidth = Poster.getRealPx(width),
              copyHeight = Poster.getRealPx(height)
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.fillRect(
            copyX,
            copyY,
            copyWidth,
            copyHeight
        )
        return { x, y, width, height }
    }

    /**
    *@name: drawText
    *@args: x:画笔开始于画布的横坐标, y:画笔开始于画布的纵坐标, text:绘制内容文本
    *@return: { x:画笔开始于画布的横坐标, y:画笔开始于画布的纵坐标 }
    *@description: 绘制文本内容
    *@author: WE!D
    *@time: 2022/12/20
    */
    drawText(x=0, y=0, text='') {
        const copyX = Poster.getRealPx(x), copyY = Poster.getRealPx(y)
        const { canvasCtx } = this
        const fontSize = Poster.getRealPx(16)
        canvasCtx.font = `${fontSize}px sans-serif`
        // 获取文本宽度，文本高度近似 = actualBoundingBoxAscent + actualBoundingBoxDescent
        const { width } = canvasCtx.measureText(text)
        canvasCtx.fillStyle = '#0066ff'
        canvasCtx.strokeStyle = '#0066ff'
        canvasCtx.fillText(text, copyX - width / 2, copyY + fontSize / 2)
        return { x, y }
    }

    async draw() {
       await this.drawBackground('https://i.pinimg.com/564x/5a/69/4f/5a694f8b25a0da6dc4974fbc24fd8ed8.jpg', this.width, this.height)
       const {
           x:buttonX,
           y:buttonY,
           width:buttonWidth,
           height:buttonHeight
       } = this.drawButton(75, 280, 100, 40)
       this.pushClickableArea({
           eventType: 'click-button',
           startX: Poster.getRealPx(buttonX),
           startY: Poster.getRealPx(buttonY),
           stopX: Poster.getRealPx(buttonX + buttonWidth),
           stopY: Poster.getRealPx(buttonY + buttonHeight)
       })
       this.drawText(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, '立即领取')
    }

    /**
    *@name: getRealPx
    *@args: vw:元素的大小单位view width
    *@return: pxSize:number, 返回像素值
    *@description: 将vw转为px
    *@author: WE!D
    *@time: 2022/12/20
    */
    static getRealPx(uiPixel=1) {
        const { clientWidth } = document.documentElement
        // 设计稿px转vw, 默认以375为标准设计
        const baseVW = 100 / 375 * uiPixel
        // 将设计稿的vw转成实际设备的px
        return baseVW * clientWidth / 100
    }

    /**
    *@name: pushClickableArea
    *@args: position:{ startX, startY, stopX, stopY }
    *@return: void
    *@description: 存储可点击区域
    *@author: WE!D
    *@time: 2022/12/20
    */
    pushClickableArea(position) {
        const { canvasEle } = this
        const { width, height } = canvasEle.getBoundingClientRect()
        const centerX = document.documentElement.clientWidth / 2, centerY = document.documentElement.clientHeight / 2
        const canvasDiffX = centerX - width / 2, canvasDiffY = centerY - height / 2
        // 需要加上canvas画布相对于文档的边距
        this.clickableArea.push({
            ...position,
            startX: position.startX + canvasDiffX,
            startY: position.startY + canvasDiffY,
            stopX: position.stopX + canvasDiffX,
            stopY: position.stopY + canvasDiffY,
        })
    }

    /**
    *@name: getClickableArea
    *@args: void
    *@return: clickableArea:[]
    *@description: 获取可点击区域列表
    *@author: WE!D
    *@time: 2022/12/20
    */
    getClickableArea() {
        return this.clickableArea
    }

    /**
    *@name: isClickClickableArea
    *@args: x:number, y:number
    *@return: res:[]
    *@description: 返回当前点击范围是否点中点击区域
    *@author: WE!D
    *@time: 2022/12/20
    */
    isClickClickableArea(x, y) {
        const res = []
        const areas = this.getClickableArea() || []
        for(let i = 0,l = areas.length; i < l;i++) {
            if(x > areas[i].startX && x < areas[i].stopX && y > areas[i].startY && y < areas[i].stopY) {
                res.push(areas[i].eventType)
            }
        }
        return res
    }
}

export default Poster
