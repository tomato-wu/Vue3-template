/**
 * @description: 开发模式
 */
export const devMode = 'development'

/**
  * @description: 生产模式
  */
export const proMode = 'production'

export const getEnv = (): string => process.env.MODE || ''

/**
  * @description: 判断是否开发模式
  */
export const isDevMode = (): boolean => import.meta.env.DEV

/**
  * @description: 判断是否生产模式
  */
export const isProMode = (): boolean => import.meta.env.PROD

/**
  * @description: 开发模式baseurl
  */
// @ts-ignore
export const devUrl: string = import.meta.env.VITE_URL || ''

/**
  * @description: 生产模式baseurl
  */
// @ts-ignore
export const proUrl: string = import.meta.env.VITE_URL || ''

/**
 * 上传文件地址
 */
// @ts-ignore
export const uploadUrl: string = import.meta.env.VITE_UPLOAD_PREFIX || ''

/**
 * @description: prefix
 */
// @ts-ignore
export const prefix: string = import.meta.env.VITE_PREFIX || ''
