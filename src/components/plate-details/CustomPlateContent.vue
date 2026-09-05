<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()
const previewIndex = ref<number | null>(null)
const name = computed(() => text(props.content.name) || props.displayName)
const tagline = computed(() => text(props.content.tagline) || '扫码查看更多信息')
const images = computed(() => {
  const values = Array.isArray(props.content.images) ? props.content.images : props.content.cover ? [props.content.cover] : []
  return values as ImageContent[]
})
const infoItems = computed(() => Array.isArray(props.content.infoItems) ? props.content.infoItems : [])
const textSections = computed(() => {
  if (Array.isArray(props.content.textSections) && props.content.textSections.length) return props.content.textSections
  return text(props.content.introduction) ? [{ title: '', content: text(props.content.introduction) }] : []
})
const contactName = computed(() => text(props.content.contactName))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))
const previewPhoto = computed(() => previewIndex.value === null ? null : images.value[previewIndex.value])
</script>

<template>
  <article class="custom-detail">
    <header class="custom-hero">
      <img v-if="images[0]" :src="mediaUrl(apiBase, images[0])" :alt="name">
      <div v-else class="custom-hero-fallback"><AppIcon name="image" :size="54"/></div>
      <div class="custom-hero-shade"/>
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="custom-heading"><h1>{{ name }}</h1><p>{{ tagline }}</p></div>
    </header>
    <main class="custom-body">
      <section v-if="infoItems.length" class="custom-card">
        <h2><i><AppIcon name="info" :size="17"/></i>基本信息</h2>
        <dl><div v-for="(item,index) in infoItems" :key="`${index}-${item.label}`"><dt>{{ item.label }}</dt><dd>{{ item.value }}</dd></div></dl>
      </section>
      <section v-for="(section,index) in textSections" :key="index" class="custom-card">
        <h2><i><AppIcon name="message" :size="17"/></i>{{ section.title || '文字说明' }}</h2><p class="custom-copy">{{ section.content }}</p>
      </section>
      <section v-if="images.length > 1" class="custom-card">
        <h2><i><AppIcon name="image" :size="17"/></i>相关图片</h2><div class="custom-gallery"><button v-for="(image,index) in images" :key="image.objectKey || index" @click="previewIndex=index"><img :src="mediaUrl(apiBase,image)" :alt="image.altText || name"></button></div>
      </section>
      <section v-if="contactName || phone" class="custom-card custom-contact">
        <h2><i><AppIcon name="user" :size="17"/></i>联系方式</h2><strong v-if="contactName">{{ contactName }}</strong><p v-if="phone">{{ maskedPhone }}</p><button v-if="phone" @click="$emit('contact')"><AppIcon name="phone" :size="17"/>联系我</button>
      </section>
      <footer><AppIcon name="shield" :size="14"/>贴个码 · 自定义内容，专业呈现</footer>
    </main>
    <button v-if="previewPhoto" class="custom-preview" aria-label="关闭图片预览" @click="previewIndex=null"><img :src="mediaUrl(apiBase,previewPhoto)" :alt="name"></button>
  </article>
</template>

<style scoped>
.custom-detail{width:min(100%,422px);min-height:100vh;margin:0 auto;background:#f3f5f8;color:#273044;box-shadow:0 0 35px rgba(34,47,69,.1)}.custom-hero{position:relative;height:300px;overflow:hidden;background:#293750}.custom-hero>img{display:block;width:100%;height:100%;object-fit:cover}.custom-hero-fallback{display:grid;width:100%;height:100%;place-items:center;background:linear-gradient(145deg,#445574,#202b40);color:#aebbd0}.custom-hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,22,35,.03) 30%,rgba(15,22,35,.85))}.custom-heading{position:absolute;z-index:2;right:22px;bottom:35px;left:22px;color:#fff}.custom-heading h1{margin:0;font-size:30px;line-height:1.2}.custom-heading p{margin:8px 0 0;font-size:13px;opacity:.78}.custom-body{position:relative;z-index:3;margin-top:-18px;padding:0 13px max(28px,env(safe-area-inset-bottom))}.custom-card{margin-top:12px;padding:18px;border:1px solid rgba(53,69,95,.06);border-radius:18px;background:#fff;box-shadow:0 7px 20px rgba(34,47,69,.08)}.custom-card h2{display:flex;align-items:center;gap:9px;margin:0 0 13px;font-size:19px}.custom-card h2 i{display:grid;width:35px;height:35px;place-items:center;border-radius:11px;background:#edf1ff;color:#5264c9;font-style:normal}.custom-card dl>div{display:grid;min-height:45px;align-items:center;border-bottom:1px solid #edf0f4;grid-template-columns:105px 1fr}.custom-card dl>div:last-child{border-bottom:0}.custom-card dt{color:#7c8594;font-size:14px}.custom-card dd{color:#2e3748;font-size:15px;overflow-wrap:anywhere}.custom-copy{margin:0;color:#596273;font-size:15px;line-height:1.8;white-space:pre-wrap}.custom-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.custom-gallery button{height:125px;padding:0;overflow:hidden;border:0;border-radius:11px;background:#e4e8ef}.custom-gallery img{width:100%;height:100%;object-fit:cover}.custom-contact strong,.custom-contact>p{display:block;margin:5px 0;color:#566071}.custom-contact>button{display:flex;width:100%;height:44px;align-items:center;justify-content:center;gap:7px;margin-top:15px;border:0;border-radius:12px;background:#5264c9;color:#fff;font-weight:800}.custom-body footer{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:22px;color:#9aa2af;font-size:12px}.custom-preview{position:fixed;z-index:30;inset:0;display:grid;width:100%;height:100%;padding:18px;border:0;background:rgba(11,16,25,.92);place-items:center}.custom-preview img{max-width:100%;max-height:100%;object-fit:contain}
</style>
