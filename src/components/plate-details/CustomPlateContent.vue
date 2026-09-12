<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'
import PlateFooter from '../PlateFooter.vue'
import ImageViewer from '../ImageViewer.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()
const previewIndex = ref<number | null>(null)
const name = computed(() => text(props.content.name) || props.displayName)
const tagline = computed(() => text(props.content.tagline) || '扫码查看更多信息')
const images = computed(() => {
  const values = props.content.images || []
  return values as ImageContent[]
})
const infoItems = computed(() => Array.isArray(props.content.infoItems)
  ? props.content.infoItems.filter(item => text(item?.label) && text(item?.value))
  : [])
const textSections = computed(() => {
  if (Array.isArray(props.content.textSections) && props.content.textSections.length) {
    return props.content.textSections.filter(section => text(section?.content))
  }
  return text(props.content.introduction) ? [{ title: '', content: text(props.content.introduction) }] : []
})
const contactName = computed(() => text(props.content.contactName))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))
const previewPhoto = computed(() => previewIndex.value === null ? null : images.value[previewIndex.value])
const previewUrls = computed(() => images.value.map(image => mediaUrl(props.apiBase, image)).filter(Boolean))

function imageLayout(image: ImageContent) {
  const width = Number(image.width)
  const height = Number(image.height)
  const hasSize = width > 0 && height > 0
  return {
    class: { portrait: hasSize && height > width },
    style: { '--media-ratio': hasSize ? `${width} / ${height}` : '4 / 3' }
  }
}
</script>

<template>
  <article class="custom-detail">
    <section class="custom-heading">
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <h1>{{ name }}</h1>
      <p v-if="tagline">{{ tagline }}</p>
    </section>
    <main class="custom-body">
      <section v-if="images.length === 1" class="custom-single-image">
        <button class="custom-media-stage" :class="imageLayout(images[0]).class" :style="imageLayout(images[0]).style" @click="previewIndex=0">
          <img class="custom-media-backdrop" :src="mediaUrl(apiBase,images[0])" alt="" aria-hidden="true">
          <img class="custom-media-image" :src="mediaUrl(apiBase,images[0])" :alt="images[0].altText || name">
        </button>
      </section>
      <section v-else-if="images.length > 1" class="custom-gallery">
        <button v-for="(image,index) in images" :key="image.objectKey || index" class="custom-media-stage" :class="imageLayout(image).class" :style="imageLayout(image).style" @click="previewIndex=index">
          <img class="custom-media-backdrop" :src="mediaUrl(apiBase,image)" alt="" aria-hidden="true">
          <img class="custom-media-image" :src="mediaUrl(apiBase,image)" :alt="image.altText || name">
        </button>
      </section>
      <section v-if="infoItems.length" class="custom-card">
        <h2>详细信息</h2>
        <dl><div v-for="(item,index) in infoItems" :key="`${index}-${item.label}`"><dt>{{ item.label }}</dt><dd>{{ item.value }}</dd></div></dl>
      </section>
      <section v-for="(section,index) in textSections" :key="index" class="custom-card">
        <h2>{{ section.title || '文字说明' }}</h2><p class="custom-copy">{{ section.content }}</p>
      </section>
      <section v-if="contactName || phone" class="custom-card custom-contact">
        <h2>{{ contactName || '联系方式' }}</h2>
        <div v-if="phone" class="custom-phone"><i><AppIcon name="phone" :size="18"/></i><span>{{ maskedPhone }}</span></div>
        <button v-if="phone" @click="$emit('contact')"><AppIcon name="phone" :size="17"/>联系对方</button>
      </section>
      <PlateFooter/>
    </main>
    <ImageViewer v-if="previewPhoto" :urls="previewUrls" :initial-index="previewIndex || 0" :alt="name" @close="previewIndex=null"/>
  </article>
</template>

<style scoped>
.custom-detail{position:relative;width:min(100%,422px);min-height:100vh;margin:0 auto;overflow:hidden;background:radial-gradient(circle at 92% 4%,rgba(129,141,230,.14),transparent 27%),radial-gradient(circle at -8% 34%,rgba(150,205,218,.12),transparent 30%),linear-gradient(180deg,#f7f8fc 0%,#f2f4f8 52%,#f7f7f5 100%);color:#202632;box-shadow:0 0 35px rgba(34,47,69,.08)}
.custom-detail::before{position:absolute;top:122px;right:-74px;width:180px;height:180px;border:1px solid rgba(104,116,211,.1);border-radius:50%;content:"";pointer-events:none}.custom-detail::after{position:absolute;top:176px;right:-34px;width:92px;height:92px;border-radius:32px;background:rgba(255,255,255,.3);content:"";pointer-events:none;transform:rotate(22deg)}
.custom-heading{position:relative;z-index:1;padding:max(72px,calc(env(safe-area-inset-top) + 58px)) 20px 24px}.custom-heading h1{max-width:calc(100% - 96px);margin:0;color:#202632;font-size:31px;line-height:1.22;letter-spacing:-.5px;overflow-wrap:anywhere}.custom-heading p{margin:10px 0 0;color:#7c8492;font-size:15px;line-height:1.55;overflow-wrap:anywhere}
.custom-body{position:relative;z-index:1;padding:0 14px max(28px,env(safe-area-inset-bottom))}.custom-single-image{overflow:visible}
.custom-media-stage{position:relative;display:grid;width:100%;height:auto;max-height:520px;aspect-ratio:var(--media-ratio,4 / 3);padding:0;overflow:hidden;border:1px solid rgba(255,255,255,.76);border-radius:22px;background:#eef0f4;box-shadow:0 8px 22px rgba(42,53,79,.07);cursor:zoom-in;place-items:center}.custom-media-stage.portrait{height:clamp(360px,116vw,520px);aspect-ratio:auto}.custom-media-backdrop{position:absolute;inset:-28px;width:calc(100% + 56px);height:calc(100% + 56px);object-fit:cover;filter:blur(28px) saturate(.7);opacity:0;transform:scale(1.08)}.custom-media-stage.portrait .custom-media-backdrop{opacity:.28}.custom-media-stage::after{position:absolute;inset:0;background:rgba(245,247,251,.12);content:"";pointer-events:none}.custom-media-stage:not(.portrait)::after{display:none}.custom-media-image{position:relative;z-index:1;display:block;min-width:0;min-height:0;max-width:100%;max-height:100%;object-fit:contain}.custom-media-stage.portrait .custom-media-image{width:100%;height:100%;object-fit:contain}.custom-media-stage:not(.portrait) .custom-media-image{width:100%;height:100%;object-fit:cover}
.custom-card{margin-top:14px;padding:19px;border:1px solid rgba(53,69,95,.055);border-radius:20px;background:#fff;box-shadow:0 7px 22px rgba(34,47,69,.065)}.custom-card h2{margin:0 0 15px;color:#202632;font-size:20px;line-height:1.3}.custom-card dl>div{display:grid;min-height:48px;align-items:center;border-bottom:1px solid #edf0f4;grid-template-columns:minmax(82px,34%) 1fr;gap:12px}.custom-card dl>div:last-child{border-bottom:0}.custom-card dt{color:#858c99;font-size:14px}.custom-card dd{color:#293143;font-size:15px;overflow-wrap:anywhere}.custom-copy{margin:0;color:#525c6d;font-size:15px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}
.custom-gallery{display:grid;margin-top:0;gap:12px}
.custom-phone{display:flex;align-items:center;gap:11px;color:#31394a;font-size:17px}.custom-phone i{display:grid;width:38px;height:38px;place-items:center;border-radius:50%;background:#eef0ff;color:#5865d7;font-style:normal}.custom-contact>button{display:flex;width:100%;height:48px;align-items:center;justify-content:center;gap:7px;margin-top:16px;border:0;border-radius:14px;background:#5b67d8;color:#fff;font-size:16px;font-weight:800;box-shadow:0 7px 16px rgba(91,103,216,.22)}.custom-body footer{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:24px;color:#9aa2af;font-size:12px}
@media(max-width:360px){.custom-heading{padding-right:18px;padding-bottom:20px;padding-left:18px}.custom-heading h1{font-size:27px}.custom-card{padding:17px}}
</style>
