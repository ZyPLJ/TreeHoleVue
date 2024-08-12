<script setup lang="ts">
import { ref, reactive } from 'vue'
import vueDanmaku from 'vue3-danmaku'
import {getList,addComment} from '../http/modules/comment'
import { ElMessage } from 'element-plus'

const danmuMsg = ref<string>('')
const danmaku = ref<any>(null)

const danmus = ref([]);
const loadComments = async() => {
  const res = await getList()
  if (res.statusCode === 200) {
    const processedData = res.data.map(item => ({
      ...item, // 保留原始对象的所有属性  
      avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg'
    }));
    danmus.value = processedData;
  }else{
    ElMessage.error('获取信息失败')
  }
}
const addDanmu = async () => {
  if (!danmuMsg.value) return
  const _danmuMsg =
      {
        avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
        content: danmuMsg.value,
      }
  try {
    let res = await addComment({content: danmuMsg.value})
    if (res.statusCode === 200) {
      danmaku.value.add(_danmuMsg)
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error(err.message)
  }
  danmuMsg.value = ''
}
loadComments()
</script>

<template>
<div class="app">
  <vue-danmaku ref="danmaku"
               v-model:danmus="danmus"
               useSlot loop :channels="0"
               class="content" :speeds="80"
               :debounce="500"
               :isSuspend="true">
    <template v-slot:dm="{ index, danmu }">
      <div class="danmu-item">
        <img :src=" danmu.avatar" class="img" />
        <span>{{ danmu.content }}</span>
      </div>
    </template>
  </vue-danmaku>
  <div class="main">
    <input @keyup.enter="addDanmu" v-model="danmuMsg"  placeholder="输入弹幕内容，回车发送" class="custom-input" />
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
.app span{
  font-size: 14px;
  padding-right:3px;
}
.danmu-item{
  display: flex;
  align-items: center;
  background-color:#242424;
  border-radius: 100px;
  padding: 5px;
  opacity: 0.8;
}
.custom-input {
  background-color: transparent; /* 背景透明 */
  border: 2px solid white; 
  border-radius: 10px; /* 圆角边框 */
  padding: 10px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  color: #333; /* 字体颜色 */
  outline: none; /* 移除焦点时的默认轮廓 */
  transition: border-color 0.3s ease; /* 平滑过渡效果 */
}

.custom-input:focus {
  border-color: #007bff; /* 选中时边框变为蓝色 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 可选：添加聚焦时的阴影效果 */
}

/* 如果你想要输入框内的文本在获得焦点时稍微下沉，可以添加以下样式 */
.custom-input:focus {
  transform: translateY(1px);
}

</style>