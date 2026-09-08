export type EnvironmentName = 'development' | 'trial' | 'production'

export interface EnvironmentConfig {
  apiBaseUrl: string
}

// 手动切换此变量以使用对应环境的 API 地址。
export const environmentName: EnvironmentName = 'development'

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  development: {
    apiBaseUrl: ''
  },
  trial: {
    apiBaseUrl: ''
  },
  production: {
    apiBaseUrl: 'https://api.itchensi.com'
  }
}

export const environment: EnvironmentConfig = environments[environmentName]
