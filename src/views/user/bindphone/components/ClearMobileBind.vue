<template>
  <div class="bind-detail padding-big">
    <div class="margin-big-top">
      <el-alert type="success" class="margin-big-bottom">您已经成功绑定，如需更换手机号请先解绑。</el-alert>

      <el-form ref="clearForm" :model="clearForm" :rules="rules" label-width="100px">
        <el-form-item label="手机号:">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-input v-model="clearForm.mobile" :disabled="true" />
          </el-col>
        </el-form-item>
        <el-form-item label="短信验证码" prop="code">
          <el-col :xs="18" :sm="18" :md="12" :lg="12" :xl="12">
            <el-input v-model="clearForm.code" />
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" class="margin-little-left">
            <el-button type="primary" class="send_btn" :disabled="!send_show" @click="sms_send('bind')">
              <span v-show="send_show">发送验证码</span>
              <span v-show="!send_show">{{ time_wait }}s后可重发</span>
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clearSubmit()">立即解绑</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import { sendSms } from '@/api/sms'
import { validateMobile } from '@/utils/validate'

export default {
  name: 'ClearMobileBind',
  data() {
    return {
      clearForm: {
        mobile: this.$store.state.user.info.mobile,
        code: ''
      },
      rules: {
        mobile: [
          { required: true, trigger: 'blur', pattern: /^1[3-9]\d{9}$/, message: '请填写有效的手机号' }
        ],
        code: [
          { required: true, trigger: 'blur', pattern: /^\d{4}$/, message: '请填写手机验证码' }
        ]
      },
      send_show: true,
      time_wait: 60,
      timer: null
    }
  },
  methods: {
    clearSubmit() {
      this.$refs.clearForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/clearMobileBind', this.clearForm.code).then(() => {
            this.$notify.success('手机号绑定成功')
          })
        }
      })
    },
    btn_wait() {
      this.$message.success('短信验证码发送成功')
      this.timer = setInterval(() => {
        if (this.time_wait <= 0) {
          this.send_show = true
          this.time_wait = 60
          clearInterval(this.timer)
        } else {
          this.send_show = false
          this.time_wait--
        }
      }, 1000)
    },
    sms_send() {
      const mobile = this.clearForm.mobile
      if (!validateMobile(mobile)) {
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        })
      }
      sendSms(mobile, 'clearmobilebind').then(resp => {
        this.btn_wait()
      })
    }
  }
}
</script>

<style scoped>

</style>
