import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import http from '@/utils/request.js'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$eventBus = new Vue()
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
