<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'
import PlateFooter from '../PlateFooter.vue'

type InfoItem = { label: string; value: string }
type Step = { title: string; description?: string; images?: ImageContent[] }
const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
const emit = defineEmits<{ contact: []; feedback: [] }>()
const previewImage = ref('')
const name = computed(() => text(props.content.name) || props.displayName)
const subtitle = computed(() => text(props.content.summary) || text(props.content.brand))
const infoItems = computed(() => Array.isArray(props.content.infoItems) ? props.content.infoItems as InfoItem[] : [])
const images = computed(() => {
  return (props.content.images || []).map(image => mediaUrl(props.apiBase, image as ImageContent)).filter(Boolean)
})
const steps = computed(() => Array.isArray(props.content.steps) ? props.content.steps as Step[] : [])
const stepImages = (step: Step) => (step.images || []).map(image => mediaUrl(props.apiBase, image)).filter(Boolean)
const notice = computed(() => text(props.content.notice))
const ownerName = computed(() => text(props.content.ownerName) || text(props.content.ownerNickname))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))

async function copy(value: string) {
  try { await navigator.clipboard.writeText(value) } catch {
    const input = document.createElement('textarea')
    input.value = value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
  }
}
</script>

<template>
  <article class="instruction-detail">
    <header class="instruction-hero">
      <img class="instruction-hero-image" src="/images/instruction/detail-hero-v1.png" alt="生活说明">
      <div class="instruction-hero-shade"></div>
      <button class="hero-feedback" @click="emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="instruction-hero-copy"><small>生活说明</small><h1>{{ name }}</h1><p v-if="subtitle">{{ subtitle }}</p></div>
    </header>
    <div class="instruction-content">
      <section v-if="images.length" class="instruction-card instruction-images"><img v-for="image in images" :key="image" :src="image" alt="说明图片" @click="previewImage = image"></section>
      <section v-if="infoItems.length" class="instruction-card instruction-info"><h2><i><AppIcon name="key" :size="19"/></i>重要信息</h2>
        <div v-for="(item,index) in infoItems" :key="index" class="instruction-secret"><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong></div><span><button @click="copy(item.value)">复制</button></span></div>
      </section>
      <section v-if="steps.length" class="instruction-card instruction-steps"><h2><i><AppIcon name="steps" :size="19"/></i>操作步骤</h2><div v-for="(step,index) in steps" :key="index" class="instruction-step"><b>{{ index + 1 }}</b><div><strong>{{ step.title }}</strong><p v-if="step.description">{{ step.description }}</p><div v-if="stepImages(step).length" class="instruction-step-images"><img v-for="image in stepImages(step)" :key="image" :src="image" :alt="`${step.title}操作图片`" loading="lazy" @click="previewImage = image"></div></div></div></section>
      <section v-if="notice" class="instruction-card instruction-notice"><h2><i><AppIcon name="warning" :size="19"/></i>注意事项</h2><p>{{ notice }}</p></section>
      <section v-if="ownerName || phone" class="instruction-card instruction-contact"><h2><i><AppIcon name="user" :size="19"/></i>遇到问题？</h2><strong v-if="ownerName">{{ ownerName }}</strong><p v-if="phone">{{ maskedPhone }}</p><button v-if="phone" @click="emit('contact')"><AppIcon name="phone" :size="18"/>联系设置人</button></section>
      <PlateFooter/>
    </div>
    <div v-if="previewImage" class="instruction-image-preview" @click="previewImage = ''"><img :src="previewImage" alt="说明图片预览"></div>
  </article>
</template>

<style scoped>
.instruction-hero {
  position: relative;
  display: block;
  width: 100%;
  min-height: 0;
  aspect-ratio: 16 / 10;
  padding: 0;
  overflow: hidden;
  background: #dfe8df;
}

.instruction-hero-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instruction-hero-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(15 43 31 / 4%) 28%, rgb(15 43 31 / 82%) 100%);
}

.instruction-hero-copy {
  position: absolute;
  inset: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
}

.instruction-hero-copy small { margin: 0; font-size: 15px; letter-spacing: 5px; opacity: .88; }
.instruction-hero-copy h1 { margin: 9px 0 0; font-size: 32px; line-height: 1.2; }
.instruction-hero-copy p { margin: 9px 0 0; font-size: 16px; line-height: 1.55; opacity: .9; }

.instruction-hero > .hero-feedback {
  z-index: 3;
  top: max(15px, env(safe-area-inset-top));
  right: 12px;
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-color: transparent;
  background: rgb(35 35 31 / 62%);
  color: #fff;
  box-shadow: 0 5px 18px rgb(0 0 0 / 16%);
  font-size: 12px;
}

.instruction-images {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 7px;
}

.instruction-images img,
.instruction-step-images img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  background: #edf2ef;
  object-fit: contain;
  cursor: zoom-in;
}

.instruction-step > div { flex: 1; }
.instruction-step-images { display: flex; width: 100%; flex-direction: column; gap: 8px; margin-top: 10px; }
.instruction-image-preview { position: fixed; z-index: 50; inset: 0; display: grid; padding: 20px; background: rgb(8 18 13 / 92%); place-items: center; cursor: zoom-out; }
.instruction-image-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
.instruction-content :deep(.plate-footer) { display:flex;align-items:center;justify-content:center;gap:6px;margin:22px 0 0;color:#8998aa;font-size:12px;line-height:1.4;text-align:center; }
</style>
