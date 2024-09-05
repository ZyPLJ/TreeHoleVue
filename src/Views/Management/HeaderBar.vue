<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const collapse = computed(() => store.state.app.collapse);
//折叠导航栏
const onCollapse = () => {
  store.commit("onCollapse");
};
</script>

<template>
  <div class="header"  :class="collapse ? 'position-collapse-left' : 'position-left'">
    <!-- 导航收缩 -->
    <div class="hamburg">
      <el-menu
          class="el-menu-demo"
      >
        <el-menu-item index="1" @click="onCollapse" style="height: 60px;">
          <div>
            <el-icon v-if="collapse">
              <Expand />
            </el-icon>
            <el-icon v-else>
              <Fold />
            </el-icon>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  width: 100%;
  line-height: 60px;
  box-shadow: 0 1px 2px #00152914;
  background-color: #888888;
}
.hamburg{
  float: left;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>