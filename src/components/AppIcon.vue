<script setup lang="ts">
import { computed } from 'vue'
import { assetUrl } from '../domain/plate'

const props = withDefaults(defineProps<{ name: string; size?: number; filled?: boolean }>(), { size: 20, filled: false })
const sharedAssetNames = new Set(['paw', 'category', 'breed', 'male', 'female', 'gender-unknown', 'calendar', 'birthday', 'scissors', 'bell', 'user', 'phone', 'heart', 'shield', 'lost', 'message'])
const sharedAsset = computed(() => {
  if (!sharedAssetNames.has(props.name)) return ''
  const extension = ['lost', 'message'].includes(props.name) ? 'svg' : 'png'
  return assetUrl(`icons/detail-${props.name}.${extension}`)
})
</script>

<template>
  <span v-if="sharedAsset" class="app-icon app-icon-asset" :style="{ width: `${size}px`, height: `${size}px`, maskImage: `url(${sharedAsset})`, WebkitMaskImage: `url(${sharedAsset})` }" aria-hidden="true"/>
  <svg v-else class="app-icon" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'paw'"><circle cx="7" cy="7" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="5" cy="12" r="1.8"/><path d="M8 18c0-3 1.8-6 4-6s4 3 4 6c0 1.5-1.2 2.5-2.7 2.1a5 5 0 0 0-2.6 0C9.2 20.5 8 19.5 8 18Z"/></template>
    <template v-else-if="name === 'breed'"><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3Z"/><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"/></template>
    <template v-else-if="name === 'male'"><circle cx="10" cy="14" r="5"/><path d="m14 10 6-6m-4 0h4v4"/></template>
    <template v-else-if="name === 'female'"><circle cx="12" cy="9" r="5"/><path d="M12 14v7m-3-3h6"/></template>
    <template v-else-if="name === 'calendar'"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/><path d="m9 15 2 2 4-4"/></template>
    <template v-else-if="name === 'birthday'"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M12 2v2"/></template>
    <template v-else-if="name === 'scissors'"><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m8.5 8.5 11 7.5M8.5 15.5 20 8"/></template>
    <template v-else-if="name === 'bell'"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></template>
    <template v-else-if="name === 'user'"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></template>
    <template v-else-if="name === 'phone'"><path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-2-1.5 2a13 13 0 0 1-8.5-8.5L9 7 7 3Z"/></template>
    <template v-else-if="name === 'heart'"><path :fill="filled ? 'currentColor' : 'none'" d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/></template>
    <template v-else-if="name === 'shield'"><path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></template>
    <template v-else-if="name === 'feedback'"><path d="M12 3 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6l-8-3Z"/><path d="M12 8v5m0 3h.01"/></template>
    <template v-else-if="name === 'car'"><path d="m5 11 1.8-5h10.4l1.8 5"/><path d="M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2Z"/><circle cx="6" cy="14" r="1"/><circle cx="18" cy="14" r="1"/><path d="M4 17v3h3v-3m10 0v3h3v-3"/></template>
    <template v-else-if="name === 'location'"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></template>
    <template v-else-if="name === 'lost'"><path d="M5 8.5V7a2 2 0 0 1 2-2h3l1.4-1.4a2 2 0 0 1 2.8 0L15.6 5H17a2 2 0 0 1 2 2v1.5"/><rect x="3" y="8.5" width="18" height="12" rx="3"/><path d="M3 13h18M8 8.5v4.5m8-4.5V13"/></template>
    <template v-else-if="name === 'message'"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-1-1.7V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8m-8 4h5"/></template>
    <template v-else-if="name === 'lock'"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></template>
    <template v-else-if="name === 'key'"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 4h3v3M5 18l-2 2m5-2-2 3"/></template>
    <template v-else-if="name === 'steps'"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><path d="M7 6h5a3 3 0 0 1 3 3v6M7 18h10M17 15l3 3-3 3"/></template>
    <template v-else-if="name === 'warning'"><path d="M10.3 4.2 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></template>
    <template v-else-if="name === 'image'"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-5 4 4 2-2 5 5"/></template>
    <template v-else-if="name === 'edit'"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4M3 21h18"/></template>
    <template v-else-if="name === 'info'"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></template>
  </svg>
</template>

<style scoped>.app-icon{display:inline-block;flex:none;vertical-align:middle}.app-icon-asset{background:currentColor;mask-position:center;mask-repeat:no-repeat;mask-size:contain;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:contain}</style>
