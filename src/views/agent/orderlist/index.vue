<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">

      <el-row :gutter="12" class="margin-big-bottom ">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-blue">
            <h4>当日统计</h4>
            <p>订单金额：{{ extend.today }}元 成功：{{ extend.todaysuccess }}元</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-success">
            <h4>昨日统计</h4>
            <p>订单金额：{{ extend.yesterday }}元 成功：{{ extend.yesterdaysuccess }}元</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-danger">
            <h4>列表金额</h4>
            <p>总计：{{ extend.all }}元，数量：{{ extend.allcount }}笔</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-info">
            <h4>成功率</h4>
            <p>{{ extend.successRate }}%</p>
          </el-card>
        </el-col>
      </el-row>
      <el-form :inline="true" :model="form">
        <el-form-item label="下级商户号">
          <el-input v-model="form.merchant_id" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="form.orderno" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option label="未支付" value="0" />
            <el-option label="支付成功" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="充值方式">
          <el-select v-model="form.api_type_id" placeholder="请选择支付方式">
            <el-option v-for="item in apiList" :key="item.code" :label="item.name" :value="item.id" />
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
          prop="merchant_id"
          label="商户号"
        />
        <el-table-column
          prop="orderno"
          label="订单号"
        />
        <el-table-column
          prop="sys_orderno"
          label="系统单号"
        />
        <el-table-column
          prop="total_money"
          label="金额"
        />
        <el-table-column
          prop="have_money"
          label="获得金额"
        />
        <el-table-column
          prop="status_text"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 1 ?'success':'danger'">{{ scope.row.status_text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="apitype.name"
          label="充值方式"
        />
        <el-table-column
          prop="notify_status_text"
          label="通知状态"
        />
        <el-table-column
          prop="createtime_text"
          label="添加时间"
        />
        <el-table-column
          prop="paytime_text"
          label="支付时间"
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
import { orderlist } from '@/api/agent'
import { index as apiList } from '@/api/channel'

export default {
  name: 'AgentOrderList',
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
        merchant_id: '',
        status: '',
        api_type_id: '',
        date: '',
        orderno: ''
      },
      apiList: [],
      extend: {}
    }
  },
  watch: {
    page() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
    apiList().then(resp => {
      this.apiList = resp.data.data
    })
  },
  methods: {
    reset() {
      this.form = {
        merchant_id: '',
        status: '',
        api_type_id: '',
        date: '',
        orderno: ''
      }
      this.getList()
    },
    getList() {
      this.form.page = this.page
      orderlist(this.form).then(resp => {
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
