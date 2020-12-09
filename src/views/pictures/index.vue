<template>
  <div class="pictures">
    <el-card>
      <template v-slot:header><my-breadcrumb>素材管理</my-breadcrumb></template>
      <div class="content">
        <div class="top-box">
         <el-radio-group v-model="isCollect" @change="toggleCollect">
      <el-radio-button :label="false">全部</el-radio-button>
      <el-radio-button :label="true">收藏</el-radio-button>

    </el-radio-group>
          <el-button type="success" class="upload" @click="dialogVisible = true">上传素材</el-button>
        </div>

        <el-row :gutter="10">
          <el-col
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            :xl="3"
            v-for="item in pictures"
            :key="item.id"
            class="img_item"
          >
            <el-image
              style="width: 100%; height: 180px"
              :src="item.url"
              fit="cover"
            ></el-image>
            <div class="option">
              <span @click="changeImageCollect(item)" class="el-icon-star-off" :class="{ star: item.is_collected }"></span>
              <span @click="delImage(item.id)" class="el-icon-delete"></span>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          layout="prev, pager, next"
          background
           @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="per_page"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="上传素材"
      append-to-body
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-upload
        class="avatar-uploader"
        :action='$http.defaults.baseURL+"/mp/v1_0/user/images"'
        :headers="headers"
        name="image"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-image @load="hanldeImgLoad" fit="cover" v-if="imageUrl" :src="imageUrl" class="avatar" ></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb'
import { reqGetPictures, reqGetPictureCollect, reqDelPictures } from '@/api/pictures.js'
import { getUser } from '@/utils/storage.js'
export default {
  name: 'Pictures',
  components: {
    MyBreadcrumb
  },
  data () {
    return {
      total: 0,
      currentPage: 1,
      per_page: 2,
      pictures: [],
      isCollect: false,

      dialogVisible: false,
      imageUrl: '', // 预览的图片路径
      headers: {
        Authorization: `Bearer ${getUser().token}`
      }
    }
  },
  created () {
    this.loadPictures()
  },
  methods: {
    async loadPictures () {
      const res = await reqGetPictures(
        {
          page: this.currentPage,
          per_page: this.per_page,
          collect: this.isCollect

        })
      this.pictures = res.data.data.results
      this.total = res.data.data.total_count
    },
    handleCurrentChange (index) {
      this.currentPage = index
      this.loadPictures()
    },

    toggleCollect (flag) {
      this.currentPage = 1
      this.loadPictures()
    },
    handleAvatarSuccess (response) {
      this.imageUrl = response.data.url
      this.$message.success('恭喜，上传成功')
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    hanldeImgLoad () {
      setTimeout(() => {
        this.dialogVisible = false
        this.imageUrl = ''
      }, 2000)
    },
    async changeImageCollect (item) {
      try {
        await reqGetPictureCollect(item.id, !item.is_collected)
        this.loadPictures()
        this.$message.success('操作成功')
      } catch {
        this.$message.success('操作失败')
      }
    },
    async delImage (id) {
      try {
        await reqDelPictures(id)
        this.$message.success('删除成功')
        if (this.pictures.length === 1 && this.currentPage > 1) {
          this.currentPage--
        }
        this.loadPictures()
      } catch {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pictures {
  .upload {
    float: right;
  }
  .star {
    color: yellow;
  }
  /deep/ .el-pager {
    .active {
      background-color: red !important;
    }
  }
}

.el-radio-group {
  margin-bottom: 15px;
}
.img_item {
  position: relative;
  box-sizing: border-box;
}
.option {
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 5px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #fff;
  span {
    margin: 0 30px;
    cursor: pointer;
  }
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-pagination {
  margin-top: 20px;
}
</style>
