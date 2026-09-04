<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
const emit = defineEmits<{ contact: []; feedback: [] }>()
const currentIndex = ref(0)
const dragOffset = ref(0)
const dragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let activePointerId: number | null = null

const name = computed(() => text(props.content.name) || props.displayName)
const itemDescription = computed(() => text(props.content.itemDescription))
const ownerName = computed(() => text(props.content.ownerNickname) || text(props.content.ownerName))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))
const message = computed(() => text(props.content.message) || text(props.content.contactInstruction) || text(props.content.thankYouMessage))
const images = computed(() => {
  const source = Array.isArray(props.content.images)
    ? props.content.images
    : props.content.image ? [props.content.image] : []
  return source.slice(0, 3).map(image => mediaUrl(props.apiBase, image as ImageContent)).filter(Boolean)
})
const galleryImages = computed(() => images.value.length ? images.value : ['/images/lost-found/default-lost.svg'])
const galleryTrackStyle = computed(() => ({
  transform: `translate3d(calc(${-currentIndex.value * 100}% + ${dragOffset.value}px),0,0)`
}))

function changeImage(step: number) {
  if (images.value.length < 2) return
  currentIndex.value = Math.max(0, Math.min(images.value.length - 1, currentIndex.value + step))
}

function startDrag(event: PointerEvent) {
  if (images.value.length < 2 || !event.isPrimary) return
  activePointerId = event.pointerId
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOffset.value = 0
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== activePointerId) return
  const deltaX = event.clientX - dragStartX
  const deltaY = event.clientY - dragStartY
  if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) return
  dragOffset.value = Math.max(-110, Math.min(110, deltaX))
}

function endDrag(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== activePointerId) return
  const offset = dragOffset.value
  dragging.value = false
  activePointerId = null
  dragOffset.value = 0
  if (Math.abs(offset) >= 44) changeImage(offset < 0 ? 1 : -1)
}

function cancelDrag() {
  dragging.value = false
  activePointerId = null
  dragOffset.value = 0
}
</script>

<template>
  <article class="lost-found-detail">
    <header class="lost-hero">
      <button class="hero-feedback" @click="emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="lost-gallery" :class="{ dragging }" @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="cancelDrag">
        <div class="gallery-track" :class="{ dragging }" :style="galleryTrackStyle">
          <img v-for="(image, index) in galleryImages" :key="image" :src="image" :alt="`${name}的物品照片 ${index + 1}`" draggable="false">
        </div>
        <button v-if="images.length > 1 && currentIndex > 0" class="gallery-arrow gallery-prev" aria-label="上一张" @click="changeImage(-1)">‹</button>
        <button v-if="images.length > 1 && currentIndex < images.length - 1" class="gallery-arrow gallery-next" aria-label="下一张" @click="changeImage(1)">›</button>
        <div v-if="images.length > 1" class="gallery-dots"><i v-for="(_, index) in images" :key="index" :class="{ active: index === currentIndex }" /></div>
      </div>
    </header>

    <div class="lost-content">
      <section class="lost-name-card"><i><AppIcon name="lost" :size="22"/></i><div><h1>{{ name }}</h1><p>防丢联系牌</p></div></section>
      <section v-if="name" class="lost-info-card">
        <h2><i><AppIcon name="lost" :size="20"/></i>物品信息</h2>
        <dl><div><dt>物品名称</dt><dd>{{ name }}</dd></div><div v-if="itemDescription"><dt>物品描述</dt><dd>{{ itemDescription }}</dd></div></dl>
      </section>
      <section v-if="message" class="lost-info-card lost-message-card">
        <h2><i class="message"><AppIcon name="message" :size="20"/></i>归还说明</h2>
        <p>{{ message }}</p>
      </section>
      <section v-if="ownerName || phone" class="lost-info-card lost-contact-card">
        <h2><i class="owner"><AppIcon name="user" :size="20"/></i>联系人信息</h2>
        <dl><div v-if="ownerName"><dt>联系人</dt><dd>{{ ownerName }}</dd></div><div v-if="phone"><dt>联系方式</dt><dd>{{ maskedPhone }}</dd></div></dl>
        <button v-if="phone" class="lost-contact-button" @click="emit('contact')"><AppIcon name="phone" :size="19"/>联系失主</button>
      </section>
      <p v-else class="lost-no-contact">物主暂未设置联系方式，请通过其他方式联系</p>
      <footer><AppIcon name="shield" :size="16"/>贴个码 · 让联系更简单</footer>
    </div>
  </article>
</template>
