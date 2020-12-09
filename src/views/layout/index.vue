<template>
  <div class="layout">
    <el-container>
      <el-aside :width='isCollapse?"64px":"200px"'>
        <div class="logo" :class="{minLogo:isCollapse}"></div>

          <!-- 菜单区域 -->
          <el-menu :collapse="isCollapse"
          default-active="$route.path"
          router
            background-color="#002033"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="articles">
              <i class="el-icon-document"></i>
              <span slot="title">内容管理</span>
            </el-menu-item>
            <el-menu-item index="pictures">
              <i class="el-icon-picture"></i>
              <span slot="title">素材管理</span>
            </el-menu-item>
            <el-menu-item index="add-article">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">发布文章</span>
            </el-menu-item>
            <el-menu-item index="comments">
              <i class="el-icon-chat-dot-round"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
            <el-menu-item index="fans">
              <i class="el-icon-setting"></i>
              <span slot="title">粉丝管理</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <i class="el-icon-setting"></i>
              <span slot="title">个人设置</span>
            </el-menu-item>
          </el-menu>

      </el-aside>
      <el-container>
        <el-header
          ><div class="left" @click="toggleMenu">
            <i :class="isCollapse ? 'el-icon-s-unfold': 'el-icon-s-fold'" ></i><span
              >江苏传智播客科技教育有限公司</span
            >
          </div>

          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" /> <span>{{user.name}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown></el-header
        >
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { reqGetUserInfo } from '@/api/user.js'
import { removeUser } from '@/utils/storage.js'
export default {
  name: 'Layout',
  data () {
    return {
      isCollapse: false,
      user: {}
    }
  },
  created () {
    this.$eventBus.$on('update_name', name => {
      this.user.name = name
    })
    this.$eventBus.$on('update_photo', photo => {
      this.user.photo = photo
    })
    reqGetUserInfo().then(res => {
      this.user = res.data.data
    })
  },
  methods: {
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      this.$confirm('您确定要退出吗, 是否继续?', '提示', {

        type: 'warning'
      }).then(() => {
        removeUser()
        this.$router.push('/login')
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layout{
  position: fixed;
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
  }
  .el-aside {
    background-color: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(~@/assets/logo_admin.png) no-repeat center;
      background-size: 140px auto;
    }
    // 覆盖background 的图片和大小，类书写在logo的下方。
    .minLogo {
      background-image: url(~@/assets/logo_admin_01.png);
      background-size: 36px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .avatar-wrap {
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-main {
    background-color: #e9eef3;
  }
}
</style>
