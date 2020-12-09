<template>
  <div class="settings">
    <el-card
      ><template v-slot:header>
        <my-breadcrumb>个人设置</my-breadcrumb>
      </template>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号"> 100 </el-form-item>
            <el-form-item label="手机">
              <el-button type="primary">{{ userInfo.mobile }}</el-button>
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介">
              <el-input
                v-model="userInfo.intro"
                type="textarea"
                :row="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-button @click="save" type="primary">保持设置</el-button>
            </el-form-item>
          </el-form></el-col
        >

        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="handleUpload"
            :show-file-list="false"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <p class="edit-photo">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/my-breadcrumb'
import { reqGetUserInfo, reqEditProfile, reqEditPhoto } from '@/api/user.js'
export default {
  name: 'Settings',
  components: {
    MyBreadcrumb
  },
  data () {
    return {
      userInfo: {
        mobile: '',
        name: '',
        email: '',
        intro: '',
        photo: ''
      },
      imageUrl: null
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo () {
      const res = await reqGetUserInfo()
      this.userInfo = res.data.data
    },
    async save () {
      try {
        const { name, intro, email } = this.userInfo
        const res = reqEditProfile({ name, intro, email })
        this.$message.success('修改用户信息成功')
        this.$eventBus.$emit('update_name', name)
      } catch {
        this.$message.error('修改用户信息失败')
      }
    },
    async handleUpload (data) {
      // 1. 拿到需要自行上传的文件对象
      const file = data.file
      // 2. 利用 formData 进行异步文件上传
      // (1) 创建formData对象, formData对象, 可以收集数据
      const formData = new FormData()
      // (2) 收集数据语法, formData.append(name, value)
      //     支持文件对象, formData.append(name, file)
      formData.append('photo', file)

      // 3. 发送axios的异步文件上传请求
      const res = await reqEditPhoto(formData)
      this.userInfo.photo = res.data.data.photo

      // 发布一个消息, 头像更新了
      this.$eventBus.$emit('update_photo', res.data.data.photo)
    }
  }
}
</script>

<style scoped lang='less'>
.avatar {
  width: 178px;
  height: 178px;
  line-height: 178px;
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
.edit-photo {
  font-size: 12px;
  text-align: center;
}
</style>
