<script setup lang="ts">
import {onUnmounted,watch, ref} from 'vue'
import vueDanmaku from 'vue3-danmaku'
import OnlineUsers from '../components/OnlineUsers.vue';
import {addComment, getList} from '../http/modules/comment'
import {addLikeRecord , getRecordList} from '../http/modules/likeRecord'
import {ElMessage} from 'element-plus'
import * as signalR from '@microsoft/signalr';
import config from '../config';
import 'animate.css';

const danmuMsg = ref<string>('');
const danmaku = ref<any>(null);
const danmakuConfig = config.danmakuConfig;
const connectionCount = ref(0);// 连接数量
const onlineUsersRef = ref<HTMLDivElement>(null);
let clickTimer: ReturnType<typeof setTimeout>;
const recordReq = ref({
  CommentId: -1,
  UserId:null
})


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
        upNum: 0
      }
  danmaku.value.add(_danmuMsg)
  console.log(_danmuMsg)
});
// 订阅连接数量变化事件
connection.on('ConnectionCountChanged', (count) => {
  connectionCount.value = count;
  console.log(`当前连接数量：${count}`);
});

connection.start().then(()=>{
  connection.invoke('BroadcastConnectionCount')
      .catch(err => console.error(err.toString()));
}).catch(err => console.error(err.toString()));


const danmus = ref([]);
const loadComments = async() => {
  const res = await getList()
  if (res.statusCode === 200) {
    danmus.value = res.data.map(item => ({
      ...item, // 保留原始对象的所有属性  
      avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
      upNum: 0
    }));
    const recordRes = await getRecordList()
    if (recordRes.statusCode === 200) {
      const recordMap = new Map(recordRes.data.map(item => [item.commentId, item.count]));
      for (const danmu of danmus.value) {
        const record = recordMap.get(danmu.id);
        if (record) {
          danmu.upNum = record;
        }
      }
    }
    danmaku.value.play();
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

watch(connectionCount, (newCount, oldCount) => {
  if (newCount !== oldCount) {
    if (onlineUsersRef.value) {
      onlineUsersRef.value.classList.add('animate__shakeX');
      setTimeout(() => {
        onlineUsersRef.value?.classList.remove('animate__shakeX');
      }, 1000); // 动画持续时间
    }
  }
});
const AddUp = (index) => {
  const danmu = danmus.value[index];
  danmu.upNum += 1;
  
  if (clickTimer) {
    clearTimeout(clickTimer);
  }

  // 设置新的定时器
  clickTimer = setTimeout(() => {
    recordReq.value.CommentId = danmu.id;
    addLikeRecord(recordReq.value);
    loadComments();
  }, 1000);
}

loadComments()

// 停止连接
onUnmounted(() => {
  if (connection) {
    connection.stop();
    // 清理事件监听器
    connection.off('ReceiveComment');
    connection.off('ConnectionCountChanged');
  }
});

//监听 resize 事件，触发时调用 refName.value.resize() 方法
window.addEventListener('resize', () => {
  if (danmaku.value) {
    danmaku.value.resize();
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
      <div class="danmu-item" @click="AddUp(index)">
        <img :src="danmu.avatar" class="img" />
        <span>{{ danmu.content }}</span>
        <span class="plus">{{ danmu.upNum }}</span>
      </div>
    </template>
  </vue-danmaku>
  <div class="main">
    <input @keyup.enter="addDanmu" v-model="danmuMsg"  placeholder="输入弹幕内容，回车发送" class="custom-input" />
  </div>
  <div class="online-users-container animate__animated" ref="onlineUsersRef">
    <OnlineUsers :count="connectionCount" />
  </div>
  <a href="https://github.com/ZyPLJ/ZYTteeHole" target="_blank" aria-label="View source on Github" class="github-corner">
    <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true" style="fill: rgb(21, 21, 19); color: rgb(255, 255, 255); position: absolute; top: 0; border: 0; right: 0;">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" class="octo-arm" style="transform-origin: 130px 106px;"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
    </svg>
  </a>
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
  background-image: url('/beij.jpg');
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
.danmu-item span{
  cursor: pointer;
}
.danmu-item:active {
  transform: scale(0.95); 
  background-color: rgba(255, 255, 255, 0.5);
}
.danmu-item:hover .plus{
  opacity: 0.3;
}
.plus{
  opacity: 0;
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

.custom-input:focus {
  transform: translateY(1px);
}

.online-users-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
}
</style>