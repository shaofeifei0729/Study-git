<template>
  <div class="app-container">
    <el-alert type="info" :closable="false" class="margin-bottom">您当前可用余额：￥{{ $store.state.user.info.availMoney }}，冻结金额：￥{{
      $store.state.user.info.freezeMoney }}，
      提现手续费：{{ payrate }}，提现时间为：{{ $store.state.app.config.txpaytimestart }} - {{ $store.state.app.config.txpaytimeend
      }} <a :href="$store.state.app.config.url + '/resource/提现模板.xlsx'" style="color: red">【提现模板点我下载】</a>
    </el-alert>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />

    <el-table v-if="tableData.length>0" :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>

    <el-form ref="form" :rules="rules" :model="form" label-position="top" label-width="120px" class="padding-big-top">

      <el-form-item label="支付密码：" prop="payPassword">
        <el-input v-model="form.payPassword" placeholder="请输入支付密码" show-password />
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
        <el-button type="primary" style="width: 100%" @click.native.prevent="submit">立即提现</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { validatePwd } from '@/utils/validate'
import { batchApplyRepay } from '@/api/repay'
import { sendSms } from '@/api/sms'

export default {
  name: 'BatchApplyRepay',
  components: { UploadExcelComponent },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validatePwd(value)) {
        callback(new Error('请填写6-16位字符，不能包含空格'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      tableHeader: [],
      form: {
        payPassword: '',
        codeStyle: '1',
        smsCode: '',
        googleCode: ''
      },
      rules: {
        payPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        codeStyle: [{ required: true, tigger: 'blur', message: '请选择验证码类型' }]
      },
      send_show: true,
      time_wait: 60,
      timer: null
    }
  },
  computed: {
    payrate() {
      const payRateType = this.$store.state.user.info.payrate_type === '0' ? '元' : '%'
      const payRate = this.$store.state.user.info.payrate
      return payRate + payRateType
    }
  },
  mounted() {
    // 刷新用户余额
    this.$store.dispatch('user/getInfo')
  },
  methods: {
    submit() {
      this.form.list = this.tableData
      batchApplyRepay(this.form).then(resp => {
        this.$message.success(resp.data.msg)
        this.$router.push('/repay/index')
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传超过1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
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
      sendSms('18888888888', 'batchrepay').then(resp => {
        this.btn_wait()
      })
    }
  }
}
</script>

