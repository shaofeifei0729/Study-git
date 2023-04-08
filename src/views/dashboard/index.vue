<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-alert type="success">欢迎您，尊敬的【{{ this.$store.state.user.info.merchant_id }}】 会员！本次登录IP为：{{ this.$store.state.user.info.loginip }}，您已连续登录{{ this.$store.state.user.info.successions }}天。
        结算信息: {{ $store.state.user.info.settle }}</el-alert>
    </div>

    <admin-dashboard />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    // 设置提款密码
    hasPayPassowrd() {
      return this.$store.state.user.info.setPayPassword
    }
  },
  created() {
    if (!this.roles.includes('member')) {
      this.currentRole = 'editorDashboard'
    }
    // 刷新用户余额
    this.$store.dispatch('user/getInfo')
    // 如果提款密码没有设置
    if (!this.hasPayPassowrd) {
      this.$confirm('您还未设置支付密码，是否现在立即前往设置。', '设置支付密码', {
        confirmButtonText: '去设置',
        cancelButtonText: '暂不设置'
      }).then(() => {
        // 跳转到修改支付密码页面
        this.$router.push('/user/paypassword')
      }).catch(() => {
        console.log('暂不设置')
      })
    }
  }
}
</script>
