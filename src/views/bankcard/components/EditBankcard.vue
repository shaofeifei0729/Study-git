<template>
  <div style="display: inline-block">
    <el-button type="info" @click="showDialog=true">编辑</el-button>
    <el-dialog title="编辑银行卡" :visible.sync="showDialog">
      <el-form ref="form" :model="form" label-width="120px" class="addForm" :rules="rules" :inline="false">
        <el-form-item label="开户姓名" prop="name">
          <el-col :span="18">
            <el-input v-model="form.name" />
          </el-col>
        </el-form-item>
        <el-form-item label="卡号" prop="ka">
          <el-col :span="18">
            <el-input v-model="form.ka" />
          </el-col>
        </el-form-item>
        <el-form-item label="银行" prop="bank">
          <el-col :span="18">
            <el-input v-model="form.bank" placeholder="例如：中国银行，建设银行" />
          </el-col>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-col :span="18">
            <el-input v-model="form.province" />
          </el-col>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-col :span="18">
            <el-input v-model="form.city" />
          </el-col>
        </el-form-item>
        <el-form-item label="支行" prop="zhihang">
          <el-col :span="18">
            <el-input v-model="form.zhihang" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即修改</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { editBankcard } from '@/api/bankcard'

export default {
  name: 'EditBankcard',
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
  data() {
    return {
      showDialog: false,
      rules: {
        name: [{ required: true, type: 'string', trigger: 'blur', message: '请输入姓名' }],
        ka: [{ required: true, type: 'string', trigger: 'blur', message: '请输入银行卡号' }],
        bank: [{ required: true, type: 'string', trigger: 'blur', message: '请输入银行' }],
        province: [{ required: true, type: 'string', trigger: 'blur', message: '请输入省份' }],
        city: [{ required: true, type: 'string', trigger: 'blur', message: '请输入城市' }],
        zhihang: [{ required: true, type: 'string', trigger: 'blur', message: '请输入开户支行' }]
      },
      form: {
        name: this.bankcard.name,
        ka: this.bankcard.ka,
        bank: this.bankcard.bank,
        province: this.bankcard.province,
        city: this.bankcard.city,
        zhihang: this.bankcard.zhihang,
        id: this.bankcard.id
      }
    }
  },
  methods: {
    reset() {
      this.form = {
        name: '',
        ka: '',
        bank: '',
        province: '',
        city: '',
        zhihang: ''
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        // 验证通过
        if (valid) {
          editBankcard(this.form).then(resp => {
            this.$notify({
              title: '操作成功',
              message: resp.data.msg,
              type: 'success'
            })
            // 刷新父组件
            this.showDialog = false
            this.$emit('success')
          })
        }
        return
      })
    }
  }
}
</script>

<style scoped>

</style>
