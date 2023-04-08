import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // 登录路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 注册路由
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 会员路由
  {
    path: '/user',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: 'user',
      icon: 'user'
    },
    children: [
      {
        path: 'recharge',
        component: () => import('@/views/user/recharge'),
        name: 'UserRecharge',
        meta: {
          title: 'recharge',
          icon: 'money'
        }
      },
      {
        path: 'auth',
        component: () => import('@/views/user/auth'),
        name: 'UserAuth',
        meta: {
          title: 'auth',
          icon: 'people'
        }

      },
      {
        path: 'password',
        component: () => import('@/views/user/password'),
        name: 'UserPassword',
        meta: {
          title: 'password',
          icon: 'password'
        }
      },
      {
        path: 'paypassword',
        component: () => import('@/views/user/paypassword'),
        name: 'UserPayPassword',
        meta: {
          title: 'paypassword',
          icon: 'password'
        }
      },
      // google验证器绑定
      {
        path: 'bindgoogle',
        component: () => import('@/views/user/bindgoogle'),
        name: 'UserBindGoogle',
        meta: {
          title: 'bindgoogle',
          icon: 'google'
        }
      },
      {
        path: 'bindphone',
        component: () => import('@/views/user/bindphone'),
        name: 'UserBindPhone',
        meta: {
          title: 'bindphone',
          icon: 'guide'
        }
      },
      {
        path: 'moneylog',
        component: () => import('@/views/user/moneylog'),
        name: 'UserMoneyLog',
        meta: {
          title: 'moneylog',
          icon: 'guide'
        }
      },
      {
        path: 'logs',
        component: () => import('@/views/user/logs'),
        name: 'UserLogs',
        meta: {
          title: 'logs',
          icon: 'message'
        }
      }
    ]
  },
  // 通道路由
  {
    path: '/channel',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: 'channel',
      icon: 'excel'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/channel/list'),
        name: 'ChannelList',
        meta: {
          title: 'channel_list',
          icon: 'guide'
        }

      },
      {
        path: 'api',
        component: () => import('@/views/channel/api'),
        name: 'Api',
        meta: {
          title: 'api',
          icon: 'icon'
        }
      }]
  },
  // 代理功能
  {
    path: '/agent',
    component: Layout,
    meta: {
      title: 'agent',
      icon: 'people',
      roles: ['agency']
    },
    children: [
      {
        path: 'detail',
        component: () => import('@/views/agent/detail'),
        name: 'agentDetail',
        meta: {
          title: 'agentdetail',
          icon: 'dashboard',
          roles: ['agency']
        }

      },
      {
        path: 'adduser',
        component: () => import('@/views/agent/adduser'),
        name: 'AddUser',
        meta: {
          title: 'adduser',
          icon: 'edit',
          roles: ['agency']
        }

      },
      {
        path: 'userlist',
        component: () => import('@/views/agent/userlist'),
        name: 'UserList',
        meta: {
          title: 'userlist',
          icon: 'list'
        }
      },
      {
        path: 'orderList',
        component: () => import('@/views/agent/orderlist'),
        name: 'AgentOrderList',
        meta: {
          title: 'orderlist',
          icon: 'star'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: {
      title: 'order',
      icon: 'component'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        name: 'OrderList',
        meta: {
          title: 'orderlist',
          icon: 'edit'
        }
      }
    ]
  },
  {
    path: '/repay',
    component: Layout,
    meta: {
      title: 'repay',
      icon: 'component'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/repay/index'),
        name: 'Repay',
        meta: { title: 'repay', icon: 'repay' }
      },
      {
        path: 'apply',
        component: () => import('@/views/repay/ApplyRepay'),
        name: 'ApplyRepay',
        meta: { title: 'applyrepay', icon: 'edit' }
      },
      {
        path: 'batchApply',
        component: () => import('@/views/repay/BatchApplyRepay'),
        name: 'BatchApplyRepay',
        meta: { title: 'batchapplyrepay', icon: 'edit' }
      },
      {
        path: 'bankcard',
        component: () => import('@/views/bankcard/index'),
        name: 'Bankcard',
        meta: { title: 'bankcard', icon: 'bank-card' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
