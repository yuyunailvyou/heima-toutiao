import axios from 'axios'
import JSONbig from 'json-bigint'
import { getUser } from '@/utils/storage.js'
const http = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    try {
      // 如果后台返回的不是json字符串的格式, 这里就会报错
      return JSONbig.parse(data)
    } catch {
      // 如果报错了, 说明内容不是 json 格式的, 原样将响应直接给页面
      return data
    }
  }]

})
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = getUser().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default http
