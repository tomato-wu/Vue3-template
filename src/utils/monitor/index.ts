/* eslint-disable @typescript-eslint/no-empty-function */
interface IMonitor {
    start(key: string): void;
    stop(key: string): void;
}

interface ICacheItem {
    startTime: number;
}

interface IMonitorCache {
    [x: string]: ICacheItem
}

interface IMonitorTemp {
    key: string;
    duration: number
}

/**
 * 单例模式，只允许有一个Monitor实例
 * @description 监控模块，必须使用getInstance来获取实例
 */
export class Monitor implements IMonitor {
    private monitorCache: IMonitorCache = {}
    private monitorTempCache: IMonitorTemp[] = []
    private timer: any = null
    private static instance: Monitor

    // 不能调用new来生成实例
    // eslint-disable-next-line no-useless-constructor
    private constructor () {}

    // 必须使用getInstance来获取实例
    public static getInstance (): Monitor {
      if (!Monitor.instance) {
        Monitor.instance = new Monitor()
      }
      return Monitor.instance
    }

    /**
     * @description 开始监控
     * @param key 监控的键值
     */
    public start (key: string): void {
      if (key in this.monitorCache) {
        console.warn(`${key} has been monitored`)
        return
      }
      console.log('开始监控', key)
      this.monitorCache[key] = { startTime: +new Date() }
    }

    /**
     * @description 监控某键值结束，若没有该键值则不记录
     * @param key 监控的键值
     */
    public stop (key: string): void {
      if (!(key in this.monitorCache)) {
        console.warn(`${key} has not been launched monitor`)
        return
      }
      console.log('【监控】', key, +new Date() - this.monitorCache[key].startTime)

      this.monitorTempCache.push({ key, duration: +new Date() - this.monitorCache[key].startTime })
      delete this.monitorCache[key]
      this.postServer()
    }

    /**
     * 将缓存中的监控数据上传至服务器
     */
    private postServer () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // Todo: 上传服务器
      })
    }
}
