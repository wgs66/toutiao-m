import dayjs from 'dayjs'
// 配置相对的时间
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
// 配置中文包
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

export default dayjs
