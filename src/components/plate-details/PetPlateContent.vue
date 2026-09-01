<script setup lang="ts">
import { computed } from 'vue'
import { mediaUrl, text, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

type LostInfo = { active?: boolean; lostAt?: string; location?: string; featureNote?: string; message?: string }

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()

const defaultAvatar = '/images/defaults/pet-avatar.png'
const defaultBackground = '/images/defaults/pet-background.jpg'

const name = computed(() => text(props.content.name) || props.displayName)
const avatarUrl = computed(() => mediaUrl(props.apiBase, props.content.avatar))
const backgroundUrl = computed(() => mediaUrl(props.apiBase, props.content.backgroundImage as { objectKey: string } | undefined))
const ownerName = computed(() => text(props.content.ownerNickname))
const phone = computed(() => props.content.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2'))
const breed = computed(() => text(props.content.breed))
const species = computed(() => text(props.content.species) === '犬' ? '狗' : text(props.content.species))
const gender = computed(() => text(props.content.gender))
const genderLabel = computed(() => gender.value === '公' ? '公' : gender.value === '母' ? '母' : gender.value)
const genderIcon = computed(() => gender.value === '公' ? 'male' : gender.value === '母' ? 'female' : '')
const neuteredLabel = computed(() => props.content.neuteredStatus === 'NEUTERED'
  ? '已绝育' : props.content.neuteredStatus === 'NOT_NEUTERED' ? '未绝育' : '')
const birthDate = computed(() => text(props.content.birthDate))
const age = computed(() => {
  if (!birthDate.value) return ''
  const birth = new Date(`${birthDate.value}T00:00:00`)
  if (Number.isNaN(birth.getTime()) || birth > new Date()) return ''
  const now = new Date()
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
  if (now.getDate() < birth.getDate()) months -= 1
  if (months < 12) return `${Math.max(0, months)}个月`
  const years = Math.floor(months / 12)
  const remainder = months % 12
  return remainder ? `${years}岁${remainder}个月` : `${years}岁`
})
const reminder = computed(() => text(props.content.reminder) || text(props.content.healthNotice)
  || text(props.content.personality) || text(props.content.lostMessage))
const reminderLines = computed(() => reminder.value.split(/\n+/).map(line => line.trim()).filter(Boolean))
const lost = computed(() => (props.content.lost || {}) as LostInfo)
const isLost = computed(() => Boolean(lost.value.active))
const lostAtText = computed(() => text(lost.value.lostAt).replace('T', ' ').slice(0, 16))
const summaryItems = computed(() => [breed.value || species.value, genderLabel.value, age.value].filter(Boolean))
const basicItems = computed(() => [
  { icon: 'paw', label: '宠物类别', value: species.value },
  { icon: 'breed', label: '品种', value: breed.value },
  { icon: genderIcon.value || 'paw', label: '性别', value: genderLabel.value },
  { icon: 'calendar', label: '年龄', value: age.value },
  { icon: 'birthday', label: '生日', value: birthDate.value },
  { icon: 'scissors', label: '是否绝育', value: neuteredLabel.value }
].filter(item => item.value))

function useFallback(event: Event, fallback: string) {
  const image = event.currentTarget as HTMLImageElement
  if (!image.src.endsWith(fallback)) image.src = fallback
}
</script>

<template>
  <article class="pet-detail">
    <header class="pet-hero">
      <img class="hero-image" :src="backgroundUrl || defaultBackground" alt="宠物背景" @error="useFallback($event, defaultBackground)">
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
    </header>

    <div class="pet-content-wrap">
      <section class="pet-summary-card">
        <img class="summary-avatar" :src="avatarUrl || defaultAvatar" :alt="`${name}的头像`" @error="useFallback($event, defaultAvatar)">
        <div class="summary-main">
          <div class="pet-name-line"><h1>{{ name }}</h1><AppIcon v-if="genderIcon" :name="genderIcon" class="gender-symbol" :size="20"/><strong v-if="isLost">走失中</strong></div>
          <div v-if="summaryItems.length" class="summary-meta"><span v-for="item in summaryItems" :key="item">{{ item }}</span></div>
        </div>
        <button v-if="phone && isLost" class="summary-call" @click="$emit('contact')"><AppIcon name="phone" :size="18"/>拨打电话　{{ maskedPhone }}</button>
        <p v-if="phone && isLost" class="found-tip">如已找到，请及时联系主人，非常感谢！ <AppIcon name="heart" :size="13"/></p>
      </section>

      <section v-if="basicItems.length" class="pet-card basic-card">
        <h2><i><AppIcon name="paw" :size="18"/></i>基本信息</h2>
        <div class="basic-grid"><div v-for="item in basicItems" :key="item.label"><i><AppIcon :name="item.icon" :size="17"/></i><p><small>{{ item.label }}</small><strong>{{ item.value }}</strong></p></div></div>
      </section>

      <section v-if="reminderLines.length" class="pet-card reminder-card">
        <h2><i><AppIcon name="bell" :size="18"/></i>与我相处时请注意</h2>
        <ul><li v-for="(item, index) in reminderLines" :key="`${index}-${item}`"><span>{{ item }}</span></li></ul>
      </section>

      <section v-if="ownerName || phone" class="pet-card owner-card">
        <h2><i><AppIcon name="user" :size="18"/></i>我的主人</h2>
        <div class="owner-content"><div class="owner-avatar"><AppIcon name="user" :size="24"/></div><div><strong v-if="ownerName">{{ ownerName }}</strong><p>如果您看到我，请尽快联系我的主人，非常感谢您的帮助！</p></div><button v-if="phone" @click="$emit('contact')"><AppIcon name="phone" :size="16"/>拨打电话　{{ maskedPhone }}</button></div>
      </section>

      <section v-if="isLost" class="lost-card">
        <div class="lost-intro"><h2><AppIcon name="heart" :size="17" filled/>我可能走失了</h2><p>{{ lost.message || '如果你发现我独自在外，请帮我联系主人。' }}</p></div>
        <dl><div v-if="lostAtText"><dt>走失时间：</dt><dd>{{ lostAtText }}</dd></div><div v-if="lost.location"><dt>走失地点：</dt><dd>{{ lost.location }}</dd></div><div v-if="lost.featureNote"><dt>特征备注：</dt><dd>{{ lost.featureNote }}</dd></div></dl>
      </section>

      <footer class="trust-footer"><b><AppIcon name="shield" :size="20"/></b><span>贴个码<br><small>扫码查看 · 可信信息</small></span></footer>
    </div>
  </article>
</template>
