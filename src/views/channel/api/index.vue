<template xmlns:el-col="http://www.w3.org/1999/html">
  <div class="bind-detail padding-big">
    <div style="margin:0 0 5px 20px">
      <el-alert>本平台接口使用RSA2+MD5加密方式，最大程度的保证您的交易安全！密钥生成可使用支付宝的生成工具
        <a href="https://docs.open.alipay.com/291/105971/" target="_blank" style="color: red">点击这里下载</a>
      </el-alert>
      <el-form ref="form" :model="form" :rules="rules" :inline-message="true" label-width="120px">
        <el-form-item label="商户号:">
          {{ $store.state.user.info.merchant_id }}
        </el-form-item>

        <el-form-item label="网关地址：">
          {{ $store.state.app.config.gateway }}
        </el-form-item>
        <el-form-item label="MD5密钥：">
          <el-button v-show="!md5key" type="primary" size="small" @click="viewMd5()">查看秘钥</el-button>
          <span v-show="md5key" size="small" type="primary">{{ md5key }}</span>
          <el-button type="danger" size="small">如需重置，请联系客服确认</el-button>
        </el-form-item>
        <el-form-item label="平台公钥：">
          <el-input type="textarea" :autosize="{minRows:5}" :value="$store.state.app.config.public_key" :disabled="false" class="margin-small-top" />
        </el-form-item>

        <el-form-item label="商户公钥：" prop="public_key">
          <el-input v-model="form.public_key" type="textarea" rows="5" class="margin-small-top" />
        </el-form-item>

        <el-form-item label="请求IP：" prop="req_url">
          <el-input v-model="form.req_url" type="textarea" rows="5" class="margin-small-top" />
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
          <el-col :xs="12" :sm="12" :md="8" :lg="7" :xl="7" class="margin-small-left">
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
    </div></div>
</template>

<script>
import { md5, changeapi } from '@/api/channel'
import { sendSms } from '@/api/sms'

export default {
  name: 'Api',
  inject: ['reload'],
  data() {
    return {
      form: {
        public_key: this.$store.state.user.info.public_key,
        req_url: this.$store.state.user.info.req_url,
        codeStyle: '1',
        smsCode: '',
        googleCode: ''
      },
      rules: {
        public_key: [{ required: true, trigger: 'blur', message: '请填写您的公钥' }],
        req_url: [{ required: true, trigger: 'blur', message: '请填写您的请求域名或者ip' }]
      },
      md5key: false,
      send_show: true,
      time_wait: 60,
      timer: null
    }
  },
  methods: {
    // 提交表单
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          changeapi(this.form).then((resp) => {
            this.$message({
              message: resp.data.msg,
              type: 'success'
            })
            window.location.reload()
          }).catch(() => {
          })
        }
      })
    },
    viewMd5() {
      this.$prompt('请输入支付密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '关闭',
        inputPattern: /^[\S]{6,16}$/,
        inputErrorMessage: '支付密码格式不正确',
        closeOnClickModal: false
      }).then(({ value }) => {
        // 请求查看md5key
        md5(value).then((resp) => {
          this.md5key = resp.data.data.md5
        }).catch(() => {
        })
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
      sendSms('18888888888', 'changeapi').then(resp => {
        this.btn_wait()
      })
    }
  }
}
</script>

<style scoped>
.el-form-item{
  margin-bottom: 0px;
}
</style>
