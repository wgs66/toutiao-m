import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// ---
import showdown from 'showdown'
import 'github-markdown-css'
import hljs from 'highlight.js'
// 引入iconfoot
import '@/assets/fonts/iconfont.css'

// 引入vant组件
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入flexble
import 'amfe-flexible/index.min.js'
Vue.use(showdown)
Vue.use(hljs)
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
