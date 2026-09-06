<script setup lang="ts">
import AppIcon from './AppIcon.vue'
</script>

<template>
  <footer class="plate-footer"><AppIcon name="shield" :size="16"/><span>贴个码 · 让联系更简单</span></footer>
</template>

<style scoped>
.plate-footer{display:flex;align-items:center;justify-content:center;gap:6px;margin:22px 0 0;color:#8998aa;font-size:12px;line-height:1.4;text-align:center}.plate-footer :deep(.app-icon){flex:none}
</style>
