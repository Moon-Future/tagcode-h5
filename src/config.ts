export type EnvironmentName = 'development' | 'production'

// 手动切换此变量；API 地址与要打开的小程序版本会一起切换。
export const environmentName: EnvironmentName = 'development'

const environments = {
  development: {
    apiBaseUrl: '',
    miniProgramEnvVersion: 'develop'
  },
  production: {
    apiBaseUrl: 'https://api.itchensi.com',
    miniProgramEnvVersion: 'release'
  }
} as const

export const environment = environments[environmentName]
