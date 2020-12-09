<template>
  <div class="articles">
    <el-card class="box-card">
      <template v-slot:header><my-breadcrumb>内容管理</my-breadcrumb></template>
      <el-form ref="myform" :model="form" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>

            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <my-channels v-model="form.channel_id"></my-channels>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"

              type="daterange" range-separator="-" start-placeholder="开始日期"
              end-placeholder="结束日期" >
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格部分 -->
    <el-card>
      <template v-slot:header
        ><p>根据筛选条件, 共查询到 {{total}} 条结果</p></template
      >
      <el-table :data="articles" v-loading="loading">
        <el-table-column label="封面">

          <template v-slot:default="obj">
            <el-image
              style="width: 150px; height: 100px"
              :src="obj.row.cover.images[0]"
              fit="cover"
            >
            <div slot="error" class="image-slot">
       <img src="~@/assets/error.gif" alt="" style="width:150px;height:100px;"/>
      </div></el-image></template>
        </el-table-column>
        <el-table-column prop="title" label="标题" >
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot:default="obj">
            <el-tag v-if="obj.row.status === 0" >草稿 </el-tag>
          <el-tag v-if="obj.row.status === 1" type="info">待审核 </el-tag>
          <el-tag v-if="obj.row.status === 2" type="success">审核通过 </el-tag>
          <el-tag v-if="obj.row.status === 3" type="warning">审核失败 </el-tag>
          <el-tag v-if="obj.row.status === 4" type="danger">已删除</el-tag>
          </template>
          </el-table-column>

        <el-table-column prop="pubdate" label="发布时间">

        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="obj">
            <el-button
              @click="edit(obj.row.id)"
              type="warning"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button
              @click="del(obj.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button
          ></template>
        </el-table-column>
      </el-table>
      <el-pagination
  @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :current-page="currentPage"
        :page-size="10"
        :total="total">
</el-pagination>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb.vue'
import MyChannels from '@/components/my-channels.vue'
import { reqGetArticlesList, reqDelArticles } from '@/api/articles.js'
export default {
  components: {
    MyBreadcrumb,
    MyChannels
  },
  data () {
    return {
      form: {
        status: null,

        date: [],
        channel_id: null

      },
      currentPage: 1,
      loading: false,
      total: 0,
      articles: [],
      // 目前会用到的查询条件
      query: {
        begin_pubdate: null,
        end_pubdate: null,
        status: null,
        channel_id: null
      }
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      this.loading = true
      const res = await reqGetArticlesList({
        page: this.currentPage,
        ...this.query
      })
      this.articles = res.data.data.results
      this.total = res.data.data.total_count
      this.loading = false
    },
    del (id) {
      this.$confirm('亲, 你确认要进行删除操作么?', '提示', {

        type: 'warning'
      }).then(() => {
        reqDelArticles(id.toString()).then(res => {
          this.$message.success('恭喜，删除成功')
          this.loadArticles()
        }).catch(() => {
          this.$message.error('尊敬的用户, 目前是测试阶段, 数据暂时无法删除')
        })
      }).catch(() => {
        console.log('取消了')
      })
    },
    handleCurrentChange (index) {
      this.currentPage = index
      this.loadArticles()
    },
    search () {
      this.currentPage = 1
      const [beginPubdate, endPubdate] = this.form.date || []
      this.query = {
        begin_pubdate: beginPubdate,
        end_pubdate: endPubdate,
        status: this.form.status,
        channel_id: this.form.channel_id || null

      }
      this.loadArticles()
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
}

</style>
