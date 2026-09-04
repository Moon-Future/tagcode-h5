<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

type InfoItem = { label: string; value: string }
type Step = { title: string; description: string }
const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
const emit = defineEmits<{ contact: []; feedback: [] }>()
const previewImage = ref('')
const name = computed(() => text(props.content.name) || props.displayName)
const subtitle = computed(() => text(props.content.summary) || text(props.content.brand))
const infoItems = computed(() => Array.isArray(props.content.infoItems) ? props.content.infoItems as InfoItem[] : [])
const images = computed(() => {
  const source = Array.isArray(props.content.images) ? props.content.images : props.content.cover ? [props.content.cover] : []
  return source.map(image => mediaUrl(props.apiBase, image as ImageContent)).filter(Boolean)
})
const steps = computed(() => Array.isArray(props.content.steps) ? props.content.steps as Step[] : [])
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
      <button class="instruction-feedback" @click="emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="instruction-symbol"><AppIcon name="lock" :size="32"/></div><small>生活说明</small><h1>{{ name }}</h1><p v-if="subtitle">{{ subtitle }}</p>
    </header>
    <div class="instruction-content">
      <section v-if="images.length" class="instruction-card instruction-images"><img v-for="image in images" :key="image" :src="image" alt="说明图片" @click="previewImage = image"></section>
      <section v-if="infoItems.length" class="instruction-card instruction-info"><h2><i><AppIcon name="key" :size="19"/></i>重要信息</h2>
        <div v-for="(item,index) in infoItems" :key="index" class="instruction-secret"><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong></div><span><button @click="copy(item.value)">复制</button></span></div>
      </section>
      <section v-if="steps.length" class="instruction-card instruction-steps"><h2><i><AppIcon name="steps" :size="19"/></i>操作步骤</h2><div v-for="(step,index) in steps" :key="index" class="instruction-step"><b>{{ index + 1 }}</b><div><strong>{{ step.title }}</strong><p>{{ step.description }}</p></div></div></section>
      <section v-if="notice" class="instruction-card instruction-notice"><h2><i><AppIcon name="warning" :size="19"/></i>注意事项</h2><p>{{ notice }}</p></section>
      <section v-if="ownerName || phone" class="instruction-card instruction-contact"><h2><i><AppIcon name="user" :size="19"/></i>遇到问题？</h2><strong v-if="ownerName">{{ ownerName }}</strong><p v-if="phone">{{ maskedPhone }}</p><button v-if="phone" @click="emit('contact')"><AppIcon name="phone" :size="18"/>联系设置人</button></section>
    </div>
    <div v-if="previewImage" class="instruction-image-preview" @click="previewImage = ''"><img :src="previewImage" alt="说明图片预览"></div>
  </article>
</template>
