<template>
  <div class="app-container">

    <div class="bind-detail padding-big">
      <div v-if="!isBind" class="margin-big-top">
        <el-alert type="error" class="margin-big-bottom">谷歌验证器绑定，点击图片可刷新绑定二维码！</el-alert>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="24" :xl="24" class="text-center">
            <img :src="qrCodeUrl" alt="绑定二维码" class="" @click="refreshQrcode" @load="finshQrcode">
          </el-col>
        </el-row>
        <el-row class="text-center margin-big-top">
          <p style="line-height: 30px">
            1、请前往appstore【苹果】或各大应用市场【安卓】搜索Google Authenticator<br>
            2、扫描上方二维码，扫描成功后请点击下方按钮
          </p>
          <el-button style="width: 100%" type="success" @click="confirmBind">扫码成功，请点击这里完成绑定</el-button>
        </el-row>
      </div>
      <!--已经绑定过了显示解绑页面-->
      <div v-else class="margin-big-top">
        <el-alert type="success" class="margin-big-bottom">您已经成功绑定,如需解绑请在下方操作。</el-alert>
        <el-form ref="clearForm" :model="clearForm" :rules="rules" label-width="100px">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="验证码:" prop="code">
                <el-input v-model="clearForm.code" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-button type="primary" class="btn-clear" @click="clearBind">立即解绑</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoogleQrcode, bindGoogleQrcode, clearGoogleBind } from '@/api/user'

export default {
  name: 'UserBindGoogle',
  data() {
    return {
      qrCodeUrl: '',
      secret: '',
      loading: null,
      isBind: 1,
      clearForm: {
        code: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入手机上显示的谷歌验证码', trigger: 'blur' },
          { type: 'string', len: 6, message: '请输入六位数的验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    this.isBind = this.$store.state.user.info.googlebind
    this.refreshQrcode()
  },
  methods: {

    // 解绑
    clearBind() {
      this.$refs['clearForm'].validate((valid) => {
        // 请求后端解绑
        clearGoogleBind(this.clearForm.code).then(resp => {
          this.$notify({
            title: '提示',
            message: resp.data.msg,
            type: 'success',
            duration: 3000,
            showClose: false
          })
          this.isBind = 0
          this.refreshQrcode()
        })
      })
    },
    confirmBind() {
      this.$prompt('请输入谷歌验证器上的验证码', '提示', {
        confirmButtonText: '确定绑定',
        cancelButtonText: '我再想想',
        inputPattern: /^\d{6}$/,
        inputErrorMessage: '验证码格式不正确'
      }).then(({ value }) => {
        // 发送给后端绑定谷歌验证器
        bindGoogleQrcode(this.secret, value).then(resp => {
          this.$notify({
            title: '提示',
            message: resp.data.msg,
            type: 'success',
            duration: 3000,
            showClose: false
          })
          this.isBind = 1
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '取消输入'
        // })
      })
    },
    finshQrcode() {
      if (this.loading) {
        this.loading.close()
      }
    },
    refreshQrcode() {
      // 绑定完成不加载
      if (this.isBind) {
        return '666'
      }
      const loading = this.$loading({
        lock: true,
        text: '请稍等正在加载二维码,长时间等待请刷新重试',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.loading = loading
      getGoogleQrcode().then(resp => {
        this.qrCodeUrl = resp.data.data.qrCodeUrl
        this.secret = resp.data.data.secret
      }).catch(() => {
        setTimeout(() => {
          loading.close()
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  @media (max-width:768px) {
    .btn-clear{
      width: 100%;
    }
  }

</style>
