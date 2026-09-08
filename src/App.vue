<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { detailComponentFor } from './components/plate-details'
import { plateTypeInfo, type PublicPlate } from './domain/plate'
import { environment } from './config'

const plate = ref<PublicPlate | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const unactivated = ref(false)
const reportOpen = ref(false)
const reportCategory = ref('OTHER')
const reportDescription = ref('')
const reportSubmitting = ref(false)
const code = location.pathname.match(/\/p\/([^/?#]+)/)?.[1] || ''
const apiBase = environment.apiBaseUrl.replace(/\/$/, '')

const info = computed(() => plateTypeInfo[plate.value?.plateType || 'CUSTOM'] || plateTypeInfo.CUSTOM)
const content = computed(() => plate.value?.content || {})
const phone = computed(() => content.value.contact?.value || '')
const detailComponent = computed(() => detailComponentFor(plate.value?.plateType || 'CUSTOM'))

async function readApiBody(response: Response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(response.ok ? '服务返回格式异常' : text)
  }
}

onMounted(async () => {
  if (!code) {
    errorMessage.value = '二维码地址不正确'
    loading.value = false
    return
  }
  try {
    const response = await fetch(`${apiBase}/api/v1/tag/public/plates/${encodeURIComponent(code)}`)
    const body = await readApiBody(response)
    if (!response.ok) {
      if (body.code === 'TAG_PLATE_UNACTIVATED') unactivated.value = true
      throw new Error(body.message || '铭牌暂时无法访问')
    }
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
    const body = await readApiBody(response)
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
  <main v-else-if="unactivated" class="state-page claim-state">
    <section class="claim-shell">
      <div class="claim-brand"><span></span>贴个码 · 实体铭牌</div>
      <div class="claim-visual"><div class="claim-halo"></div><img src="/images/states/empty-plate.png" alt=""></div>
      <div class="claim-copy">
        <small>READY TO ACTIVATE</small>
        <h1>这枚铭牌<br><em>等待你的认领</em></h1>
        <p>认领后即可绑定到你的微信账号，并填写专属资料。</p>
      </div>
      <div class="claim-code"><span>铭牌编号</span><strong>{{ code }}</strong></div>
      <div class="mini-program-guide">
        <img src="/images/mini-program-logo.png" alt="贴个码铭牌小程序图标">
        <div><small>请进入小程序</small><strong>“贴个码铭牌”</strong><span>进行领取激活</span></div>
      </div>
      <footer>每枚实体铭牌仅可被一个账号认领</footer>
    </section>
  </main>
  <main v-else-if="errorMessage" class="state-page error-state">
    <img class="empty-state-icon" src="/images/states/empty-plate.png" alt=""><h1>暂时无法查看</h1><p>{{ errorMessage }}</p>
  </main>
  <main v-else-if="plate" :class="['plate-page', `style-${plate.themeCode}`, `type-${plate.plateType.toLowerCase()}`]">
    <component :is="detailComponent" :content="content" :info="info" :display-name="plate.displayName" :api-base="apiBase" @contact="callOwner" @feedback="reportOpen = true" />
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
