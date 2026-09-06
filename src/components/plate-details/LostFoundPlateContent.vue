<script setup lang="ts">
import { computed } from 'vue'
import { text, type ImageContent, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'
import ImageCarousel from '../ImageCarousel.vue'
import PlateFooter from '../PlateFooter.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
const emit = defineEmits<{ contact: []; feedback: [] }>()
const name = computed(() => text(props.content.name) || props.displayName)
const itemDescription = computed(() => text(props.content.itemDescription))
const ownerName = computed(() => text(props.content.ownerNickname) || text(props.content.ownerName))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))
const message = computed(() => text(props.content.message) || text(props.content.contactInstruction) || text(props.content.thankYouMessage))
const images = computed(() => (props.content.images || []).slice(0, 6) as ImageContent[])
</script>

<template>
  <article class="lost-found-detail">
    <header class="lost-hero">
      <button class="hero-feedback" @click="emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="lost-gallery"><ImageCarousel :images="images" :api-base="apiBase" fallback="/images/lost-found/detail-fallback-v1.jpg" :alt="`${name}的物品照片`"/></div>
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
      <PlateFooter/>
    </div>
  </article>
</template>
