<template>
    <div class="online-image-container" @mouseover="showCount = true" @mouseout="showCount = false">
      <img src="/Y.jpeg" alt="在线人数图片" class="online-image" :class="{ 'semi-transparent': showCount }" />
      <div v-if="showCount" class="online-count">
        <span>实时人数：{{ props.count }}</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const showCount = ref(false);
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});

</script>

<style scoped>
.online-image-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.online-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transition: opacity 0.3s ease; /* 添加过渡效果 */
}

.semi-transparent {
  opacity: 0.5; /* 半透明效果 */
}

.online-count {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px; /* 调整字体大小 */
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5); /* 背景半透明 */
  padding: 5px;
  border-radius: 50%; /* 圆形背景 */
  width: 60px; /* 调整宽度以适应圆形 */
  height: 60px; /* 调整高度以适应圆形 */
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* 防止鼠标事件触发到实时人数的背景上 */
}
</style>
