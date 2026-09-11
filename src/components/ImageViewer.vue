<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ urls: string[]; initialIndex?: number; alt?: string }>()
const emit = defineEmits<{ close: [] }>()
const current = ref(props.initialIndex || 0)
let startX = 0
watch(() => props.initialIndex, value => { current.value = value || 0 })
function move(step: number) { current.value = Math.max(0, Math.min(props.urls.length - 1, current.value + step)) }
function pointerDown(event: PointerEvent) { startX = event.clientX }
function pointerUp(event: PointerEvent) { const delta = event.clientX - startX; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1) }
</script>

<template>
  <div class="image-viewer" role="dialog" aria-modal="true" @pointerdown="pointerDown" @pointerup="pointerUp" @click.self="emit('close')">
    <button class="close" aria-label="关闭" @click="emit('close')">×</button>
    <button v-if="current>0" class="previous" aria-label="上一张" @click.stop="move(-1)">‹</button>
    <img :src="urls[current]" :alt="alt || '图片预览'" draggable="false">
    <button v-if="current<urls.length-1" class="next" aria-label="下一张" @click.stop="move(1)">›</button>
    <span v-if="urls.length>1">{{ current+1 }}/{{ urls.length }}</span>
  </div>
</template>

<style scoped>
.image-viewer{position:fixed;z-index:200;inset:0;display:grid;padding:20px;background:rgb(8 10 14 / 94%);place-items:center;touch-action:pan-y;user-select:none}.image-viewer img{display:block;max-width:100%;max-height:100%;object-fit:contain}.image-viewer button{position:absolute;z-index:2;border:0;background:rgb(0 0 0 / 42%);color:#fff}.close{top:max(16px,env(safe-area-inset-top));right:16px;width:42px;height:42px;border-radius:50%;font-size:30px}.previous,.next{top:50%;width:42px;height:58px;transform:translateY(-50%);font-size:34px}.previous{left:0;border-radius:0 10px 10px 0}.next{right:0;border-radius:10px 0 0 10px}.image-viewer span{position:absolute;right:18px;bottom:max(18px,env(safe-area-inset-bottom));padding:5px 10px;border-radius:999px;background:rgb(0 0 0 / 55%);color:#fff;font-size:13px}
</style>
