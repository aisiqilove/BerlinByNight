<template>
  <view class="content">
    <canvas
      :style="{ width: width + 'px', height: height + 'px' }"
      canvas-id="canvasWrapper"
      id="canvasWrapper"
    ></canvas>
  </view>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue'
interface stateIt {
  width: number
  height: number
  ctx: any
  bg: HTMLImageElement | null
  pause: HTMLImageElement | null
  m: HTMLImageElement | null
  startImg: HTMLImageElement | null
  enemy1: HTMLImageElement[]
  enemy2: HTMLImageElement[]
  enemy3: HTMLImageElement[]
  gameLoad: HTMLImageElement[]
  heroImg: HTMLImageElement[]
  progress: number
}

export default {
  setup(props) {
    const viewRef = ref(null)
    const state = reactive<stateIt>({
      width: window.innerWidth,
      height: window.innerHeight,
      ctx: null,
      bg: null,
      pause: null,
      m: null,
      startImg: null,
      enemy1: [],
      enemy2: [],
      enemy3: [],
      gameLoad: [],
      heroImg: [],
      progress: 0,
    })
    // mounted
    onMounted(() => {
      console.log('Component is mounted!', viewRef)
      state.ctx = uni.createCanvasContext('canvasWrapper')
      paintBg(state.ctx)
      // paintLogo(state.ctx)
    })

    // 开始游戏
    function start() {
      console.log('开始游戏')
    }

    function loadImg(ctx: any, imgPath: string, x: number = 0, y: number = 0) {
      uni.downloadFile({
        url: imgPath,
        success: function (res) {
          ctx.drawImage(res.tempFilePath, x, y)
          ctx.draw()
        },
      })
    }
    // 绘制游戏加载进度画面
    function imgLoad(state: stateIt) {
      state.progress += 3
      state.ctx.clearRect(0, 0, state.width, state.height)
      var text = state.progress + '%'
      var tw = state.ctx.measureText(text).width
      state.ctx.font = '60px arial'
      state.ctx.fillStyle = 'red'
      state.ctx.lineWidth = '0'
      state.ctx.strokeStyle = '#888'
      //ctx.strokeText(text,(width-tw)/2,height/2);
      state.ctx.fillText(text, (state.width - tw) / 2, state.height / 2)
      if (state.progress >= 100) {
        start()
      }
    }
    // 加载背景
    function paintBg(ctx: any) {
      loadImg(ctx, '/static/img/background.png')
    }
    // 开始的图
    function paintLogo(ctx: any) {
      loadImg(ctx, '/static/img/start.png')
    }
    return {
      ...toRefs(state),
      viewRef,
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
