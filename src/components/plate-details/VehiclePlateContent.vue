<script setup lang="ts">
import { computed } from 'vue'
import { mediaUrl, text, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()

const plateNumber = computed(() => text(props.content.name) || props.displayName)
const vehicleNote = computed(() => text(props.content.model))
const color = computed(() => text(props.content.color))
const message = computed(() => text(props.content.message))
const note = computed(() => text(props.content.note))
const photo = computed(() => mediaUrl(props.apiBase, props.content.photo as { objectKey: string; altText?: string } | undefined))
const phone = computed(() => props.content.contact?.value || '')
</script>

<template>
  <article class="vehicle-detail">
    <header class="vehicle-hero">
      <button class="vehicle-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="vehicle-status"><span></span>临时停车</div>
      <div class="vehicle-icon"><AppIcon name="car" :size="42"/></div>
      <p>如有不便，烦请联系车主</p>
      <h1>{{ plateNumber }}</h1>
      <div v-if="vehicleNote || color" class="vehicle-meta">
        <span v-if="vehicleNote">{{ vehicleNote }}</span><span v-if="color">{{ color }}</span>
      </div>
    </header>

    <div class="vehicle-content">
      <section v-if="photo" class="vehicle-photo-card"><img :src="photo" :alt="`${plateNumber}的车辆照片`"></section>
      <section v-if="message" class="vehicle-message-card">
        <div class="message-mark">“</div>
        <div><small>车主提示</small><p>{{ message }}</p></div>
      </section>

      <section v-if="note" class="vehicle-note-card">
        <small>备注</small><p>{{ note }}</p>
      </section>

      <section class="vehicle-contact-card">
        <div class="contact-heading">
          <i><AppIcon name="phone" :size="21"/></i>
          <div><h2>联系车主</h2><p>{{ phone ? '号码将通过系统安全拨出' : '车主暂未留下联系电话' }}</p></div>
        </div>
        <button v-if="phone" @click="$emit('contact')"><AppIcon name="phone" :size="20"/>立即联系车主</button>
      </section>

      <div class="vehicle-safety"><AppIcon name="shield" :size="17"/><div><strong>隐私保护</strong><span>页面不会直接公开完整手机号码</span></div></div>
      <footer>贴个码 · 让联系更简单</footer>
    </div>

    <div v-if="phone" class="vehicle-sticky"><button @click="$emit('contact')"><AppIcon name="phone" :size="21"/>联系车主</button></div>
  </article>
</template>
