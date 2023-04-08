import { loginByUsername, logout, getUserInfo, getAuthInfo, bindMobile, clearMobileBind } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  info: {},
  auth_info: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INFO: (state, user) => {
    state.info = user
  },
  SET_AUTHINFO: (state, auth_info) => {
    state.auth_info = auth_info
  },
  SET_MOBILEBIND: (state, bind) => {
    state.info.mobilebind = bind
  },
  SET_MOBILE: (state, mobile) => {
    state.info.mobile = mobile
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      // 组装参数
      const data = {
        account: username,
        password: userInfo.password,
        geetest_challenge: userInfo.geetest_challenge,
        geetest_validate: userInfo.geetest_validate,
        geetest_seccode: userInfo.geetest_seccode
      }
      loginByUsername(data).then(response => {
        if (response.data.code < 1) {
          reject(response.data.msg)
        } else {
          commit('SET_TOKEN', response.data.data.userinfo.token)
          setToken(response.data.data.userinfo.token, response.data.data.userinfo.expiretime)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取认证信息
  getAuthInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAuthInfo().then(resp => {
        commit('SET_AUTHINFO', resp.data.data)
      })
    })
  },
  // 绑定手机验证码
  bindMobile({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      // 读取api
      bindMobile(data.mobile, data.code).then(resp => {
        commit('SET_MOBILEBIND', 1)
        commit('SET_MOBILE', resp.data.data.mobile)
        resolve()
      }).catch(() => {
      })
    })
  },
  // 解绑手机验证码
  clearMobileBind({ commit, state }, code) {
    return new Promise((resolve, reject) => {
      clearMobileBind(code).then(resp => {
        commit('SET_MOBILEBIND', 0)
        resolve()
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        // 由于mockjs 不支持自定义状态码只能这样hack
        if (!response.data) {
          reject('请求失败，请重新登录.')
        }
        const data = response.data.data
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
        } else {
          reject('获取权限列表失败!')
        }
        // 设置会员信息
        commit('SET_INFO', data.userinfo)
        commit('SET_NAME', data.userinfo.nickname)
        commit('SET_AVATAR', data.userinfo.avatar)
        commit('SET_INTRODUCTION', data.userinfo.bio)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
