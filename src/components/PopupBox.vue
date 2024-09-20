<template>
  <div v-if="props.visible" class="popup" :style="{ top: position.y + 'px', left: position.x + 'px' }" @mousedown="startDrag">
    <div class="header">
      <slot name="header">默认标题</slot>
      <div class="header-buttons">
        <el-button @click="toggleFixed">
          <el-icon>
            <i class="fas" :class="isFixed ? 'fa-lock' : 'fa-unlock'" aria-hidden="true"></i>
          </el-icon>
        </el-button>
        <el-button @click="hide" style="margin:0">
          <el-icon>
            <i class="fas fa-close"></i>
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps,defineEmits } from 'vue';

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits();
const position = ref({ x: 100, y: 100 });
const isFixed = ref(false);
const hide = () => {
  emit('update:visible', false);
};

const toggleFixed = () => {
  isFixed.value = !isFixed.value;
};

const startDrag = (e: MouseEvent) => {
  if (isFixed.value) return;
  const startX = e.clientX - position.value.x;
  const startY = e.clientY - position.value.y;

  const mouseMoveHandler = (e: MouseEvent) => {
    position.value.x = e.clientX - startX;
    position.value.y = e.clientY - startY;
  };

  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
};
</script>

<style scoped>
.popup {
  position: absolute;
  border: 1px solid #ccc;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
}
.header {
  display: flex;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 10px;
  cursor: move;
  position: relative;
}
.header-buttons {
  display: flex;
  gap: 5px;
}
.content {
  padding: 30px;
}
button {
  cursor: pointer;
}
</style>
