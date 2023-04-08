<template>
  <div class="bind-detail padding-big">
    <div style="margin:0 0 5px 20px">
      <el-alert>代理可在这里添加商户</el-alert>

      <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="top" class="padding-big-top">

        <el-form-item label="账户类型" prop="agent">
          <el-select v-model="form.agent">
            <el-option v-for="item in groupList" :key="item.name" :label="item.name" :value="item.value" :disabled="item.disabled" />
          </el-select>
        </el-form-item>

        <el-form-item label="账户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            name="username"
            type="text"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="手机号"
            name="mobile"
            type="text"
          />
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="登录密码"
            name="password"
            show-password
          />
        </el-form-item>

        <!--确认密码-->
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input
            v-model="form.confirmPassword"
            placeholder="确认密码"
            name="confirmPassword"
            show-password
          />
        </el-form-item>

        <el-form-item prop="bio" label="备注">
          <el-input
            v-model="form.bio"
            placeholder="备注"
            name="bio"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click.native.prevent="submit">立即添加</el-button>
        </el-form-item>
      </el-form>
    </div></div>
</template>

<script>
import { checkExists } from '@/api/user'
import { validatePwd, validateUser } from '@/utils/validate'
import { adduser } from '@/api/agent'
export default {
  name: 'AddUser',
  inject: ['reload'],
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
      } else if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致，请检查'))
      } else {
        callback()
      }
    }
    return {
      form: {
        agent: 0,
        mobile: '',
        username: '',
        password: '',
        confirmPassword: '',
        bio: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        mobile: [{ required: true, trigger: 'blur', pattern: /^1[3-9]\d{9}$/, message: '请填写有效的手机号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      }
    }
  },
  computed: {

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
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          adduser(this.form).then(resp => {
            this.$message({
              message: resp.data.msg,
              type: 'success',
              onClose: () => {
                // 添加成功刷新本页面
                this.$router.push('/agent/userlist')
              }
            })
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
