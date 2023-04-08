<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">

      <el-row :gutter="12" class="margin-big-bottom ">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-blue">
            <h4>当日提现</h4>
            <p>金额：{{ extend.todayMoney }}元 手续费：{{ extend.todayPoundage }}元</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-success">
            <h4>昨日提现</h4>
            <p>金额：{{ extend.yesterMoney }}元 手续费：{{ extend.yesterPoundage }}元</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-danger">
            <h4>总提现</h4>
            <p>金额：{{ extend.allMoney }}元 手续费：{{ extend.allPoundage }}元</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <el-card shadow="always" class="bg-info">
            <h4>列表数据</h4>
            <p>笔数：{{ total }}笔 金额：{{ extend.all }}元 手续费：{{ extend.poundage }}元</p>
          </el-card>
        </el-col>
      </el-row>

      <el-form :inline="true" :model="form">
        <el-form-item label="订单号">
          <el-input v-model="form.orderno" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option label="申请中" value="0" />
            <el-option label="已支付" value="1" />
            <el-option label="已冻结" value="2" />
            <el-option label="已取消" value="3" />
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
          <el-button type="success" @click="dataExport">导出记录</el-button>
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
          prop="charge"
          label="手续费"
        />

        <el-table-column
          prop="settle"
          label="结算信息"
        >
          <template slot-scope="scope">
            {{ scope.row.bank }} {{ scope.row.zhihang }}  {{ scope.row.name }}  {{ scope.row.ka }}
          </template>
        </el-table-column>

        <el-table-column prop="createtime_text" label="申请时间" />

        <el-table-column
          prop="status"
          label="处理状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 1 ?'success':'danger'">{{ scope.row.status_text }}</el-tag>
          </template>
        </el-table-column>

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
import { repayList, repayExport } from '@/api/repay'

export default {
  name: 'Repay',
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
        status: '',
        date: ''
      },
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
  },
  methods: {

    dataExport() {
      repayExport(this.form).then(resp => {
        const blob = new Blob([resp.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = '代付订单导出记录.xlsx' // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },

    reset() {
      this.form = {
        orderno: '',
        status: '',
        date: ''
      }
      this.getList()
    },
    getList() {
      this.form.page = this.page
      repayList(this.form).then(resp => {
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
