<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaUrl, text, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'
import PlateFooter from '../PlateFooter.vue'
import ImageViewer from '../ImageViewer.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()
const name = computed(() => text(props.content.name) || props.displayName)
const avatar = computed(() => mediaUrl(props.apiBase, props.content.avatar))
const avatarPreview = ref(false)
const school = computed(() => text(props.content.school))
const grade = computed(() => text(props.content.grade))
const className = computed(() => text(props.content.className))
const guardian = computed(() => text(props.content.guardianName))
const notice = computed(() => {
  const value = text(props.content.notice)
  return value === '扫码查看紧急联系信息' ? '' : value
})
const phone = computed(() => props.content.contact?.value || '')
</script>

<template>
  <article class="student-detail">
    <header class="student-hero">
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="student-avatar"><img :src="avatar || '/images/student/default-avatar.png'" :alt="`${name}的头像`" @click="avatarPreview=Boolean(avatar)"></div>
      <h1>{{ name }}</h1>
    </header>
    <div class="student-content">
      <section class="student-info-card">
        <h2><i><AppIcon name="user" :size="18"/></i>学生信息</h2>
        <dl><div><dt>姓名：</dt><dd>{{ name }}</dd></div><div v-if="school"><dt>学校：</dt><dd>{{ school }}</dd></div><div v-if="grade"><dt>年级：</dt><dd>{{ grade }}</dd></div><div v-if="className"><dt>班级：</dt><dd>{{ className }}</dd></div></dl>
      </section>
      <section v-if="guardian || phone" class="student-info-card guardian-card">
        <h2><i><AppIcon name="user" :size="18"/></i>家长信息</h2>
        <dl><div v-if="guardian"><dt>联系人：</dt><dd>{{ guardian }}</dd></div><div v-if="phone"><dt>联系方式：</dt><dd>如需联系，请点击下方按钮</dd></div></dl>
        <button v-if="phone" @click="$emit('contact')">联系家长</button>
      </section>
      <section v-if="notice" class="student-info-card compact-card">
        <h2><i><AppIcon name="bell" :size="18"/></i>提示语</h2><p>{{ notice }}</p>
      </section>
      <p v-if="!guardian && !phone" class="student-no-contact">铭牌主人暂未设置紧急联系方式</p>
      <PlateFooter/>
    </div>
    <div v-if="phone" class="student-sticky"><button @click="$emit('contact')"><AppIcon name="phone" :size="21"/>联系家长</button></div>
    <ImageViewer v-if="avatarPreview&&avatar" :urls="[avatar]" :alt="`${name}的头像`" @close="avatarPreview=false"/>
  </article>
</template>
