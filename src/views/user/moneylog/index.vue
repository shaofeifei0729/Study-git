<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">

      <el-form :inline="true" :model="form">
        <el-form-item label="订单号">
          <el-input v-model="form.orderno" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.style" placeholder="请选择类型">
            <el-option label="充值" value="1" />
            <el-option label="提现" value="2" />
            <el-option label="代理佣金" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">筛选</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe>
        <el-table-column
          prop="orderno"
          label="订单号"
        />
        <el-table-column
          prop="style_text"
          label="类型"
        />
        <el-table-column
          prop="money"
          label="金额"
        />
        <el-table-column
          prop="before"
          label="变更前"
        />
        <el-table-column
          prop="after"
          label="变更后"
        />
        <el-table-column
          prop="memo"
          label="备注"
        />
        <el-table-column
          prop="createtime_text"
          label="添加时间"
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
import { moneylog } from '@/api/user'
export default {
  name: 'UserMoneyLog',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableData: [],
      page: 1, // 当前默认第一页
      total: 0,
      pageSize: 10,
      form: {
        orderno: '',
        style: '',
        date: ''
      },
      apiList: [],
      extend: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    reset() {
      this.form = {
        orderno: '',
        style: '',
        date: ''
      }
      this.getList()
    },
    getList() {
      this.form.page = this.page
      moneylog(this.form).then(resp => {
        this.tableData = resp.data.data.list
        this.total = resp.data.data.total
        this.pageSize = resp.data.data.limit
        this.extend = resp.data.data.extend
      })
    }
  }
}
</script>

<style scoped>

</style>
