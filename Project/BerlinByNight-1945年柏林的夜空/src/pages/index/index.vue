<template>
  <view class="content">
    <canvas ref="canvasRef"> 您的浏览器不支持canvas绘图！ </canvas>
    <view ref="viewRef">{{ width }}</view>
  </view>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue'
interface cavasIt {
  width: string
  height: string
}
export default {
  setup(props) {
    const canvasRef = ref<cavasIt | null>(null)
    const viewRef = ref(null)
    const state = reactive({
      width: window.innerWidth > 480 ? 480 : window.innerWidth,
      height: window.innerHeight > 650 ? 650 : window.innerHeight - 20,
      ctx: null,
    })
    // mounted
    onMounted(() => {
      console.log('Component is mounted!', canvasRef.value, viewRef)

      // state.ctx = canvasRef.value.getContext('2d')
      // console.log('ctx ==', viewRef.value.innerHtml)
    })
    nextTick(() => {
      console.log('next is mounted!', canvasRef.value, viewRef)
    })
    return {
      ...toRefs(state),
      canvasRef,
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
