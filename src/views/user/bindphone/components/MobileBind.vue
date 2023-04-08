<template>

  <div class="bind-detail padding-big">
    <div class="margin-big-top">
      <el-alert type="error" class="margin-big-bottom">手机号认证绑定页面，用于高危操作时的验证。</el-alert>
    </div>

    <el-form ref="bindForm" :model="bindForm" :rules="bindRules" label-width="100px">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="bindForm.mobile" class="bind_input" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input v-model="bindForm.code" class="bind_input" />
        <el-button type="primary" class="send_btn" :disabled="!send_show" @click="sms_send('bind')">
          <span v-show="send_show">发送验证码</span>
          <span v-show="!send_show">{{ time_wait }}s后可重发</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="bindSubmit()">立即绑定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sendSms } from '@/api/sms'
import { validateMobile } from '@/utils/validate'
export default {
  name: 'MobileBind',
  data() {
    return {
      'bindForm': {
        mobile: '',
        code: ''
      },
      // 验证规则
      bindRules: {
        mobile: [
          { required: true, trigger: 'blur', pattern: /^1[3-9]\d{9}$/, message: '请填写有效的手机号' }
        ],
        code: [
          { required: true, trigger: 'blur', pattern: /^\d{4}$/, message: '请填写手机验证码' }
        ]
      },
      send_show: true,
      time_wait: 60,
      timer: null,
      bindStatus: 0
    }
  },

  mounted() {
    this.bindForm.mobile = this.$store.state.user.info.mobile
    this.bindStatus = this.$store.state.user.info.mobilebind
  },
  methods: {
    // 提交绑定
    bindSubmit() {
      this.$refs.bindForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/bindMobile', { mobile: this.bindForm.mobile, code: this.bindForm.code }).then(() => {
            this.$notify.success('手机号解绑成功,请重新绑定')
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
    sms_send(event) {
      const mobile = this.bindForm.mobile

      if (!validateMobile(mobile)) {
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        })
      }

      // 发送验证码
      if (event === 'bind') {
        sendSms(mobile, 'bindphone').then(resp => {
          this.btn_wait()
        })
      }
    }
  }
}
</script>

<style scoped>
  .send_btn{
    display: inline-block;
    width: 30%;
  }
  .bind_input{
    width: 60%;
  }
</style>
