<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">

      <el-alert class="margin-big-bottom" :closable="false">在此管理您的提现银行卡，如果管理员长时间未审核请与我们的商务联系。<add-bankcard @success="getList" /></el-alert>
      <el-form :model="form" :inline="true">
        <el-form-item label="收款人">
          <el-input v-model="form.name" placeholder="收款人" />
        </el-form-item>
        <el-form-item label="卡号">
          <el-input v-model="form.ka" placeholder="卡号" />
        </el-form-item>
        <el-form-item label="卡号">
          <el-select v-model="form.status" placeholder="审核状态">
            <el-option label="未通过" value="0" />
            <el-option label="已通过" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList">筛选</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>

      </el-form>

      <el-table :data="tableData" stripe>
        <el-table-column
          prop="name"
          label="收款人"
        />
        <el-table-column
          prop="ka"
          label="卡号"
        />
        <el-table-column
          prop="bank"
          label="银行"
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
          prop="createtime_text"
          label="添加时间"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <edit-bankcard :bankcard="scope.row" @success="getList" />
            <del-bankcard :bankcard="scope.row" @success="getList" />
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
import AddBankcard from './components/AddBankcard'
import EditBankcard from './components/EditBankcard'
import DelBankcard from './components/DelBankcard'

import { bankcardList } from '@/api/bankcard'

export default {
  name: 'Bankcard',
  components: { AddBankcard, EditBankcard, DelBankcard },
  data() {
    return {
      tableData: [],
      page: 1, // 当前默认第一页
      total: 0,
      pageSize: 10,
      form: {
        name: '',
        ka: '',
        status: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    reset() {
      this.form = {
        name: '',
        ka: '',
        status: ''
      }
      this.getList()
    },
    getList() {
      this.form.page = this.page
      bankcardList(this.form).then(resp => {
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
