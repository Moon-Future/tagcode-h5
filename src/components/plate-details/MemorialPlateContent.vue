<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type ImageContent, type PlateContent, type PlateTypeInfo } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

const props = defineProps<{ content: PlateContent; info: PlateTypeInfo; displayName: string; apiBase: string }>()
defineEmits<{ feedback: [] }>()

const previewIndex = ref<number | null>(null)
const title = computed(() => text(props.content.title) || props.displayName)
const photos = computed(() => (Array.isArray(props.content.photos) ? props.content.photos : []) as ImageContent[])
const date = computed(() => text(props.content.memorialDate))
const location = computed(() => text(props.content.location))
const datePlace = computed(() => [date.value, location.value].filter(Boolean).join(' · '))
const message = computed(() => text(props.content.message))
const story = computed(() => text(props.content.story))
const signature = computed(() => text(props.content.signature))
const previewPhoto = computed(() => previewIndex.value === null ? null : photos.value[previewIndex.value])

function openPreview(index: number) {
  previewIndex.value = index
}
</script>

<template>
  <article class="memorial-detail">
    <header class="memorial-hero">
      <img v-if="photos[0]" :src="mediaUrl(apiBase, photos[0])" :alt="title">
      <div v-else class="memorial-fallback"><AppIcon name="heart" :size="58"/></div>
      <div class="memorial-hero-shade" />
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <span v-if="photos.length" class="memorial-photo-count">1/{{ photos.length }}</span>
    </header>

    <main class="memorial-body">
      <section class="memorial-heading">
        <h1>{{ title }}</h1>
        <p v-if="datePlace" class="memorial-meta">
          <span v-if="date"><AppIcon name="calendar" :size="15"/>{{ date }}</span>
          <span v-if="location"><AppIcon name="location" :size="15"/>{{ location }}</span>
        </p>
        <blockquote v-if="message">“ {{ message }} ”</blockquote>
      </section>

      <section v-if="story" class="memorial-card memorial-story-card">
        <h2><i><AppIcon name="message" :size="17"/></i>纪念故事</h2>
        <p>{{ story }}</p>
      </section>

      <section v-if="photos.length > 1" class="memorial-card memorial-gallery-card">
        <h2><i><AppIcon name="image" :size="17"/></i>照片回忆</h2>
        <div class="memorial-gallery-grid">
          <button v-for="(photo, index) in photos" :key="photo.objectKey || index" type="button" @click="openPreview(index)">
            <img :src="mediaUrl(apiBase, photo)" :alt="photo.altText || `${title}的照片`">
          </button>
        </div>
      </section>

      <section v-if="signature" class="memorial-card memorial-signature-card">
        <h2><i><AppIcon name="edit" :size="17"/></i>落款</h2>
        <p><span />{{ signature }}</p>
      </section>

      <footer class="memorial-ending">此页面由「贴个码」小程序生成 <AppIcon name="heart" :size="13" filled/></footer>
    </main>

    <button v-if="previewPhoto" class="memorial-preview" type="button" aria-label="关闭照片预览" @click="previewIndex = null">
      <img :src="mediaUrl(apiBase, previewPhoto)" :alt="title">
    </button>
  </article>
</template>

<style scoped>
.memorial-detail{width:min(100%,422px);min-height:100vh;margin:0 auto;overflow:hidden;background:#fbf6ef;color:#4b332b;box-shadow:0 0 35px rgba(72,57,44,.12)}
.memorial-hero{position:relative;height:min(76vw,320px);min-height:0;overflow:hidden;background:#d7c4b2;clip-path:ellipse(160% 100% at 50% 0);-webkit-clip-path:ellipse(160% 100% at 50% 0)}.memorial-hero>img{display:block;width:100%;height:100%;object-fit:cover}.memorial-hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(34,23,17,.05),rgba(34,23,17,0) 78%,rgba(34,23,17,.04))}.memorial-fallback{display:grid;width:100%;height:100%;place-items:center;background:linear-gradient(145deg,#e8c4b1,#b98975);color:rgba(255,255,255,.7)}
.memorial-photo-count{position:absolute;z-index:3;right:18px;bottom:24px;padding:6px 10px;border-radius:999px;background:rgba(34,26,22,.55);color:#fff;font-size:12px;backdrop-filter:blur(6px)}
.memorial-body{position:relative;z-index:3;margin-top:-1px;padding:0 14px max(30px,env(safe-area-inset-bottom))}.memorial-heading{position:static;right:auto;bottom:auto;left:auto;padding:4px 12px 21px;color:inherit;text-align:center}.memorial-heading h1{margin:0;color:#4b2e25;font-family:"Songti SC","STSong",serif;font-size:31px;font-weight:700;line-height:1.3}.memorial-meta{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px 12px;margin:12px 0 0;color:#b56e64;font-size:14px}.memorial-meta span{display:inline-flex;align-items:center;gap:5px}.memorial-heading blockquote{margin:15px 0 0;color:#bd776c;font-family:"Kaiti SC","STKaiti",serif;font-size:18px;line-height:1.65}
.memorial-card{margin-top:12px;padding:18px;border:1px solid rgba(151,100,74,.08);border-radius:18px;background:rgba(255,255,255,.86);box-shadow:0 7px 20px rgba(105,70,50,.08)}.memorial-card h2{display:flex;align-items:center;gap:10px;margin:0 0 13px;color:#4c332b;font-family:"Songti SC","STSong",serif;font-size:20px}.memorial-card h2 i{display:grid;width:35px;height:35px;place-items:center;flex:0 0 35px;border-radius:50%;background:#faebe5;color:#cb8277;font-style:normal}.memorial-story-card>p{margin:0;color:#65514a;font-family:"Songti SC","STSong",serif;font-size:15px;line-height:1.9;white-space:pre-wrap}
.memorial-gallery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.memorial-gallery-grid button{height:128px;padding:0;overflow:hidden;border:0;border-radius:11px;background:#eadfd7;cursor:zoom-in}.memorial-gallery-grid img{display:block;width:100%;height:100%;object-fit:cover}.memorial-gallery-grid button:last-child:nth-child(odd){height:190px;grid-column:1/-1}
.memorial-signature-card{padding-top:16px;padding-bottom:17px}.memorial-signature-card h2{margin-bottom:7px}.memorial-signature-card p{display:flex;align-items:center;justify-content:center;gap:9px;margin:0;color:#5f4941;font-family:"Kaiti SC","STKaiti",serif;font-size:16px}.memorial-signature-card p span{width:28px;height:1px;background:#b99783}.memorial-ending{display:flex;align-items:center;justify-content:center;flex-direction:row;gap:5px;margin-top:25px;color:#c0a99d;font-size:11px;letter-spacing:.5px}
.memorial-preview{position:fixed;z-index:30;inset:0;display:grid;width:100%;height:100%;padding:18px;border:0;background:rgba(20,15,12,.92);place-items:center}.memorial-preview img{display:block;max-width:100%;max-height:100%;object-fit:contain}
@media (max-width:380px){.memorial-heading h1{font-size:28px}.memorial-gallery-grid button{height:116px}}
</style>
