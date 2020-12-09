<template>
  <div class="my-cover">
    <!-- 图片按钮 -->
    <div class="btn_img" @click="openDialog">
      <img :src="value || coverImgUrl" />
    </div>
    <!--  对话框 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="720px"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image"
          ><div class="top-box">
            <!-- label是收集给后台的, 标签内的内容才是用于展示 -->
            <el-radio-group
              @change="toggleCollect"
              v-model="collect"
              size="medium"
            >
              <el-radio-button :label="false">全部</el-radio-button>
              <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 栅格系统布局
             :gutter 每一项之间的间隔
             xs、sm、md、lg 和 xl
        -->
          <el-row :gutter="10" class="img_list">
            <el-col
              :class="{ selected: item.url === selectedImageUrl }"
              @click.native="clickSelectImage(item.url)"
              v-for="item in images"
              :key="item.id"
              class="img_item"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              :xl="3"
            >
              <el-image
                style="height: 100px; width: 100%"
                :src="item.url"
                fit="cover"
              ></el-image>
            </el-col>
          </el-row>

          <el-pagination
            @current-change="currentChange"
            layout="prev, pager, next"
            background
            :current-page="currentPage"
            :page-size="per_page"
            :total="total_count"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/mp/v1_0/user/images'"
            :headers="headers"
            name="image"
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/default.png'
import { getUser } from '@/utils/storage.js'
import { reqGetPictures } from '@/api/pictures.js'
export default {
  name: 'MyCover',
  props: ['value'],
  data () {
    return {
      images: [],
      collect: false,
      per_page: 2,
      currentPage: 1,
      total_count: 0,
      selectedImageUrl: '',
      imageUrl: '',
      coverImgUrl: defaultImg,

      dialogVisible: false,
      activeName: 'image',
      headers: {
        Authorization: `Bearer ${getUser().token}`
      }
    }
  },

  methods: {
    openDialog () {
      this.dialogVisible = true
      this.loadImages()
    },
    // 发送请求, 加载素材数据, 赋值给数组
    async loadImages () {
      const res = await reqGetPictures({
        page: this.currentPage,
        per_page: this.per_page,
        collect: this.collect
      })
      this.images = res.data.data.results
      this.total_count = res.data.data.total_count
    },
    // 处理当前页变化的函数
    currentChange (index) {
      // 更新当前页
      this.currentPage = index
      // 重新渲染
      this.loadImages()
    },
    toggleCollect () {
      // 切换收藏和全部时, 页码必然会变化, 需要重置成第一页
      this.currentPage = 1
      this.loadImages()
    },
    clickSelectImage (url) {
      this.selectedImageUrl = url
    },

    handleSuccess (response) {
      // 文件已经上传成功了, 预览已经上传成功的图片
      // console.log(response)
      this.imageUrl = response.data.url
    },
    handleConfirm () {
      // console.log(this.selectedImageUrl) // 素材库的选中的图片路径
      // console.log(this.imageUrl) // 上传的得到的图片路径
      if (this.activeName === 'image') {
        // 素材库
        if (!this.selectedImageUrl) {
          this.$message.error('请选择素材库的一张图片')
          return
        }
        this.coverImgUrl = this.selectedImageUrl
      } else if (this.activeName === 'upload') {
        // 上传图片
        if (!this.imageUrl) {
          this.$message.error('请上传一张图片')
          return
        }
        this.coverImgUrl = this.imageUrl
      }
      // 子传父, 将确定的图片地址, 传递给父组件
      this.$emit('input', this.coverImgUrl)
      // 关闭对话框
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
.my-cover {
  border: 2px solid #ccc;
  border-radius: 4px;
}
// 图片按钮
.btn_img {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

// 素材列表
.img_list {
  margin-top: 15px;
  .img_item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

// 只要盒子有selected类, 就添加一个after伪元素
.selected::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat center /
    50px 50px;
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
</style>
