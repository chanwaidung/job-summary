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
import Flip from "./flip";
import Poster from "./poster";
import EventStore from "./event";
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
