<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round><van-icon name="search" /> 搜索</van-button>
      </template>
    </van-nav-bar>

    <!-- tabs -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>

      <!-- 按钮 -->
      <span class="toutiao toutiao-gengduo" @click="isShow"></span>
    </van-tabs>
    <EditPopup
      ref="editPopup"
      :myChannels="myChannels"
      @delChannel="delMychannels"
      @changeChannel="changeActive"
      @addMychannel="addChannel"
    ></EditPopup>
  </div>
</template>

<script>
/* 持久化方案

离线状态
1后台返回的是默认的
保存在本地存储

登录状态
1后台返回的是用户的
2保存着服务器

*/

import {
  getMyChannel,
  getMyChannelByLocal,
  setMyChannelByLocal,
  delMychannels,
  addChannel
} from '@/api'
import EditPopup from './components/EditPopup.vue'
import ArticleList from './components/ArticleList.vue'
export default {
  name: 'Home',
  data() {
    return {
      active: 0,
      myChannels: []
    }
  },
  components: {
    ArticleList,
    EditPopup
  },
  created() {
    this.getMyChannel()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },

  methods: {
    async getMyChannel() {
      try {
        if (!this.isLogin) {
          // 如果是离线状态
          // 1 如果本地有数据 直接用本地
          // 2 如果没有数据 就直接获取
          const myChannels = getMyChannelByLocal()
          if (myChannels) {
            // console.log(myChannels)
            this.myChannels = myChannels
          } else {
            const { data } = await getMyChannel()
            this.myChannels = data.data.channels
          }
        } else {
          // 如果是登录状态
          // 发送请求获取
          const { data } = await getMyChannel()
          this.myChannels = data.data.channels
        }
        // console.log(data)
        // console.log(this.myChannels)
      } catch (error) {
        this.$toast.fail('请重新获取数据！')
      }
    },
    isShow() {
      this.$refs.editPopup.isShow = true
    },
    async delMychannels(id) {
      this.myChannels = this.myChannels.filter((item) => item.id !== id)

      if (!this.isLogin) {
        // 如果是离线
        // 数据存本地
        setMyChannelByLocal(this.myChannels)
      } else {
        // 如果是登录
        // 发请求获取
        try {
          await delMychannels(id)
        } catch (e) {
          return this.$toast.fail('删除用户频道是吧！')
        }

        this.$toast.success('删除用户频道成功！')
      }
    },
    changeActive(index) {
      this.active = index
    },
    async addChannel(channel) {
      this.myChannels.push(channel)
      if (!this.isLogin) {
        // 如果是离线
        // 数据存本地
        setMyChannelByLocal(this.myChannels)
      } else {
        // 如果是登录
        // 发请求获取
        try {
          await addChannel(channel.id, this.myChannels.length)
        } catch (error) {
          return this.$toast.fail('添加频道失败！')
        }

        // console.log('------')
      }
      this.$toast.success('添加频道成功！')
    }
  }
}
</script>

<style scoped lang="less">
// 导航栏
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
// tabs标签页
// tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  z-index: 99;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}

// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.toutiao-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
