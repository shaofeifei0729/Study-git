<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      <el-alert type="error" class="margin-big-bottom">如您发现在操作日志中有任何非本人的操作，请立即联系我们的业务！</el-alert>
      <el-table :data="tableData" stripe>
        <el-table-column
          prop="content"
          label="内容"
        />

        <el-table-column
          prop="ip"
          label="IP地址"
        />
        <el-table-column
          prop="createtime"
          label="时间"
        />
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="page"
        :total="total"
        :page-size="pageSize"
        class="margin-big-top"
        @prev-click="--page"
        @next-click="++page"
      />

    </div>

  </div>
</template>

<script>
import { getLogs } from '@/api/user'
export default {
  name: 'UserLogs',
  data() {
    return {
      tableData: [],
      page: 1, // 当前默认第一页
      total: 0,
      pageSize: 10
    }
  },
  watch: {
    page() {
      this.getList()
    }
  },
  // 加载数据
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getLogs(this.page,).then(resp => {
        this.tableData = resp.data.data.list
        this.total = resp.data.data.total
        this.pageSize = resp.data.data.limit
      })
    }
  }
}
</script>

<style scoped>

</style>
