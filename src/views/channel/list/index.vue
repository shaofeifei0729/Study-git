<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      <el-alert type="info">您在这里可以查看通道费率以及限额等！</el-alert>

      <el-table :data="tableData" stripe>
        <el-table-column
          prop="name"
          label="通道名称"
        />
        <el-table-column
          prop="code"
          label="调用代码"
        />
        <el-table-column
          prop="rule_type_text"
          label="模式"
        />
        <el-table-column
          prop="rate"
          label="费率"
        >
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.rate }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="总额度"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.total == 0 ? '不限' : scope.row.total }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { index } from '@/api/channel'
export default {
  name: 'ChannelList',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      index().then(resp => {
        this.tableData = resp.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
