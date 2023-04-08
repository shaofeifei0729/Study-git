<template>

  <div>
    <el-button
      v-if="merchant.agent_id === $store.state.user.info.merchant_id"
      type="primary"
      @click="handle()"
    >查看费率</el-button>

    <el-button v-if="merchant.group_id === 2" type="primary" @click="viewChild">下级商户</el-button>

    <el-dialog :title="'【'+merchant.merchant_id+'】费率'" :visible.sync="dialogFormVisible">

      <el-alert type="success" effect="dark" :closable="false" class="margin-bottom">费率 0 代表使用系统默认费率</el-alert>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          v-for="(api, index) in api_list"
          :key="index"
          :label="api.name+'：'"
          :rules="{
            required: true, message: '费率不能为空', trigger: 'blur'
          }"
          :prop="'rates.' + index + '.rate'"
        >
          <el-input v-model="form.rates[index].rate" :disabled="!allow_change" />
          <el-tag v-if="api.mystatus" type="danger">您的费率{{ api.myrate }} %</el-tag>
          <el-tag v-else type="danger">您当前未开通此通道，如需开通请联系商务！</el-tag>
        </el-form-item>

        <el-form-item v-if="allow_change">
          <el-button type="primary" @click="submit()">立即设置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { userrate, setuserrate } from '@/api/agent'
export default {
  name: 'AgentRate',
  props: {
    merchant: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      api_list: [],
      form: {
        merchant_id: this.merchant.merchant_id,
        rates: []
      },
      allow_change: this.$store.state.app.config.agent_change_rate === '1'
    }
  },
  methods: {
    viewChild() {
      this.$router.push({ name: 'UserList', query: { agentId: this.merchant.merchant_id }},)
    },
    handle() {
      this.form.rates = []
      // 只有一级代理可以查看费率
      if (this.merchant.agent_id !== this.$store.state.user.info.merchant_id) {
        this.$message.error('无权查看，您只能自己商户的费率。')
        return false
      }
      this.dialogFormVisible = true

      userrate(this.merchant.merchant_id).then(resp => {
        this.api_list = resp.data.data
        // 初始化数组
        this.api_list.forEach((item) => {
          this.form.rates.push({
            id: item.id,
            rate: item.rate,
            code: item.code
          })
        })
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          setuserrate(this.form).then(resp => {
            this.$message.success(resp.data.msg)
            this.dialogFormVisible = false
          })
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
