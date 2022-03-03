import { RouteLocationRaw } from 'vue-router'
import { PageEnum } from '../../enum/pageEnum'
import router from '../../router'

export type RouteLocationRawEx = Omit<RouteLocationRaw, 'path'> & { path: PageEnum };

export function useGo (): Function {
  const { push, replace } = router
  function go (opt : string | RouteLocationRawEx | PageEnum = PageEnum.BASE_HOME, isReplace = false) {
    if (typeof opt === 'string') {
      isReplace ? replace(opt) : push(opt)
    } else {
      const o = opt as RouteLocationRaw
      isReplace ? replace(o) : push(o)
    }
  }
  return go
}

export function useBack (): void {
  const { back } = router
  back()
}
