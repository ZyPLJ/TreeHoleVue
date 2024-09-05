<script lang="ts" setup>
  import { ref,computed } from 'vue'
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const store = useStore();
  const collapse = computed(() => store.state.app.collapse);
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
</script>

<template>
  <div class="menu-bar-container">
    <el-menu
        default-active="1"
        :collapse="collapse"
        :collapse-transition="false"
        :unique-opened="false"
        @open="handleOpen"
        @close="handleClose"
        router
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Menu /></el-icon>
          <span>系统管理</span>
        </template>
          <el-menu-item index="comment">
            <el-icon><ChatDotRound /></el-icon>
            <span slot="title">评论管理</span>
          </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped>
.menu-bar-container {
  width:200px;
  position: fixed;
  height: 100%;
  transition: background-color 0.3s ease-in-out;
}

</style>