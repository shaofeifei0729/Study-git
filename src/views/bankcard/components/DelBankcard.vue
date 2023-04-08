<template>
  <div style="display: inline-block">
    <el-button type="danger" @click="del">删除</el-button>
  </div>
</template>

<script>
import { delBankcard } from '@/api/bankcard'
export default {
  name: 'DelBankcard',
  props: {
    bankcard: {
      type: Object,
      require: true,
      default() {
        return {
          name: '',
          ka: '',
          bank: '',
          province: '',
          city: '',
          zhihang: '',
          id: ''
        }
      }
    }
  },
  methods: {
    del() {
      if (!this.bankcard.id) return
      this.$confirm('确认删除卡号为:【' + this.bankcard.ka + '】的银行卡?', '删除银行卡', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const data = {
          id: this.bankcard.id
        }
        delBankcard(data).then(resp => {
          this.$notify({
            title: '操作成功',
            message: resp.data.msg,
            type: 'success'
          })
          // 刷新父组件
          this.showDialog = false
          this.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
