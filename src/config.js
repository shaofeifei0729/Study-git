import router from './router'
import store from './store' // vue store
import { Message } from 'element-ui' // element ui

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // 获取配置
  store.dispatch('app/getConfig').then(res => {
    document.title = res.name
    next()
  }).catch(() => {
    Message.error('获取配置失败，请联系业务人员！')
    // next({ path: '/' })
  })
})
