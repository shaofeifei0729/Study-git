<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      <el-alert type="error">系统最多支持查看三级的商户列表，只能查看直接下级的费率，点击备注可以修改。</el-alert>

      <el-table :data="tableData" :default-sort="{prop:'merchant_id',order:'descending'}" height="500" stripe>
        <el-table-column
          prop="merchant_id"
          label="商户号"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.merchant_id }}
          </template>

        </el-table-column>

        <el-table-column
          prop="group_id"
          label="类型"
          :filters="[{text:'商户',value:1},{text:'代理',value:2}]"
          :filter-multiple="false"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.group_id == 2 ? '代理':'商户' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :filters="[{text:'正常',value:'normal'},{text:'锁定',value:'hidden'}]"
          :filter-multiple="false"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 'hidden'?'danger':'success'">{{ scope.row.status == 'hidden' ? '锁定' :'正常' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="agent_id" label="上级商户号" />

        <el-table-column
          prop="createtime"
          label="注册时间"
        />
        <el-table-column
          prop="money"
          label="余额"
          sortable
        >
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.money }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawal"
          label="已提现"
          sortable
        >
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.withdrawal }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bio"
          label="备注"
        >
          <template slot-scope="scope">
            <el-button type="info" @click="editBio(scope.row.merchant_id,scope.row.bio)">{{ scope.row.bio ? scope.row.bio :'暂无备注' }}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <agent-rate :merchant="scope.row" />
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { userlist, changeBio } from '@/api/agent'
import AgentRate from '../rate/index'
export default {
  name: 'UserList',
  components: { AgentRate },
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    agentId() {
      return this.$route.query.agentId ? this.$route.query.agentId : this.$store.state.user.info.merchant_id
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    editBio(merchantId, bio) {
      this.$prompt(`请输入${merchantId}的备注`, '修改备注', {
        confirmButtonText: '立即修改',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: bio
      }).then(({ value }) => {
        changeBio({
          merchantId,
          bio: value
        }).then(resp => {
          this.$message.success('修改备注成功')
          this.getList()
        })
      }).catch(() => {

      })
    },
    getList() {
      const data = {
        agentId: this.agentId
      }
      userlist(data).then(resp => {
        this.tableData = resp.data.data
      })
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleRate(merchant_id) {
      console.log(merchant_id)
    }
  }
}
</script>

<style scoped>

</style>
