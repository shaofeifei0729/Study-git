<template>
  <div class="bind-detail padding-big">
    <el-alert type="error">您在此可以重置您的登录密码，如遇到任何问题请联系我们客服。</el-alert>
    <el-form ref="form" :rules="rules" :model="form" label-position="top" label-width="120px" class="padding-big-top">
      <el-form-item label="原登录密码" prop="old">
        <el-input v-model="form.old" placeholder="请输入原登录密码" show-password />
      </el-form-item>

      <el-form-item label="新登录密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入新的登录密码" show-password />
      </el-form-item>

      <el-form-item label="重复登录密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" placeholder="请重复新的登录密码" show-password />
      </el-form-item>
      <!-- 输入短信验证码或者google验证码 -->
      <el-form-item label="验证码" prop="codeStyle">
        <el-radio v-model="form.codeStyle" label="1">短信验证</el-radio>
        <el-radio v-model="form.codeStyle" label="2">谷歌验证器验证</el-radio>
      </el-form-item>
      <el-form-item v-if="form.codeStyle == '1'" prop="smsCode">
        <el-col :xs="12" :sm="12" :md="8" :lg="16" :xl="16">
          <el-input v-model="form.smsCode" placeholder="请点击右侧发送验证码" />
        </el-col>
        <el-col :xs="11" :sm="11" :md="8" :lg="7" :xl="7" class="margin-small-left">
          <el-button type="primary" class="send_btn" :disabled="!send_show" @click="sms_send()">
            <span v-show="send_show">发送验证码</span>
            <span v-show="!send_show">{{ time_wait }}s后可重发</span>
          </el-button>
        </el-col>
        <div class="clearfix" />
        <el-row>
          <el-col><router-link to="/user/bindphone" style="color: #F56C6C">如果您还没有绑定手机号，请点我绑定！</router-link></el-col>
        </el-row>
      </el-form-item>

      <el-form-item v-if="form.codeStyle == '2'" prop="googleCode">
        <el-input v-model="form.googleCode" placeholder="请输入谷歌验证器app上的验证码" />
        <el-row>
          <el-col><router-link to="/user/bindphone" style="color: #F56C6C">如果您还没有绑定谷歌验证器，请点我绑定！</router-link></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="submit">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { validatePwd } from '@/utils/validate'
import { changeLoginPassword } from '@/api/user'
import { sendSms } from '@/api/sms'

export default {
  name: 'UserPassword',
  inject: ['reload'],
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validatePwd(value)) {
        callback(new Error('请填写6-16位字符，不能包含空格'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!validatePwd(value)) {
        callback(new Error('请填写6-16位字符，不能包含空格'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致，请检查'))
      } else {
        callback()
      }
    }
    return {
      form: {
        old: '',
        password: '',
        confirmPassword: '',
        codeStyle: '1',
        smsCode: '',
        googleCode: ''
      },
      // 表单验证规则
      rules: {
        old: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        codeStyle: [{ required: true, tigger: 'blur', message: '请选择验证码类型' }]
      },
      send_show: true,
      time_wait: 60,
      timer: null
    }
  },
  created() {
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 修改支付密码
          changeLoginPassword(this.form).then((resp) => {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            })
            // 重新登录
            this.$store.dispatch('user/logout').then(() => {
            })
          }).catch((error) => {
            console.log(error.message)
          })
        }
        return true
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
      sendSms('18888888888', 'changepassword').then(resp => {
        this.btn_wait()
      })
    }
  }
}
</script>

<style scoped>

</style>
