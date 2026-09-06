<script setup lang="ts">
import { computed } from 'vue'
import { text, type PlateContent, type PlateTypeInfo } from '../../domain/plate'
import PlateFooter from '../PlateFooter.vue'

const props = defineProps<{ content: PlateContent; info: PlateTypeInfo; displayName: string }>()
defineEmits<{ contact: []; feedback: [] }>()
const subjectName = computed(() => text(props.content.name) || text(props.content.title))
const ownerName = computed(() => text(props.content.ownerNickname) || text(props.content.signature))
const description = computed(() => text(props.content.message) || text(props.content.checkInGuide) || text(props.content.contactInstruction) || text(props.content.introduction))
const notice = computed(() => text(props.content.notice) || text(props.content.thankYouMessage))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))
</script>

<template>
  <article class="generic-detail">
    <nav class="generic-nav"><button @click="$emit('feedback')">反馈信息</button></nav>
    <section class="identity"><div class="avatar">{{ info.icon }}</div><h1>{{ displayName }}</h1><p>{{ info.description }}</p></section>
    <section class="content-card"><h2><i>{{ info.icon }}</i>基本信息</h2><dl><div v-if="subjectName"><dt>名称：</dt><dd>{{ subjectName }}</dd></div><div v-if="description"><dt>详细信息：</dt><dd>{{ description }}</dd></div><div v-if="ownerName"><dt>联系人：</dt><dd>{{ ownerName }}</dd></div><div v-if="phone"><dt>联系方式：</dt><dd>{{ maskedPhone }}</dd></div></dl><div v-if="notice" class="generic-notice"><strong>注意事项</strong><p>{{ notice }}</p></div></section>
    <button v-if="phone" class="bottom-contact" @click="$emit('contact')">💬 联系主人</button>
    <PlateFooter/>
  </article>
</template>
