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
