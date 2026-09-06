<script setup lang="ts">
import { computed } from 'vue'
import { mediaUrl, text, type PlateContent } from '../../domain/plate'
import AppIcon from '../AppIcon.vue'
import ImageCarousel from '../ImageCarousel.vue'
import PlateFooter from '../PlateFooter.vue'

const props = defineProps<{ content: PlateContent; displayName: string; apiBase: string }>()
defineEmits<{ contact: []; feedback: [] }>()

const plateNumber = computed(() => text(props.content.name) || props.displayName)
const vehicleNote = computed(() => text(props.content.model))
const note = computed(() => text(props.content.note))
const ownerName = computed(() => text(props.content.ownerName) || text(props.content.ownerNickname))
const images = computed(() => Array.isArray(props.content.images) ? props.content.images : [])
const phone = computed(() => props.content.contact?.value || '')
const isElectric = computed(() => Array.from(plateNumber.value.replace(/\s/g, '')).length > 7)
const plateClass = computed(() => isElectric.value ? 'vehicle-plate-electric' : 'vehicle-plate-fuel')
const defaultPhoto = '/images/vehicle/default-car.svg'
</script>

<template>
  <article class="vehicle-detail">
    <header class="vehicle-hero">
      <button class="hero-feedback" @click="$emit('feedback')"><AppIcon name="feedback" :size="15"/>反馈信息</button>
      <div class="vehicle-photo">
        <ImageCarousel :images="images" :api-base="apiBase" :fallback="defaultPhoto" :alt="`${plateNumber}的车辆照片`"/>
      </div>
    </header>

    <div class="vehicle-content">
      <section :class="['vehicle-plate-card', plateClass]">
        <div class="vehicle-plate-frame">
          <div class="vehicle-plate-number">{{ plateNumber || '粤A·12345' }}</div>
        </div>
      </section>

      <section v-if="plateNumber || vehicleNote" class="vehicle-info-card">
        <h2><i><AppIcon name="car" :size="20"/></i>车辆信息</h2>
        <dl><div v-if="plateNumber"><dt>车牌号</dt><dd>{{ plateNumber }}</dd></div><div v-if="vehicleNote"><dt>车辆备注</dt><dd>{{ vehicleNote }}</dd></div></dl>
      </section>

      <section v-if="ownerName || phone" class="vehicle-info-card">
        <h2><i><AppIcon name="user" :size="20"/></i>车主信息</h2>
        <dl><div v-if="ownerName"><dt>联系人</dt><dd>{{ ownerName }}</dd></div><div v-if="phone"><dt>联系方式</dt><dd>如需联系，请点击下方按钮</dd></div></dl>
      </section>

      <section v-if="note" class="vehicle-info-card vehicle-tip-card">
        <h2><i><AppIcon name="bell" :size="20"/></i>挪车提示</h2>
        <p>{{ note }}</p>
      </section>

      <PlateFooter/>
    </div>

    <div v-if="phone" class="vehicle-sticky"><button @click="$emit('contact')"><AppIcon name="phone" :size="21"/>联系车主</button></div>
  </article>
</template>
