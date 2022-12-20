# 【卡牌交友】超简案例：实现卡牌翻转、canvas绘制海报、事件系统

> 源码已放置文章末尾

## 一、需求

抽卡界面有3行3列，总共9张卡牌。当用户未消费钻石💎翻牌时，卡牌呈现背面。当用户点击卡牌时，卡牌由远及近，由小至大，同时翻转至卡牌正面。卡牌显示用户的头像、姓名、个性签名、联系方式等，同时点击底部按钮跳转至报告界面。点击隐私协议跳转至协议详情页。

## 二、分析

首先，卡牌是3X3的布局，这点很容易想到用**Grid**布局，按部就班卡牌一张接一张填充即可。

其次，卡牌翻转、缩放、位移复合动画，可以用CSS、Javascript来实现，绘制卡牌内容选用canvas画布：

- 翻转：`transform-style: preserve-3d;backface-visibility: hidden`

- 缩放：这里有个问题，如果缩放用`transform: scale(1.1)`的话，卡牌内容的绘制会是一个很头疼的问题，因为scale属性会放大元素内的字体大小、内容宽高等。因此，这里的缩放动画用width乘scaleX、height乘scaleY，配合`transition: all 1s`来实现。

- 位移：卡牌翻转时，需要将卡牌同步位移到屏幕中心。只需计算出卡牌中心点到屏幕中心点的位移距离即可。`transform: translate3d(diffX, diffY, 0)`。

- 绘制：使用canvas来绘制卡牌详情内容，适配高倍屏、圆角图片的绘制、文本居中、以及如何适配移动端。

最后，因为canvas内容并不支持事件，所以需要有一套事件系统来支持用户的点击，这个时候几很适合使用**订阅者模式**来设计：

- 监听canvas点击事件

- 同时向**Event**注册相关事件如：`copy-text`

- 预先计算并存储可点击区域边界，如： 
  
  ```javascript
  const clickable = [
      { 
          eventType: 'copy-text',
          startX: 90, 
          stopX: 160,
          startY: 300,
          stopY: 330
      }
  ]
  ```

- 用户点击canvas时，获取点击到的坐标位置(x, y)

- 判断坐标(x,y)是否落在，可点击边界内

- 落在边界内则通知**Event**触发相关事件

## 三、实现

先上最终实现效果图：

![3D卡牌翻转效果](https://github.com/chanwaidung/job-summary/blob/main/static/flip-animation-min.gif)

`views/draw/draw.vue`实现9宫格布局：

```javascript
<template>
  <main class="draw-index">
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
  </main>
</template>

<script>
import FlipCard from "@/views/draw/components/FlipCard";
export default {
  name: "draw",
  components: {FlipCard},
}
</script>

<style scoped>
.draw-index {
  display: grid;
  grid-template-rows: repeat(3, 192px);
  grid-template-columns: repeat(3, 95px);
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
  margin: 20px 20px;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: 0 0 4px 4px #00000020;
}
</style>
```

`views/draw/components/FlipCard.vue`卡牌翻转组件：

```javascript
<template>
  <section class="card-wrapper">
    <main :id="flipId" class="card-item" @click.stop="flipIt">
      <!--适配高倍屏，css像素设置为逻辑像素的一半-->
      <canvas :id="posterId" class="card-face card-item__front"></canvas>
      <main class="card-face card-item__back">
        我是背面
      </main>
    </main>
  </section>
</template>

<script>
import Flip from "@/views/draw/components/flip";
import Poster from "@/views/draw/components/poster";
import EventStore from "@/views/draw/components/event";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "FlipCard",
  data() {
    return {
      // 卡牌动画实例
      flipInstance: {},
      // 海报实例
      posterInstance: {},
      // 事件中心实例
      eventInstance: new EventStore(),
      // 卡牌id
      flipId: `flip-${uuidv4()}`,
      // 海报id
      posterId: `poster-${uuidv4()}`,
      // 控制当前卡牌是否翻转
      flipActive: false
    }
  },
  methods: {
    flipIt() {
      if(this.flipActive) return
      this.flipInstance.play()
      this.posterInstance.draw()
      this.flipActive = false
    }
  },
  mounted() {
    const { flipId, posterId } = this
    console.log(`#${flipId}`)
    this.flipInstance = new Flip(`#${flipId}`)
    this.posterInstance = new Poster(`#${posterId}`, Poster.getRealPx(249.2), Poster.getRealPx(348.4))
    // 注册事件
    this.eventInstance.on('click-button', function () {
      console.log('I click it')
    })
    this.posterInstance.canvasEle.addEventListener('click', (e)=> {
      // 派发事件
      this.posterInstance.isClickClickableArea(e.pageX, e.pageY).forEach(eventType=> this.eventInstance.emit(eventType))
    })
  }
}
</script>

<style scoped>
.card-wrapper {
  /*父元素display设置为flex, 使子元素zIndex生效*/
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}
.card-item {
  display: flex;
  /*使正反卡牌居中, 方便变换*/
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  /*将元素样式设置为3d效果*/
  transform-style: preserve-3d;
  /*以中心点为变换中心*/
  transform-origin: center center;
  /*开启过渡动画*/
  transition: all 1s;
}
.card-face {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  /*将3d背部效果设置为不可见*/
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-item__front {
  color: #42b983;
  background-color: #ffffff;
  /*想象A、B两张纸重叠在一起A在上, B在下*/
  /*此时AB为整体, 翻转两纸, 翻转结束后, B的背面朝上*/
  /*显然, 这是不对的, 我们期望展示的是B的正面*/
  transform: rotateY(180deg);
}
.card-item__back {
  background-color: #42b983;
}
</style>
```

`views/draw/components/flip.vue`卡牌动画控制类：

```javascript
// 默认目标位移位置为文档可视区域中心点
const DEFAULT_POSITION = {
    centerX: document.documentElement.clientWidth / 2,
    centerY: document.documentElement.clientHeight / 2,
}

class Flip {
    constructor(el, targetPosition={}) {
        this.animationEl = typeof el === 'string' ? document.querySelector(el) : el
        this.position = { ...DEFAULT_POSITION, ...targetPosition }
        if(typeof this.animationEl === "undefined" || !this.animationEl) throw new Error()
    }

    /**
    *@name: play
    *@args: void
    *@return: void
    *@description: 触发卡牌翻转动画
    *@author: WE!D
    *@time: 2022/12/20
    */
    play() {
        try {
            const { animationEl, position } = this
            const { top, left, width, height } = animationEl.getBoundingClientRect()
            const diffX = position.centerX - left - width/2, diffY = position.centerY - top - height/2
            // 下一帧绘制后触发动画
            requestAnimationFrame(function () {
                animationEl.setAttribute(
                    'style',
                    `transform: rotateY(180deg) translate3d(${diffX < 0 ? Math.abs(diffX) : -diffX }px, ${diffY}px, 0);z-index: 9999`
                )
            })
        }
        catch (e) {
            console.log(e)
        }
    }

    /**
    *@name: destroy
    *@args: void
    *@return: void
    *@description: 销毁卡牌
    *@author: WE!D
    *@time: 2022/12/20
    */
    destroy() {}
}

export default Flip
```

`views/draw/components/poster.vue`卡牌内容绘制类：

```javascript
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
```

`views/draw/components/event.vue`事件中心类：

```javascript
class EventStore {
    constructor() {
        this.subs = {}
    }

    /**
    *@name: on
    *@args: eventType:string, cb: Function
    *@return: void
    *@description: 注册事件,存入subs
    *@author: WE!D
    *@time: 2022/12/20
    */
    on(eventType, cb) {
        const { subs } = this
        if(typeof cb !== "function") throw new Error('callback is required')
        if(!subs || !subs[eventType]) {
            subs[eventType] = [ cb ]
            return
        }
        subs[eventType].push(cb)
    }

    /**
    *@name: emit
    *@args: eventType:string
    *@return: void
    *@description: 派发事件, 执行回调
    *@author: WE!D
    *@time: 2022/12/20
    */
    emit(eventType) {
        const { subs } = this
        if(subs[eventType]) {
            subs[eventType].forEach(cb=> cb())
        }
    }
}

export default EventStore
```

## 四、总结

涉及的知识点主要包括：

- CSS的3d动画

- canvas高倍屏适配

- vw与px间的转化

- 设计模式

- [示例源码](https://github.com/chanwaidung/job-summary/tree/main/origin/src/views/draw)
