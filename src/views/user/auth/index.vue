<template>
  <auth-detail :auth-info="auth_info" />
</template>

<script>

import AuthDetail from './components/AuthDetail'

export default {
  name: 'UserAuth',
  components: { AuthDetail },
  data() {
    return {
    }
  },
  // 认证状态
  computed: {
    auth_info() {
      return this.$store.state.user.auth_info
    }
  },
  mounted() {
    // 初始化时，通过vuex的action请求数据
    this.$store.dispatch('user/getAuthInfo')
  }
}
</script>

<style scoped>

</style>
