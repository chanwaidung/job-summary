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

    play() {
        const { animationEl, position } = this
        const { top, left, width, height } = animationEl.getBoundingClientRect()
        const diffX = position.centerX - left - width/2, diffY = position.centerY - top - height/2
        requestAnimationFrame(function () {
            animationEl.style=`transform: rotateY(180deg) translate3d(-${diffX}px, ${diffY}px, 0)`
        })
    }
}

export default Flip
