<script setup lang="ts">
import {onUnmounted,watch, ref } from 'vue'
import vueDanmaku from 'vue3-danmaku'
import OnlineUsers from '../components/OnlineUsers.vue';
import PopupBox from '../components/PopupBox.vue';
import {addComment, getList,getRankingList} from '../http/modules/comment'
import {addLikeRecord , getRecordList} from '../http/modules/likeRecord'
import {ElMessage} from 'element-plus'
import * as signalR from '@microsoft/signalr';
import config from '../config';
import 'animate.css';
import {formatTime} from '../utils/dateTime'

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
const isPopupVisible = ref(false);
const rankingList = ref<any[]>([]);
const newComment = ref({
  createTime: '',
  content: ''
})

let connection: signalR.HubConnection | null = null;
connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:44323/ChatHub')
    .build();

connection.on('ReceiveComment', (comment: any) => {
  const _danmuMsg =
      {
        id: comment.id,
        avatar: 'https://i.loli.net/2021/01/17/xpwbm3jKytfaNOD.jpg',
        content: comment.content,
        upNum: 0,
        isLatest: true
      }
  danmaku.value.add(_danmuMsg)
  console.log(_danmuMsg)
});
// 订阅连接数量变化事件
connection.on('ConnectionCountChanged', (count) => {
  connectionCount.value = count;
  console.log(`当前连接数量：${count}`);
});
//订阅最新评论事件
connection.on('LatestCommentTimeChanged', (comment) => {
  console.log(`最新评论：${comment.id},${comment.latestCommentTime}`);
  danmus.value.forEach(d => {
    d.isLatest = d.id === comment.id; // 更新最新评论的标志
  });
  const latestDanmu = danmus.value.find(d => d.id === comment.id);
  if (latestDanmu) {
    newComment.value.createTime = formatTime('yyyy-MM-dd HH:mm:ss',comment.latestCommentTime);
    newComment.value.content = latestDanmu.content;
  }
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
      upNum: 0,
      isLatest: false
    }));
    if (danmus.value.length > 0) {
      danmus.value[0].isLatest = true;
      newComment.value.createTime = formatTime('yyyy-MM-dd HH:mm:ss',danmus.value[0].createTime);
      newComment.value.content = danmus.value[0].content;
    }
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
const loadRankingList = async() => {
  const res = await getRankingList()
  if (res.statusCode === 200) {
    rankingList.value = res.data
  }
}

const addDanmu = async () => {
  if (!danmuMsg.value) return
  try {
    let res = await addComment({content: danmuMsg.value})
    if (res.statusCode === 200) {
      if (connection) {
        connection.invoke('SendComment', res.data.id,res.data.content).catch(err => console.error(err.toString()));
        connection.invoke('BroadcastLatestCommentTime', res.data.id,res.data.createTime).catch(err => console.error(err.toString()));
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
const AddUp = async (danmu) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
  }

  // 设置新的定时器
  clickTimer = setTimeout(async () => {
    danmu.upNum += 1;
    recordReq.value.CommentId = danmu.id;
    addLikeRecord(recordReq.value);
    await loadComments();
    await loadRankingList();
  }, 1000);
}
const showPopup = async () => {
  await loadRankingList();
  isPopupVisible.value = true;
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
      <div class="danmu-item" @click="AddUp(danmu)" :class="{ highlighted: danmu.isLatest }">
        <img :src="danmu.avatar" class="img" />
        <span>{{ danmu.content }}</span>
        <span class="plus">
          <i class="fas fa-heart"></i>
          {{ danmu.upNum }}
        </span>
      </div>
    </template>
  </vue-danmaku>
  <div class="main">
    <input @keyup.enter="addDanmu" v-model="danmuMsg"  placeholder="输入弹幕内容，回车发送" class="custom-input" />
    <div class="button-container">
      <button @click="showPopup" style="padding: 5px 10px;border: none;cursor: pointer;">排行榜</button>
    </div>
  </div>
  <div class="online-users-container animate__animated" ref="onlineUsersRef">
    <OnlineUsers :count="connectionCount" />
  </div>
  <a href="https://github.com/ZyPLJ/ZYTteeHole" target="_blank" aria-label="View source on Github" class="github-corner">
    <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true" style="fill: rgb(21, 21, 19); color: rgb(255, 255, 255); position: absolute; top: 0; border: 0; right: 0;">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" class="octo-arm" style="transform-origin: 130px 106px;"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
    </svg>
  </a>
  <PopupBox :visible.sync="isPopupVisible" @update:visible="isPopupVisible = $event">
    <template v-slot:header>
      <span style="line-height: 32px;">吐槽排行榜</span> 
    </template>
    <el-scrollbar max-height="200px">
      <p v-for="(item,index) in rankingList" :key="item.id" class="text item">
        <span>{{ index+1 }}.</span>
        <el-tooltip :content="item.content" placement="top" effect="light">
          <span>{{ item.content.length > 10 ? item.content.slice(0, 10) + '...' : item.content }}</span>
        </el-tooltip>
        <span class="rank">
          <small>#</small>{{item.likeCount}}
        </span>
      </p>
    </el-scrollbar>
  </PopupBox>
  <div class="footer" style="position: fixed; bottom: 0; left: 0; right: 0; text-align: center; rgb(241 241 241 / 86%); padding: 5px;">
    <span>
      最新吐槽：
      {{ newComment.createTime }} : 
      {{ newComment.content.length > 25 ? newComment.content.slice(0, 25) + '...' : newComment.content }}
    </span>
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
  opacity: 0.4;
}
.plus{
  opacity: 0.2;
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
  bottom: 40px;
  right: 20px;
  display: flex;
  align-items: center;
}

.text{
  cursor: pointer;
  padding: 10px;
}

.text:hover {
  transform: scale(1.15);
  filter: blur(0);
  padding-left: 20px;
}
.text:hover .rank {
  right: 20px;
  opacity: 1;
}

.rank {
  position: absolute;
  right: -30px;

  color: #03a9f4;
  font-size: 2em;
  opacity: 0;
  transition: right 0.8s;
}
.button-container {
  position: fixed;
  right: 20px; 
  top: 50%; 
  transform: translateY(-50%);
  width: 10px;
}

.highlighted {
  background-color: #000000;
  border: 2px solid #000000;
  color:yellow;
}
</style>