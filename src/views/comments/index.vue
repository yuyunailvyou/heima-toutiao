<template>
  <div class="comments">
    <el-card><template v-slot:header><my-breadcrumb>评论管理</my-breadcrumb></template>
     <el-table
      :data="list"
    >
      <el-table-column
        prop="title"
        label="文章标题"
      >
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
       >
      </el-table-column>
      <el-table-column
        prop="fan_comment_count"
        label="粉丝评论数">
      </el-table-column>
       <el-table-column
        prop="comment_status"
        label="评论状态">
        <template v-slot:default="obj">{{obj.row.comment_status?'关闭':'开启'}}</template>
      </el-table-column>
       <el-table-column

        label="操作">
         <template v-slot:default="obj"> <el-button @click="toggleStatus(obj.row)" v-if="obj.row.comment_status" type="success">打开评论</el-button>
            <el-button @click="toggleStatus(obj.row)" v-else type="danger">关闭评论</el-button></template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        background
        :current-page="currentPage"
        :page-size="per_page"
        :total="total_count">
      </el-pagination></el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb'
import { reqGetComments, reqChangeCommentStatus } from '@/api/comments.js'
export default {
  name: 'Comments',
  components: {
    MyBreadcrumb
  },
  data () {
    return {
      list: [],
      currentPage: 1,
      per_page: 10,
      total_count: 0

    }
  },
  created () {
    this.loadComments()
  },
  methods: {
    async loadComments () {
      const res = await reqGetComments(this.currentPage, this.per_page)
      this.list = res.data.data.results
      this.total_count = res.data.data.total_count
    },
    handleCurrentChange (index) {
      this.currentPage = index
      this.loadComments()
    },
    async toggleStatus (row) {
      await reqChangeCommentStatus(row.id.toString(), !row.comment_status)
      this.$message.success('修改成功')
      this.loadComments()
    }
  }
}
</script>

<style>
</style>
