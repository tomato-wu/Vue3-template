import { createStorage } from '../cache/index'
import { IWebStorage } from '../cache/storageCache'
import { LOGGER_HOST, LOGGER_PREFIX } from '../setting'

enum LoggerType {
    Info = "info",
    Error = "error",
    Warn = "warn"
}

/**
 * @description 日志记录模块，可上报给服务器
 */
export class Logger {
    private isPostServer: boolean = false;
    private timmer: any = null;

    /**
     * @description logger构造函数
     * @param cache 缓存的机制，默认localStorage
     * @param prefix logger缓存的前缀
     * @param serverHost 上报日志的服务器
     * @param timeDebounce 防抖的时间，默认为10000ms
     */
    constructor(
        private cache: IWebStorage = createStorage(localStorage),
        private timeDebounce: number = 10000,
        private prefix: string = LOGGER_PREFIX,
        private serverHost: string = LOGGER_HOST,
    ) {
    }

    private getLoggerName(type: LoggerType): string {
        return `${this.prefix}_${type}`
    }

    /**
     * @description 监控记录
     * @param key 监控输出的日志内容
     * @param type 监控的类型
     */
    private log(key: string, type: LoggerType): void {
        const loggerCache: string[] = this.cache.get(this.getLoggerName(type), [])
        const logContent = `${key} ${+new Date()}`
        loggerCache.push(logContent)
        this.cache.set(this.getLoggerName(type), logContent)
    }

    /**
     * @description 普通日志记录
     * @param key 日志内容
     */
    public info(key: string): void {
        this.log(key, LoggerType.Info)
    }

    /**
     * @description 警告日志记录
     * @param key 日志内容
     */
    public warn(key: string): void {
        this.log(key, LoggerType.Warn)
    }

    /**
     * @description 错误日志记录
     * @param key 日志内容
     */
    public error(key: string): void {
        this.log(key, LoggerType.Error)
    }

    // 上报服务器，防抖
    private postServer(): void {
        if(!this.isPostServer || !this.serverHost) {
            return
        }
        clearTimeout(this.timmer)
        this.timmer = setTimeout(() => {
            const infoCache: string[] = this.cache.get(this.getLoggerName(LoggerType.Info), [])
            const warnCache: string[] = this.cache.get(this.getLoggerName(LoggerType.Warn), [])
            const errorCache: string[] = this.cache.get(this.getLoggerName(LoggerType.Error), [])
            // Todo: 上报服务器

            this.clearCache(LoggerType.Info)
            this.clearCache(LoggerType.Warn)
            this.clearCache(LoggerType.Error)
        }, this.timeDebounce || 10000)
    }

    /**
     * @description 清除日志
     * @param type 日志类型
     */
    public clearCache(type: LoggerType) {
        this.cache.remove(this.getLoggerName(type))
    }
}