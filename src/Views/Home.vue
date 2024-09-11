<script setup lang="ts">
import {onUnmounted, ref} from 'vue'
import vueDanmaku from 'vue3-danmaku'
import {addComment, getList} from '../http/modules/comment'
import {ElMessage} from 'element-plus'
import * as signalR from '@microsoft/signalr';
import config from '../config';

const danmuMsg = ref<string>('')
const danmaku = ref<any>(null)
const danmakuConfig = config.danmakuConfig

const comments = ref<any[]>([]);
let connection: signalR.HubConnection | null = null;
connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:44323/ChatHub')
    .build();

connection.on('ReceiveComment', (comment: any) => {  
  comments.value.push(comment);
  const _danmuMsg =
      {
        avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
        content: comment.content,
      }
  danmaku.value.add(_danmuMsg)
  console.log(_danmuMsg)
});


connection.start().catch(err => console.error(err.toString()));

const danmus = ref([]);
const loadComments = async() => {
  const res = await getList()
  if (res.statusCode === 200) {
    danmus.value = res.data.map(item => ({
      ...item, // 保留原始对象的所有属性  
      avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg'
    }));
  }else{
    ElMessage.error('获取信息失败')
  }
}
const addDanmu = async () => {
  if (!danmuMsg.value) return
  try {
    let res = await addComment({content: danmuMsg.value})
    if (res.statusCode === 200) {
      if (connection) {
        connection.invoke('SendComment', res.data.content).catch(err => console.error(err.toString()));
      }
      ElMessage.success(res.message)
    }else if(res.statusCode === 400){
      ElMessage.warning(res.message)
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error(err.message)
  }
  danmuMsg.value = ''
}
loadComments()

// 停止连接
onUnmounted(() => {
  if (connection) {
    connection.stop();
  }
});
</script>

<template>
<div class="app">
  <vue-danmaku ref="danmaku"
               v-model:danmus="danmus"
               useSlot 
               :loop="danmakuConfig.loop" 
               :channels="danmakuConfig.channels"
               class="content" 
               :speeds="danmakuConfig.speeds"
               :debounce="danmakuConfig.debounce"
               :isSuspend="danmakuConfig.isSuspend">
    <template v-slot:dm="{ index, danmu }">
      <div class="danmu-item">
        <img :src="danmu.avatar" class="img" />
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
  background-image: url('public/beij.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
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