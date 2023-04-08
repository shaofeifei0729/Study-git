<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="clearfix padding-big">
      <span>今日数据</span>
    </div>
    <ul>
      <li class="margin-bottom">今日订单&nbsp;&nbsp;<el-tag>总计：{{ data.todayCount }}笔</el-tag>  <el-tag type="success">成功：{{ data.todaySuccCount }}笔</el-tag></li>
      <li class="margin-bottom">昨日订单&nbsp;&nbsp;<el-tag>总计：{{ data.yesCount }}笔</el-tag>  <el-tag type="success">成功：{{ data.yesSuccCount }}笔</el-tag></li>
      <li class="margin-bottom">今日收益&nbsp;&nbsp;<el-tag type="success">订单 ￥{{ data.today }}</el-tag> <el-tag type="success">实收 ￥{{ data.todayMoney }}</el-tag> </li>
      <li class="margin-bottom">昨日收益&nbsp;&nbsp;<el-tag type="success">订单 ￥{{ data.yesterday }}</el-tag> <el-tag type="success">实收 ￥{{ data.yesterdayMoney }}</el-tag></li>
    </ul>
  </el-card>
</template>

<script>
import { indexStatistics2 } from '@/api/statistics'

export default {

  data() {
    return {
      data: {
        todayCount: 0,
        todaySuccCount: 0,
        yesCount: 0,
        yesSuccCount: 0,
        today: 0,
        yesterday: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      indexStatistics2().then(resp => {
        this.data = resp.data.data
      })
    }
  }
}
</script>
