<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

</script>

<template>
  <div
      id="main-container"
      class="main-container"
      :class="
      store.state.app.collapse ? 'position-collapse-left' : 'position-left'
    "
  >
    <div class="main-content">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0;
  background: rgba(245,246,251, 1);
}
.main-content {
  position: absolute;
  top: 45px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding:0 35px 35px 35px;
  overflow: auto;
}
.content{
  padding: 15px;
  background: #fff;
  border: 1px solid rgb(239, 239, 245);
  border-radius:10px;
}
.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>