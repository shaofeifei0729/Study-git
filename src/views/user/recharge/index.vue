<template>

  <div class="bind-detail padding-big">
    <el-alert type="error">您可以在这里充值余额，用于代付。</el-alert>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="padding-big-top">
      <el-form-item label="账户余额">
        <el-input :value="$store.state.user.info.money" :disabled="true" />
      </el-form-item>
      <el-form-item label="充值金额" prop="money">
        <el-input v-model.number="form.money" placeholder="请输入充值金额" type="number" />
      </el-form-item>

      <el-form-item label="支付方式" prop="channel">
        <el-select v-model="form.channel" placeholder="请选择支付方式">
          <el-option v-for="item in channelList" :key="item.code" :label="item.name+'(费率: '+item.rate+'%)'" :value="item.code" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.channel == 'bank'" label="银行" prop="bankcode">
        <el-select v-model="form.bankcode" placeholder="请选择银行">
          <el-option label="聚合收银台" :value="''" />
          <el-option v-for="item in bankList" :key="item.bankcode" :label="item.bankname" :value="item.bankcode" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.native.prevent="submit">立即充值</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { index } from '@/api/channel'
import { recharge } from '@/api/user'
import { getBankList } from '@/api/bank'

export default {
  name: 'UserRecharge',
  data() {
    return {
      form: {
        money: this.$store.state.app.config.minrecharge - 0,
        channel: '',
        bankcode: ''
      },
      // 表单验证规则
      rules: {
        money: [{ required: true, type: 'number', trigger: 'blur', message: '请输入正确的充值金额' }],
        channel: [{ required: true, tigger: 'blur', message: '请选择支付方式' }]
      },
      channelList: [],
      bankList: []
    }
  },
  mounted() {
    // 刷新用户余额
    this.$store.dispatch('user/getInfo')
    this.getList()
  },
  methods: {
    getList() {
      index().then(resp => {
        this.channelList = resp.data.data
      })
      getBankList().then(resp => {
        this.bankList = resp.data.data.list
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          recharge(this.form).then(resp => {
            const payurl = resp.data.data.payurl
            window.location.href = payurl
          }).catch(() => {

          })
        }
        return true
      })
    }
  }
}
</script>

<style scoped>

</style>
