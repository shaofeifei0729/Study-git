<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)" class="login-container">
    <el-form v-show="!loading" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{ $store.state.app.config.name }}
        </h3>
      </div>
      <el-form-item prop="agent">
        <el-select v-model="loginForm.agent">
          <el-option v-for="item in groupList" :key="item.name" :label="item.name" :value="item.value" :disabled="item.disabled" />
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="mobile">
        <span class="svg-container">
          <i class="el-icon-mobile-phone" />
        </span>
        <el-input
          v-model="loginForm.mobile"
          placeholder="手机号"
          name="mobile"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="登录密码"
          name="password"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!--确认密码-->
      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.confirmPassword"
          :type="confirmPasswordType"
          placeholder="确认密码"
          name="confirmPassword"
        />
        <span class="show-pwd" @click="showConfirmPwd">
          <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!--极验-->
      <div id="captcha-box" />

      <br>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">
        立即注册
      </el-button>

      <p class="tips text-center"><router-link to="/login">已有账户？立即登录</router-link></p>
    </el-form>
  </div>
</template>

<script>
// 检查用户是否注册
import { checkExists, register } from '@/api/user'
import { validatePwd, validateUser } from '@/utils/validate'
import { Message } from 'element-ui'
// 极验验证码组件
import 'jquery'
import { geetestInit } from '@/api/geetest'
import '@/utils/gt'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validateUser(value)) {
        callback(new Error('请填写3-12位数字、字母、下划线'))
      } else {
        checkExists(value).then(response => {
          const exists = response.data.data
          if (exists) {
            callback(new Error('用户名已被注册'))
          } else {
            callback()
          }
        }).catch(error => {
          callback(new Error(error))
        })
      }
    }
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
      } else if (value !== this.loginForm.password) {
        callback(new Error('两次密码输入不一致，请检查'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        agent: 0, // 是否代理
        geetest_challenge: '',
        geetest_validate: '',
        geetest_seccode: '',
        gtValited: false // 极验是否验证通过
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        mobile: [{ required: true, trigger: 'blur', pattern: /^1[3-9]\d{9}$/, message: '请填写有效的手机号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      passwordType: 'password',
      confirmPasswordType: 'password',
      loading: true,
      showDialog: false,
      redirect: undefined,
      geetestObj: null
    }
  },
  computed: {
    // 系统是否关闭注册
    regClose() {
      return this.$store.state.app.config.reg_switch === '0'
    },
    agentClose() {
      return this.$store.state.app.config.agent_switch === '0'
    },
    groupList() {
      const list = [
        {
          name: '商户',
          value: 0,
          disabled: false
        },
        {
          name: '代理',
          value: 1,
          disabled: false
        }
      ]
      if (this.agentClose) {
        list[1].disabled = true
      }
      return list
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    // 读取到数据
    regClose: function(value) {
      this.handleRegisterClose()
    }
  },
  mounted() {
    // 系统是否关闭注册
    this.handleRegisterClose()
  },
  destroyed() {
  },
  methods: {
    // 极验验证码
    geetest() {
      geetestInit().then(resp => {
        if (resp.data.code === 1) {
          const params = resp.data.data
          const _this = this
          window.initGeetest({
            gt: params.gt,
            challenge: params.challenge,
            offline: !params.success,
            width: '100%',
            new_captcha: params.new_captcha
          }, function(captchaObj) {
            _this.geetestObj = captchaObj
            // 插入到元素中
            captchaObj.appendTo('#captcha-box')

            setTimeout(function() {
              _this.loading = false
            }, 1000)

            captchaObj.onSuccess(() => {
              const result = captchaObj.getValidate()
              _this.loginForm.gtValited = true
              _this.loginForm.geetest_challenge = result.geetest_challenge
              _this.loginForm.geetest_validate = result.geetest_validate
              _this.loginForm.geetest_seccode = result.geetest_seccode
            })
          })
        } else {
          Message({
            message: resp.data.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    // 处理系统关闭的函数
    handleRegisterClose() {
      if (this.regClose) {
        this.$message({
          message: '系统注册已关闭,开户请联系客服',
          type: 'error'
        })
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
        return false
      } else {
        // 加载极验验证码
        this.geetest()
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    showConfirmPwd() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = ''
      } else {
        this.confirmPasswordType = 'password'
      }
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.loginForm.gtValited) {
            this.$message({
              message: '请完成验证',
              type: 'error'
            })
            return false
          }
          // 请求后端api注册
          register(this.loginForm).then(resp => {
            const data = resp.data
            if (data.code === 0) {
              this.$message({
                message: data.msg,
                type: 'error'
              })
              // 重新加载验证码
              this.geetestObj.reset()
            } else {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/login')
            }
          })
        } else {
          this.geetestObj.reset()
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {

    .el-select{
      display: inline-block;
      height: 47px;
      width: 100%;
    }
    .el-select .el-input{
      width: 100%;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: HSL(225,17%,5%);
    background-image: url(https://t1.picb.cc/uploads/2019/05/14/gtwAVK.jpg);
    background-size: cover;
    background-position: 50%;
    overflow: hidden;
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
</style>
