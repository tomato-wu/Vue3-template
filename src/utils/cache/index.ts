import { createStorage as create, CreateStorageParams } from './storageCache'

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    storage,
    ...options
  }
}

/**
 * @description 默认使用localStorage
 */
export const WebStorage = create(createOptions(localStorage))

export default WebStorage

/**
 * @description 创建缓存服务
 * @param storage 缓存的类型：可选localStorage和sessionStorage
 * @param options 配置的参数
 */
export const createStorage = (storage: Storage = localStorage, options: Options = {}) => {
  return create(createOptions(storage, options))
}
