<template>
 <div class="login">
    <div class="entry-login">
        <!-- 登录头部 -->
        <div class="login-head"><div class="logo"></div></div>
        <!-- 填写登录信息入口 -->
        <el-form ref="myform" :model="form" :rules="rules"  class="login-form">
  <el-form-item  prop="mobile">
    <el-input v-model="form.mobile" placeholder="请填写手机号"></el-input>
  </el-form-item>
  <el-form-item prop="code">
    <el-input v-model="form.code" placeholder="请填写验证码"></el-input>
  </el-form-item>
   <el-form-item prop="agree">
   <el-checkbox v-model="form.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
  </el-form-item>
  <el-form-item >
   <el-button type="primary" class="login-btn" @click="login">登录</el-button>
  </el-form-item>
  </el-form>
        </div>
     </div>
</template>

<script>
import { reqGetLogin } from '@/api/user.js'
import { setUser } from '@/utils/storage.js'

export default {
  name: 'Login',
  data () {
    return {
      form: {
        mobile: '13911111111',
        code: '246810',
        agree: true
      },
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: ['blur', 'change'] },
          { pattern: /\d{6}/, message: '请输入正确的6位验证码', trigger: ['blur', 'change'] }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value === false) {
                callback(new Error('请先同意用户协议'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }
        ]

      }
    }
  },

  methods: {
    login () {
      this.$refs.myform.validate((flag) => {
        if (!flag) return
        reqGetLogin(this.form).then((res) => {
          setUser(res.data.data)
          this.$message.success('登录成功')
          this.$router.push('/')
        }).catch((e) => {
          this.$message.error('登录失败，请输入手机号和验证码')
        })
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  background: url("~@/assets/login_bg.jpg") no-repeat;
  background-size: cover;
  .entry-login {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("../../assets/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}

</style>
