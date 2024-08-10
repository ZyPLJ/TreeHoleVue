<script setup lang="ts">
import { ref, reactive } from 'vue'
import vueDanmaku from 'vue3-danmaku'

const danmuMsg = ref<string>('')
const danmaku = ref<any>(null)
const danmus = ref([
    { avatar: 'https://www.pljzy.top/Random/800/1000?seed=6cd048690166090b', name: 'zy', text: '测试弹幕' }, 
      { avatar: 'https://www.pljzy.top/Random/800/1000?seed=6cd048690166090b', name: 'plj', text: '测试' },
    ]);
const addDanmu = () => {
  if (!danmuMsg.value) return
  const _danmuMsg = 
      {
        avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
        name: '你',
        text: danmuMsg.value,
      }
  danmaku.value.add(_danmuMsg)
  danmuMsg.value = ''
}

</script>

<template>
<div class="app">
  <vue-danmaku ref="danmaku"
               v-model:danmus="danmus"
               useSlot :loop="false" :channels="5"
               class="content" :speeds="100"
               :isSuspend="true">
    <template v-slot:dm="{ index, danmu }">
      <div class="danmu-item">
        <img :src=" danmu.avatar" class="img" />
        <span>{{ danmu.name }}：{{ danmu.text }}</span>
      </div>
    </template>
  </vue-danmaku>
  <div class="main">
    <input type="text" @keyup.enter="addDanmu" v-model="danmuMsg" placeholder="输入弹幕内容" />
  </div>
</div>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.app{
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content{
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(45deg, #5ac381, #20568b);
}
.main{
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.app img{
  height: 25px;
  width: 25px;
  border-radius: 50%;
  margin-right: 5px;
}
.danmu-item{
  display: flex;
  align-items: center;
}
</style>