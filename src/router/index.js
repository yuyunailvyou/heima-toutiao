import Vue from 'vue'
import VueRouter from 'vue-router'
import { getUser } from '@/utils/storage.js'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Page404 from '@/views/page404'
import Home from '@/views/home'
import Article from '@/views/articles/index.vue'
import AddArticle from '@/views/articles/add-article.vue'
import Comments from '@/views/comments/index.vue'
import Fans from '@/views/fans'
import Picture from '@/views/pictures'
import Settings from '@/views/settings'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/login', component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [{
        path: '/', component: Home
      },
      {
        path: 'articles', component: Article
      },
      {
        path: 'add-article', component: AddArticle
      },
      {
        path: 'pictures', component: Picture
      },
      {
        path: 'comments', component: Comments
      },
      {
        path: '/fans', component: Fans
      },
      {
        path: '/settings', component: Settings
      }]

    },
    {
      path: '*', component: Page404
    }

  ]
})
router.beforeEach((to, from, next) => {
  const token = getUser().token
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
  // 如果用户未能验证身份，则 `next` 会被调用两次
})
export default router
