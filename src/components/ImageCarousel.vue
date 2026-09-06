<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mediaUrl, type ImageContent } from '../domain/plate'

const props = defineProps<{ images?: ImageContent[]; apiBase: string; fallback: string; alt: string }>()
const current = ref(0)
const dragOffset = ref(0)
const dragging = ref(false)
const horizontalDrag = ref(false)
const previewUrl = ref('')
const suppressClick = ref(false)
let startX = 0
let startY = 0
let pointerId: number | null = null
const urls = computed(() => (props.images || []).map(image => mediaUrl(props.apiBase, image)).filter(Boolean))
const slides = computed(() => urls.value.length ? urls.value : [props.fallback])
const trackStyle = computed(() => ({ transform: `translate3d(calc(${-current.value * 100}% + ${dragOffset.value}px),0,0)` }))
function move(step: number) {
  current.value = Math.max(0, Math.min(urls.value.length - 1, current.value + step))
}
watch(urls, values => { if (current.value >= values.length) current.value = 0 })
function startDrag(event: PointerEvent) {
  if (urls.value.length < 2 || !event.isPrimary) return
  pointerId = event.pointerId
  startX = event.clientX
  startY = event.clientY
  dragOffset.value = 0
  dragging.value = true
  horizontalDrag.value = false
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}
function drag(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId) return
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY
  if (!horizontalDrag.value && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
    cancelDrag()
    return
  }
  if (Math.abs(deltaX) > 6) horizontalDrag.value = true
  if (!horizontalDrag.value) return
  const atStart = current.value === 0 && deltaX > 0
  const atEnd = current.value === urls.value.length - 1 && deltaX < 0
  dragOffset.value = (atStart || atEnd) ? deltaX * .28 : deltaX
}
function endDrag(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId) return
  const offset = dragOffset.value
  suppressClick.value = Math.abs(offset) > 6
  dragging.value = false
  horizontalDrag.value = false
  pointerId = null
  dragOffset.value = 0
  if (Math.abs(offset) >= 42) move(offset < 0 ? 1 : -1)
  if (suppressClick.value) window.setTimeout(() => { suppressClick.value = false }, 0)
}
function cancelDrag() { dragging.value = false; horizontalDrag.value = false; pointerId = null; dragOffset.value = 0 }
function openPreview(index: number) {
  if (!suppressClick.value && urls.value[index]) previewUrl.value = urls.value[index]
}
</script>

<template>
  <div class="image-carousel" :class="{ dragging }" @pointerdown="startDrag" @pointermove="drag" @pointerup="endDrag" @pointercancel="cancelDrag">
    <div class="carousel-track" :class="{ dragging }" :style="trackStyle">
      <img v-for="(url, index) in slides" :key="url || index" :src="url" :alt="index === current ? alt : ''" draggable="false" @click="openPreview(index)">
    </div>
    <template v-if="urls.length > 1">
      <button v-if="current > 0" class="previous" aria-label="上一张" @pointerdown.stop @click="move(-1)">‹</button>
      <button v-if="current < urls.length - 1" class="next" aria-label="下一张" @pointerdown.stop @click="move(1)">›</button>
      <span>{{ current + 1 }}/{{ urls.length }}</span>
    </template>
    <button v-if="previewUrl" class="image-preview" type="button" aria-label="关闭图片预览" @pointerdown.stop @click.stop="previewUrl = ''"><img :src="previewUrl" :alt="alt"></button>
  </div>
</template>

<style scoped>
.image-carousel{position:relative;width:100%;height:100%;overflow:hidden;cursor:grab;touch-action:pan-y;user-select:none}.image-carousel.dragging{cursor:grabbing}.carousel-track{display:flex;width:100%;height:100%;transition:transform .32s cubic-bezier(.22,.72,.25,1);will-change:transform}.carousel-track.dragging{transition:none}.carousel-track img{display:block;width:100%;height:100%;flex:0 0 100%;object-fit:cover;pointer-events:none}.image-carousel button{position:absolute;z-index:3;top:50%;width:34px;height:42px;transform:translateY(-50%);border:0;background:rgba(0,0,0,.34);color:#fff;font-size:28px;line-height:1}.previous{left:0;border-radius:0 10px 10px 0}.next{right:0;border-radius:10px 0 0 10px}.image-carousel span{position:absolute;z-index:4;right:14px;bottom:14px;padding:4px 9px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font-size:12px;line-height:1.4;backdrop-filter:blur(4px)}
.image-carousel .image-preview{position:fixed;z-index:100;inset:0;display:grid;width:100%;height:100%;padding:18px;border:0;border-radius:0;background:rgba(8,10,14,.92);place-items:center;transform:none}.image-carousel .image-preview img{display:block;width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;pointer-events:none}
</style>
