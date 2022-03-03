// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { CreateAxiosOptions, RequestOptions, Result } from './types'

import { VAxios } from './axios'

import { AxiosTransform } from './axiosTransform'
import { RequestEnum, ResultEnum, ContentTypeEnum } from '../../enum/httpEnum'

import { isString } from '../../utils/is'

import { setObjToUrlParams, deepMerge } from '../util'

import { errorResult } from './const'
import { APIURL, PREFIX } from '../setting'
import { useMessage } from '../useMessage'
import { stringify } from '../qs'
import { start, done } from 'nprogress'

const { createMessage, createErrorModal } = useMessage()

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理网络请求返回的数据
   * @param {Result} res  网络请求响应
   * @param {RequestOptions} options  可配置的选项，其中 isTransformRequestResult 代表是否处理数据
   */
  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    setTimeout(() => {
      done() // 进度条加载完成
    }, 100)
    const { isTransformRequestResult } = options
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformRequestResult) {
      return res.data
    }
    // 错误的时候返回

    if (!res.data) {
      // return '[HTTP] Request has no return value';
      return errorResult
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, data, message } = res.data

    /**
     * @description 根据项目自行修改逻辑
     */
    const hasSuccess = code && code === ResultEnum.SUCCESS
    if (!hasSuccess) {
      if (message) {
        // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
        if (options.errorMessageMode === 'modal') {
          createErrorModal({ title: '错误提示', content: message })
        } else {
          createMessage.error(message)
        }
      }
      return Promise.reject(res.data)
    }

    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
      return data || {}
    }
    // 接口请求错误，统一提示错误信息
    if (code === ResultEnum.ERROR) {
      if (message) {
        createMessage.error(data.message)
        Promise.reject(new Error(message))
      } else {
        const msg = '操作失败,系统异常!'
        createMessage.error(msg)
        Promise.reject(new Error(msg))
      }
      return errorResult
    }
    // 登录超时
    if (code === ResultEnum.TIMEOUT) {
      const timeoutMsg = '登录超时,请重新登录!'
      createErrorModal({
        title: '操作失败',
        content: timeoutMsg
      })
      Promise.reject(new Error(timeoutMsg))
      return errorResult
    }
    return errorResult
  },

  /**
   * @description 请求前钩子函数
   * @param config 请求的配置
   * @param options 配置的选项
   * @returns {AxiosRequestConfig} 处理后的请求配置
   */
  beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions): AxiosRequestConfig => {
    start() // 进度条加载
    const { apiUrl, joinPrefix, joinParamsToUrl } = options

    // 是否加入前缀
    if (joinPrefix) {
      config.url = `${PREFIX}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    // GET请求时修改url
    if (config.method === RequestEnum.GET) {
      const now = new Date().getTime()
      if (!isString(config.params)) {
        config.data = {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          params: Object.assign(config.params || {}, {
            _t: now
          })
        }
      } else {
        // 兼容restful风格
        config.url = config.url + '?' + config.params + `?_t=${now}`
        config.params = undefined
      }
    } else if (config.method === RequestEnum.POST) {
      if (!isString(config.params)) {
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data)
        }
      } else {
        // 兼容restful风格
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理,最后请求前的拦截处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    if (config.headers['Content-Type'] && config.headers['Content-Type'] === ContentTypeEnum.FORM_URLENCODED) {
      config.data = stringify(config.data)
    }
    return config
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    // errorStore.setupErrorHandle(error);
    const { message } = error || {}
    // const msg: string = response && response.data && response.data.error ? response.data.error.message : '';
    const err: string = error.toString()

    try {
      if (err.includes('404')) {
        createMessage.error('当前请求接口不存在，请联系管理员')
      }
      if (message && message.indexOf('timeout') !== -1) {
        createMessage.error('接口请求超时,请刷新页面重试!')
      }
      if (err && err.includes('Network Error')) {
        createErrorModal({
          title: '网络异常',
          content: '请检查您的网络连接是否正常!'
        })
      }
    } catch (error) {
      throw new Error(error as any)
    }
    // checkStatus(error.response && error.response.status, msg);
    return Promise.reject(error)
  }
}

function createAxios (opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        prefixUrl: PREFIX,
        headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: APIURL
        }
      },
      opt || {}
    )
  )
}
export const defHttp = createAxios()
