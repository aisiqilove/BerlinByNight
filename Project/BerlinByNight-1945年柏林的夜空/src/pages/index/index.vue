<template>
  <view class="content">
    <canvas
      :style="{ width: width + 'px', height: height + 'px' }"
      canvas-id="canvasWrapper"
      id="canvasWrapper"
      @touchstart="handleClick"
    ></canvas>
  </view>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue'
import { Hero, Enemy, enemyIf, heroIf } from './model'
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
  phase: number
  liveEnemy: enemyIf[]
  hero: heroIf | null
}

enum StateEnum {
  DOWNLOAD,
  READY,
  LOADING,
  PLAY,
  PAUSE,
  OVER,
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
      phase: 1,
      liveEnemy: [],
      hero: null,
    })
    // mounted
    onMounted(() => {
      state.ctx = uni.createCanvasContext('canvasWrapper')
      start()
      // paintBg(state.ctx)
      // paintLogo(state.ctx)
      // let hero = new Hero(state.width, state.height)
      // hero.draw(state.ctx, changePhase)
      // let enemy = new Enemy(state.ctx, state.width)
      // enemy.draw(state.ctx, state.height)
      setInterval(gameEngine, 50)
      // requestAnimationFrame(gameEngine)
    })
    function changePhase(phase: number) {
      state.phase = phase
    }
    // 开始游戏
    // function start() {
    //   console.log('开始游戏')
    // }

    function loadImg(ctx: any, imgPath: string, x: number = 0, y: number = 0) {
      // uni.downloadFile({
      //   url: imgPath,
      //   success: function (res) {
      ctx.drawImage(imgPath, x, y)
      ctx.draw(true)
      //   },
      // })
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
    // 画敌机
    function drawEnemy() {
      for (var i = 0; i < state.liveEnemy.length; i++) {
        if (state.liveEnemy[i].removable) {
          state.liveEnemy.splice(i, 1)
        }
      }
      for (var i = 0; i < state.liveEnemy.length; i++) {
        state.liveEnemy[i].draw(state.ctx, state.width)
      }
    }
    function handleClick() {
      console.log('handleClick===')
      // state.phase == StateEnum.READY && (state.phase = StateEnum.LOADING)
      state.phase == StateEnum.READY && (state.phase = StateEnum.PLAY)
    }
    function start() {
      state.phase = StateEnum.READY

      state.ctx.fillStyle = '#963'
      state.ctx.font = '24px arial'
      state.hero = new Hero(state.width, state.height)
      gameEngine()
    }
    // 游戏主引擎
    function gameEngine() {
      console.log('state.phase ===', state.phase)

      switch (state.phase) {
        case StateEnum.READY:
          paintBg(state.ctx)
          paintLogo(state.ctx)
          break
        case StateEnum.LOADING:
          paintBg(state.ctx)
          // load()
          break
        case StateEnum.PLAY:
          paintBg(state.ctx)
          // drawEnemy()
          // Hullet.drawHullet()

          state.hero.draw(state.ctx, changePhase)
          break
        case StateEnum.PAUSE:
          // drawPause()
          break
        case StateEnum.OVER:
          // gameover()
          break
      }
      //requestAnimationFrame(gameEngine);
    }
    return {
      ...toRefs(state),
      handleClick,
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
