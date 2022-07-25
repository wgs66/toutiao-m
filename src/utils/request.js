// 引入axios
import axios from 'axios'

import store from '@/store'

// 配置
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})
request.interceptors.request.use(
  (config) => {
    // console.log(config)
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default request
