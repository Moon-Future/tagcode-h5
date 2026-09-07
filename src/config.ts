export type EnvironmentName = 'development' | 'trial' | 'production'
export type MiniProgramEnvVersion = 'develop' | 'trial' | 'release'

export interface EnvironmentConfig {
  apiBaseUrl: string
  miniProgramEnvVersion: MiniProgramEnvVersion
}

// 手动切换此变量；API 地址与要打开的小程序版本会一起切换。
export const environmentName: EnvironmentName = 'development'

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  development: {
    apiBaseUrl: '',
    miniProgramEnvVersion: 'develop'
  },
  trial: {
    apiBaseUrl: '',
    miniProgramEnvVersion: 'trial'
  },
  production: {
    apiBaseUrl: 'https://api.itchensi.com',
    miniProgramEnvVersion: 'release'
  }
}

export const environment: EnvironmentConfig = environments[environmentName]
