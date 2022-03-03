import { isDevMode, devUrl, proUrl, prefix } from './env'

/**
 * @description: Base Url
 */
export const APIURL = isDevMode() ? devUrl : proUrl

/**
 * @description: API prefix
 */
export const PREFIX = prefix

/**
 * @description 日志前缀和上报的服务器
 */
export const LOGGER_PREFIX = 'Vue3Logger'
export const LOGGER_HOST = ''
