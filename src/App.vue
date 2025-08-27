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

</style>
