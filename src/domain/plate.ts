export type Contact = { type: string; value: string; privacyMode: string }
export type ImageContent = { objectKey: string; altText?: string }

export type PlateContent = Record<string, unknown> & {
  contact?: Contact
  avatar?: ImageContent
  images?: ImageContent[]
  message?: string
  ownerName?: string
  ownerNickname?: string
  brand?: string
  summary?: string
  notice?: string
  infoItems?: Array<{ label: string; value: string; showOnPlate?: boolean }>
  tagline?: string
  contactName?: string
  textSections?: Array<{ title?: string; content: string }>
  steps?: Array<{ title: string; description?: string; images?: ImageContent[] }>
  memorialDate?: string
  theme?: string
  location?: string
  story?: string
  signature?: string
  blocks?: Array<{ type?: string; title?: string; text?: string; image?: ImageContent }>
}

export type PublicPlate = {
  publicCode: string
  displayName: string
  plateType: string
  themeCode: string
  content: PlateContent
}

export type PlateTypeInfo = { icon: string; description: string }

export const plateTypeInfo: Record<string, PlateTypeInfo> = {
  PET: { icon: '🐕', description: '防走失身份牌' },
  STUDENT: { icon: '🎓', description: '学生身份与紧急联系' },
  VEHICLE: { icon: '🚙', description: '隐私联系车主' },
  INSTRUCTION: { icon: '🔐', description: '设备使用说明' },
  HOME_GUIDE: { icon: '🏠', description: '入住指南与说明' },
  LOST_AND_FOUND: { icon: '🎒', description: '行李与物品联系牌' },
  MEMORIAL: { icon: '🎁', description: '故事与纪念' },
  CUSTOM: { icon: '＋', description: '专属数字铭牌' }
}

export function text(value: unknown) { return typeof value === 'string' ? value : '' }

export function assetUrl(path: string) {
  const base = import.meta.env.VITE_ASSET_BASE_URL || 'https://static.itchensi.com/tagcode'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export function mediaUrl(_apiBase: string, image?: ImageContent) {
  const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://media.itchensi.com'
  return image?.objectKey
    ? `${mediaBaseUrl.replace(/\/$/, '')}/${image.objectKey.replace(/^\//, '')}`
    : ''
}
