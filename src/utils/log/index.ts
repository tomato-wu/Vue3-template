import { createStorage } from '../cache'
import { Logger } from './createLogger'

const logger: Logger = new Logger(createStorage(localStorage), 60000)

/**
 * @description 默认日志缓存机制为localStorage，防抖时间为60000ms
 */
export default logger