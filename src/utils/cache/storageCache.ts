import { isNullOrUnDef } from '../is'

export interface IWebStorage {
    set(key: string, value: any, expire?: number | null): void;
    get(key: string, def?: any): any;
    remove(key: string): void;
    clear(): void;
}

export interface EncryptionParams {
    key?: string;
    iv?: string;
}

export interface CreateStorageParams extends EncryptionParams {
    prefixKey: string;
    storage: Storage;
    hasEncrypt: boolean;
    timeout?: Nullable<number>;
}

export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  timeout = null
}: Partial<CreateStorageParams> = {}) => {
  const WebStorage = class WebStorage implements IWebStorage {
        private storage: Storage;
        private prefixKey?: string;

        constructor () {
          this.storage = storage
          this.prefixKey = prefixKey
        }

        private getKey (key: string) {
          return `${this.prefixKey}${key}`.toUpperCase()
        }

        /**
         * @description 设置缓存
         * @param key 存储的键值
         * @param value 存储的值
         * @param expire 超时时间
         */
        set (key: string, value: any, expire: number | null = timeout): void {
          const stringData = JSON.stringify({
            value,
            time: Date.now(),
            expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
          })
          this.storage.setItem(this.getKey(key), stringData)
        }

        /**
         * @description 取出缓存
         * @param key 获取缓存的键值
         * @param def 若返回的值不满足要求则返回该值
         */
        get (key: string, def: any = null): any {
          const val = this.storage.getItem(this.getKey(key))
          if (!val) return def
          const data = JSON.parse(val)
          const { value, expire } = data
          // 没有设置超时或还未超时
          if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
            return value ?? def
          }
          return def
        }

        /**
         * @description 移除缓存的某键值及对应的值
         * @param key 移除的键值
         */
        remove (key: string): void {
          this.storage.removeItem(this.getKey(key))
        }

        clear (): void {
          this.storage.clear()
        }
  }
  return new WebStorage()
}
