<template>

  <div class="container">
    <div class="app-container">

      <el-row class="margin-big-bottom">
        <el-col :span="24">
          <el-alert show-icon :title="alert_msg" :type="alert_type" />
        </el-col>
      </el-row>

      <!--在这里显示审核的无法修改信息-->
      <el-row v-if="authInfo.status==0||authInfo.status==1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>您的认证信息</span>
          </div>

          <table class="table table-bordered">
            <tr>
              <th>项目</th><th>内容</th>
            </tr>
            <tr>
              <td>姓名：</td>
              <td>{{ authInfo.name }}</td>
            </tr>
            <tr>
              <td>身份证号：</td>
              <td>{{ authInfo.identity }}</td>
            </tr>
            <tr>
              <td>行业：</td>
              <td>{{ authInfo.industry }}</td>
            </tr>
            <tr>
              <td>网址：</td>
              <td>{{ authInfo.website }}</td>
            </tr>
            <tr>
              <td>认证图片：</td>
              <td> <img v-for="(pic,index) in authInfo.picList" :key="index" :src="pic" style="max-width: 100%;"></td>
            </tr>
          </table>

        </el-card>
      </el-row>

      <el-form v-if="authInfo.status==-1||authInfo.status==2" ref="authForm" :model="authForm" :rules="rules" label-position="right" label-width="150px" class="form-container" size="medium">
        <el-row>
          <el-col :span="16">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="authForm.name" />
            </el-form-item>
            <el-form-item label="身份证号" prop="identity">
              <el-input v-model="authForm.identity" />
            </el-form-item>
            <el-form-item label="行业" prop="industry">
              <el-input v-model="authForm.industry" />
            </el-form-item>
            <el-form-item label="网站地址" prop="website">
              <el-input v-model="authForm.website" />
            </el-form-item>

            <el-form-item label="身份证正反面上传" prop="piclist">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :limit="uploadLimit"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                :on-success="uoloadAuthPicture"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :headers="uploadHeaders"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submit()">立即提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>

</template>

<script>
import settings from '@/settings'
import { getToken } from '@/utils/auth' // get token from cookie
import { handlerAuth } from '@/api/user'

let counter = 0

export default {
  name: 'AuthDetail',
  inject: ['reload'],
  props: {
    // 认证状态，默认为未认证
    authInfo: {
      type: Object,
      default: function() {
        return { status: -1, status_text: '待审核' }
      }
    }
  },
  data() {
    return {
      authForm: {
        name: '',
        identity: '',
        industry: '',
        website: '',
        piclist: []
      },
      // 认证列表
      rules: {
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { type: 'string', pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]+$/u, message: '姓名只允许输入中文英文和数字', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请填写身份证号', trigger: 'blur' },
          { type: 'string', pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式有误', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请填写行业', trigger: 'blur' },
          { type: 'string', pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]+$/u, message: '行业只允许输入中文英文和数字', trigger: 'blur' }
        ],
        website: [
          { required: true, message: '请填写您的网址', trigger: 'blur' },
          { type: 'string', pattern: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/, message: '网址输入有误', trigger: 'blur' }
        ],
        piclist: [
          { required: true, message: '请上传身份证正反面照片' }
        ]
      },
      uploadUrl: settings.apiUrl + '/user/authUpload',
      dialogImageUrl: '',
      dialogVisible: false,
      uploadLimit: 2,
      uploadHeaders: {
        'X-Token': getToken()
      }
    }
  },
  computed: {
    alert_type() {
      return this.authInfo.status === '1' ? 'success' : 'warning'
    },
    alert_msg() {
      const msg = this.authInfo.check_msg ? this.authInfo.check_msg : '暂无备注信息'
      return this.authInfo.status_text ? this.authInfo.status_text : '' + '【' + msg + '】'
    }
  },
  methods: {
    submit() {
      this.$refs.authForm.validate(valid => {
        if (valid) {
          handlerAuth(this.authForm).then(resp => {
            this.reload()
          })
        }
      })
    },
    handleRemove(file, fileList) {
      this.authForm.piclist.splice(file.index, 1)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传文件
    uoloadAuthPicture(response, file, fileList) {
      file.index = counter++
      // 记录数组中的索引在
      this.authForm.piclist.push(response.data.id)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .form-container{

  }
  .info-list li{
    padding: 10px;
  }
</style>
