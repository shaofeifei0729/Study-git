<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{ $store.state.app.config.name }}
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          placeholder="登录名、手机号"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!--极验-->
      <div id="captcha-box" />
      <!--忘记密码-->
      <p class="tips text-small text-right"><span style="cursor: pointer" @click="forgetPassword">忘记密码？</span></p>
      <br>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
      <p class="tips text-center"><router-link to="/register">没有账号？立即注册</router-link></p>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>

    </el-dialog>

  </div>
</template>

<script>
// 检查用户是否注册
import { checkExists } from '@/api/user'
import { validatePwd, validateUser } from '@/utils/validate'
import { Message } from 'element-ui'
// 极验验证码组件
import 'jquery'
import { geetestInit } from '@/api/geetest'
import '@/utils/gt'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validateUser(value)) {
        callback(new Error('请填写3-12位数字、字母、下划线'))
      } else {
        checkExists(value).then(response => {
          const exists = response.data.data
          if (!exists) {
            callback(new Error('用户名不存在'))
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
    return {
      loginForm: {
        username: '',
        password: '',
        geetest_challenge: '',
        geetest_validate: '',
        geetest_seccode: '',
        gtValited: false // 极验是否验证通过
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      geetestObj: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // 加载极验验证码
    this.geetest()
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    forgetPassword() {
      this.$message.info('忘记密码，请联系商务客服重置！')
    },
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

            // setTimeout(function() {
            //   _this.loading = false
            // }, 1000)

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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.loginForm.gtValited) {
            this.$message({
              message: '请完成验证',
              type: 'error'
            })
            return false
          }
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            // this.$message({
            //   message: err,
            //   type: 'error'
            // })
            this.geetestObj.reset()
            return false
          })
        } else {
          this.geetestObj.reset()
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
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
  $dark_gray:#eee;
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
