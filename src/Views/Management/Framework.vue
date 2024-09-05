<script setup>
import Navbar from "./Navbar.vue"
import HeaderBar from "./HeaderBar.vue"
import MainContent from "./MainContent.vue"
</script>

<template>
  <div class="container">
    <!-- 导航菜单栏 -->
    <Navbar></Navbar>
    <!-- 页面头部 -->
    <HeaderBar></HeaderBar>
    <!-- 页面内容 -->
    <MainContent></MainContent>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>