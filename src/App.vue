<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type Contact = { type: string; value: string; privacyMode: string }
type Content = Record<string, unknown> & { contact?: Contact }
type PublicPlate = {
  publicCode: string
  displayName: string
  plateType: string
  themeCode: string
  content: Content
}

const typeInfo: Record<string, { icon: string; description: string }> = {
  PET: { icon: '🐕', description: '防走失身份牌' },
  VEHICLE: { icon: '🚙', description: '隐私联系车主' },
  INSTRUCTION: { icon: '🔐', description: '设备使用说明' },
  HOME_GUIDE: { icon: '🏠', description: '入住指南与说明' },
  LOST_AND_FOUND: { icon: '🎒', description: '行李与物品联系牌' },
  MEMORIAL: { icon: '🎁', description: '故事与纪念' },
  CUSTOM: { icon: '＋', description: '专属数字铭牌' }
}

const plate = ref<PublicPlate | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const reportOpen = ref(false)
const reportCategory = ref('OTHER')
const reportDescription = ref('')
const reportSubmitting = ref(false)
const code = location.pathname.match(/\/p\/([^/?#]+)/)?.[1] || ''
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const info = computed(() => typeInfo[plate.value?.plateType || 'CUSTOM'] || typeInfo.CUSTOM)
const content = computed(() => plate.value?.content || {})
const subjectName = computed(() => String(content.value.name || content.value.title || ''))
const ownerName = computed(() => String(content.value.ownerNickname || content.value.signature || ''))
const description = computed(() => String(content.value.personality || content.value.message
  || content.value.checkInGuide || content.value.contactInstruction || content.value.introduction || ''))
const notice = computed(() => String(content.value.healthNotice || content.value.notice
  || content.value.thankYouMessage || content.value.lostMessage || ''))
const phone = computed(() => content.value.contact?.value || '')
const maskedPhone = computed(() => phone.value.replace(/^(\d{3})\d+(\d{4})$/, '$1 **** $2'))

onMounted(async () => {
  if (!code) {
    errorMessage.value = '二维码地址不正确'
    loading.value = false
    return
  }
  try {
    const response = await fetch(`${apiBase}/api/v1/tag/public/plates/${encodeURIComponent(code)}`)
    const body = await response.json()
    if (!response.ok) throw new Error(body.message || '铭牌暂时无法访问')
    plate.value = body.data
    document.title = `${body.data.displayName} · 贴个码`
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '铭牌加载失败'
  } finally {
    loading.value = false
  }
})

function callOwner() {
  if (phone.value) location.href = `tel:${phone.value}`
}

let inMemoryReportToken = ''

function createReportToken() {
  const webCrypto = globalThis.crypto
  if (webCrypto && typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID()
  }
  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    const bytes = webCrypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

function reportToken() {
  const key = 'tagcodeReportToken'
  try {
    let token = localStorage.getItem(key)
    if (!token) {
      token = createReportToken()
      localStorage.setItem(key, token)
    }
    return token
  } catch {
    if (!inMemoryReportToken) inMemoryReportToken = createReportToken()
    return inMemoryReportToken
  }
}

async function submitReport() {
  reportSubmitting.value = true
  try {
    const response = await fetch(`${apiBase}/api/v1/tag/public/plates/${encodeURIComponent(code)}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Report-Token': reportToken() },
      body: JSON.stringify({ category: reportCategory.value, description: reportDescription.value })
    })
    const body = await response.json()
    if (!response.ok) throw new Error(body.message || '举报提交失败')
    reportOpen.value = false
    reportDescription.value = ''
    alert('举报已提交，我们会尽快处理。')
  } catch (error) {
    alert(error instanceof Error ? error.message : '举报提交失败')
  } finally {
    reportSubmitting.value = false
  }
}
</script>

<template>
  <main v-if="loading" class="state-page">正在加载铭牌…</main>
  <main v-else-if="errorMessage" class="state-page error-state">
    <span>◇</span><h1>暂时无法查看</h1><p>{{ errorMessage }}</p>
  </main>
  <main v-else-if="plate" :class="['plate-page', `style-${plate.themeCode}`]">
    <section class="identity"><div class="avatar">{{ info.icon }}</div><h1>{{ plate.displayName }}</h1><p>{{ info.description }}</p></section>
    <section class="detail-card">
      <div class="section"><h2>基本信息</h2><dl><div><dt>名称</dt><dd>{{ subjectName }}</dd></div><div v-if="description"><dt>详细信息</dt><dd>{{ description }}</dd></div></dl></div>
      <div v-if="ownerName || phone" class="section"><h2>联系人信息</h2><dl><div v-if="ownerName"><dt>称呼</dt><dd>{{ ownerName }}</dd></div><div v-if="phone"><dt>联系方式</dt><dd>{{ maskedPhone }}</dd></div></dl></div>
      <div v-if="notice" class="section"><h2>注意事项</h2><p class="notice">{{ notice }}</p></div>
      <button v-if="phone" class="contact" @click="callOwner">☎ 联系主人</button>
    </section>
    <button class="report-link" @click="reportOpen = true">举报此页面</button>
    <footer>贴个码 · 让联系更简单</footer>
    <div v-if="reportOpen" class="report-mask" @click.self="reportOpen = false">
      <form class="report-sheet" @submit.prevent="submitReport">
        <h2>举报此页面</h2>
        <label>问题类型<select v-model="reportCategory"><option value="PORNOGRAPHY">色情低俗</option><option value="ILLEGAL">违法违规</option><option value="FRAUD">诈骗</option><option value="IMPERSONATION">冒用身份</option><option value="PRIVACY">隐私泄露</option><option value="SPAM">垃圾广告</option><option value="OTHER">其他</option></select></label>
        <label>补充说明<textarea v-model="reportDescription" maxlength="500" placeholder="请描述具体问题（选填）" /></label>
        <div class="report-actions"><button type="button" @click="reportOpen = false">取消</button><button type="submit" :disabled="reportSubmitting">{{ reportSubmitting ? '提交中…' : '提交举报' }}</button></div>
      </form>
    </div>
  </main>
</template>
