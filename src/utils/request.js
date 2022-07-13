// 引入axios
import axios from 'axios'

// 配置
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 3000
})

export default request
