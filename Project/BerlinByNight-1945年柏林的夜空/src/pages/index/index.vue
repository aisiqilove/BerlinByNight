<template>
  <view class="content">
    <canvas
      :style="{ width: width + 'px', height: height + 'px' }"
      canvas-id="canvasWrapper"
      id="canvasWrapper"
      @touchstart="handleClick"
      @touchmove="move"
      @touchend="end"
    ></canvas>
  </view>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, onUnmounted } from 'vue'
import { Hero, Hullet, enemyIf, heroIf, hulletIf, StateEnum } from './model'
interface stateIt {
  width: number
  height: number
  ctx: any
  phase: number
  liveEnemy: enemyIf[]
  hero: heroIf | null
  hullets: hulletIf[]
  score: number
  bgY: number
}

export default {
  setup() {
    const state = reactive<stateIt>({
      width: window.innerWidth, // canvas宽度
      height: window.innerHeight, // canvas高度
      ctx: null, // canvas的上下文
      phase: 1, // 游戏状态
      liveEnemy: [], // 敌机数组
      hero: null, // 主角飞机对象
      hullets: [], // 子弹数组
      score: 0, // 游戏分数
      bgY: 0, // 背景版的y轴偏移量
    })
    let interval: number | null | undefined = null
    // mounted
    onMounted(() => {
      state.ctx = uni.createCanvasContext('canvasWrapper')
      start()
      // 轮询调用主引擎
      interval = setInterval(gameEngine, 50)
    })
    onUnmounted(() => {
      // 清除定时任务
      interval && clearInterval(interval)
    })
    // 改变游戏状态
    function changePhase(phase: number) {
      state.phase = phase
    }
    // 改变分数
    function changeScore(score: number) {
      state.score = score
    }

    // 画背景
    function paintBg(ctx: any) {
      ctx.drawImage('/static/img/background.png', 0, state.bgY)
      ctx.draw(true)
      ctx.drawImage('/static/img/background.png', 0, state.bgY - 852)
      ctx.draw(true)
      state.bgY++ === 852 && (state.bgY = 0)
    }
    // 画logo
    function paintLogo(ctx: any) {
      ctx.drawImage('/static/img/start.png', 0, 0)
    }
    // 画敌机
    function drawEnemy() {
      for (var i = 0; i < state.liveEnemy.length; i++) {
        if (state.liveEnemy[i].removable) {
          state.liveEnemy.splice(i, 1)
        }
      }
      for (var i = 0; i < state.liveEnemy.length; i++) {
        state.liveEnemy[i].draw(
          state.ctx,
          state.height,
          state.width,
          state.hullets,
          state.score,
          changeScore
        )
      }
    }
    // 画分数
    function drawScore() {
      state.ctx.fillText('分数:' + state.score, 10, 30)
      // state.ctx.fillText(
      //   '生命值:' + ((state.hero && state.hero?.life) || 0),
      //   state.width - 120,
      //   30
      // )
      state.ctx.draw(true)
    }
    // 触摸屏幕操作
    function handleClick() {
      state.phase == StateEnum.READY && (state.phase = StateEnum.PLAY)
    }
    // 开始游戏
    function start() {
      state.phase = StateEnum.READY
      state.ctx.fillStyle = '#963'
      state.ctx.font = '24px arial'
      state.hero = new Hero(state.width, state.height)
      gameEngine()
    }

    // 移动操作
    function move(e: any) {
      if (state.phase == StateEnum.PLAY || state.phase == StateEnum.PAUSE) {
        state.phase = StateEnum.PLAY
        var offsetX = e.touches[0].x
        var offsetY = e.touches[0].y
        var w = (state.hero && state.hero.width) || 0,
          h = (state.hero && state.hero.height) || 0
        var nx = offsetX - w / 2,
          ny = offsetY - h / 2
        nx < 20 - w / 2
          ? (nx = 20 - w / 2)
          : nx > state.width - w / 2 - 20
          ? (nx = state.width - w / 2 - 20)
          : 0
        ny < 0
          ? (ny = 0)
          : ny > state.height - h / 2
          ? (ny = state.height - h / 2)
          : 0
        state.hero && (state.hero.x = nx)
        state.hero && (state.hero.y = ny)
        state.hero && (state.hero.count = 2)
      }
    }
    // 结束操作
    function end() {
      if (state.phase == StateEnum.PLAY) {
        state.phase = StateEnum.PAUSE
      }
    }
    // 游戏暂停
    function drawPause() {
      uni.getImageInfo({
        src: '/static/img/game_pause_nor.png',
        success: (res) => {
          state.ctx.drawImage(
            '/static/img/game_pause_nor.png',
            (state.width - res.width) / 2,
            (state.height - res.height) / 2
          )
          state.ctx.draw(true)
        },
      })
    }
    //游戏结束
    function gameover() {
      alert('游戏结束，成绩' + state.score)
      state.score = 0
      state.phase = StateEnum.READY
      state.hero = null
      state.hero = new Hero(state.width, state.height)
    }
    // 游戏主引擎
    function gameEngine() {
      switch (state.phase) {
        case StateEnum.READY:
          paintBg(state.ctx)
          paintLogo(state.ctx)
          break

        case StateEnum.PLAY:
          paintBg(state.ctx)
          drawEnemy()
          Hullet.drawHullet(state.ctx, state.hullets)
          state.hero &&
            state.hero.draw(
              state.ctx,
              changePhase,
              state.hullets,
              state.score,
              state.liveEnemy
            )
          break
        case StateEnum.PAUSE:
          drawPause()
          break
        case StateEnum.OVER:
          gameover()
          break
      }
      drawScore()
    }

    return {
      ...toRefs(state),
      handleClick,
      move,
      end,
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
