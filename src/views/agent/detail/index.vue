<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">

      <el-row :gutter="12" class="margin-big-bottom ">

        <el-col :span="24" class="margin-bottom">
          <el-card shadow="always" class="bg-red">
            <h4>代理收益详解</h4>
            <p>您可以发展商户或者代理，并且为您的下级商户设置费率，获取对应的费率差，系统最多支持三级分润。 </p>
          </el-card>
        </el-col>

        <el-col :span="24" class="margin-bottom">
          <el-card shadow="always" class="bg-blue">
            <h4>商户数</h4>
            <p>总商户数：{{ childrens }} 下级商户数：{{ childs }}</p>
          </el-card>
        </el-col>
        <el-col :span="24" class="margin-bottom">
          <el-card shadow="always" class="bg-success">
            <h4>代理提成</h4>
            <p>总提成：￥{{ all }} 当天提成 ￥{{ today }} 当月提成：￥{{ month }} </p>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { agentDetail } from '@/api/agent'

export default {
  name: 'AgentDetail',
  data() {
    return {
      childs: 0,
      childrens: 0,
      all: 0,
      today: 0,
      month: 0
    }
  },
  mounted() {
    agentDetail().then(resp => {
      this.childs = resp.data.data.childs
      this.childrens = resp.data.data.childrens
      this.all = parseFloat(resp.data.data.all)
      this.today = parseFloat(resp.data.data.today)
      this.month = parseFloat(resp.data.data.month)
    })
  }
}
</script>

<style scoped>

</style>
