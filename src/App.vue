<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue';
</script>

<template>
  <div id="app">
    <n-message-provider>
      <n-dialog-provider>
        <BasicLayout></BasicLayout>
      </n-dialog-provider>
    </n-message-provider>
  </div>
</template>

<style lang="scss">
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 全局滚动条样式 */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

*::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark *::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark *::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>