<template>
  <div class="fans">
      <el-card><template v-slot:header>
          <my-breadcrumb>粉丝列表</my-breadcrumb>
          </template>
           <div ref="main" style="width: 600px;height:400px;"></div>
          </el-card></div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb'
import echarts from 'echarts'
export default {
  name: 'Fans',
  components: {
    MyBreadcrumb
  },
  mounted () {
    // console.log('mounted, 结构准备好了')
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main)
    myChart.showLoading()

    // 发送请求, 从后台, 拿到图标的相关的数据, 基于这个数据, 进行图表的初始化
    setTimeout(() => {
      // 1秒后, 后台返回的数据
      const results = [
        { type: '小于18岁', num: 45 },
        { type: '小于23岁', num: 70 },
        { type: '小于30岁', num: 50 },
        { type: '小于40岁', num: 40 },
        { type: '小于50岁', num: 60 },
        { type: '大于50岁', num: 30 }
      ]

      // const newArr = results.map(item => {
      //   return item.type
      // })
      // console.log(newArr)

      // 指定图表的配置项和数据
      const option = {
        // 标题
        title: {
          text: '粉丝人数柱状图'
        },
        tooltip: {},
        // 图例
        legend: {
          data: ['人数']
        },
        xAxis: {
          data: results.map(item => item.type)
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: results.map(item => item.num)
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.hideLoading()
      myChart.setOption(option)
    }, 1000)
  }
}

</script>

<style>

</style>
