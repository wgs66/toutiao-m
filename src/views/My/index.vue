<template>
  <div class="my">
    <!-- header -->
    <header>
      <!-- 登录盒子 -->
      <div v-if="isLogin" class="user-info banner">
        <van-row></van-row>
        <van-row class="rwo-2">
          <van-col span="12">
            <van-row type="flex" align="center" justify="space-around">
              <van-image
                round
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="11">
            <van-row class="code-row" type="flex" align="center" justify="end">
              <van-button class="code-btn" size="mini" round @click="toUser"
                >编辑资料</van-button
              >
            </van-row>
          </van-col>
        </van-row>
        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <template #icon>{{ userInfo.art_count }}</template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <template #icon>{{ userInfo.fans_count }}</template>
            </van-grid-item>
            <van-grid-item text="关注">
              <template #icon>{{ userInfo.follow_count }}</template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <template #icon>{{ userInfo.like_count }}</template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录盒子 -->
      <!-- ------------------------------------------------------------- -->
      <div v-else class="login-register banner">
        <div class="warp" @click="toLogin">
          <img src="../../assets/images/mobile.png" />
          <span>登录 / 注册</span>
        </div>
      </div>
      <!-- --------------------------------------------------------- -->
    </header>
    <main>
      <!-- 历史/搜索 -->
      <div>
        <van-grid :column-num="2" class="grid" clickable>
          <van-grid-item text="收藏">
            <template #icon>
              <span class="toutiao toutiao-shoucang"></span>
            </template>
          </van-grid-item>
          <van-grid-item text="历史">
            <template #icon>
              <span class="toutiao toutiao-lishi"></span>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 消息通知/小智同学 -->
      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>

    <van-button v-if="isLogin" block class="login-btn" @click="loginOut"
      >退出</van-button
    >
  </div>
</template>

<script>
import { getUserInfo } from '@/api'
export default {
  name: 'My',
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },
  methods: {
    loginOut() {
      this.$dialog
        .confirm({
          title: '黑马头条',
          message: '是否确认退出该账号？'
        })
        .then(() => {
          // on confirm
          this.$store.commit('setToken', {})
        })
        .catch(() => {
          // on cancel
        })
    },
    // 去登陆
    toLogin() {
      this.$router.push({ path: '/login' })
    },
    async getUserInfo() {
      if (this.isLogin) {
        try {
          const {
            data: { data }
          } = await getUserInfo()
          // console.log(data)
          this.userInfo = data
        } catch (error) {
          this.$toast.fail('请重新登陆！')
        }
      }
    },
    toUser() {
      this.$router.push('/user')
    }
  }
}
</script>

<style scoped lang="less">
.my {
  background-color: #f5f7f9;
  height: calc(100vh - 100px); //100vh代表1视口减去底部的区域高度px为单位
}
// 背景图
.banner {
  width: 100%;
  height: 400px;
  background: url('../../assets/images/banner.png') no-repeat center / cover;
}
// 用户信息的样式
.user-info {
  display: flex;
  flex-direction: column;

  > .van-row {
    flex: 1;
  }
  .rwo-2 {
    .van-col {
      height: 100%;
    }
  }
  .mobile {
    font-size: 0.4rem;
    color: #fff;
  }

  .code-btn {
    width: 1.53333rem;
    height: 0.42667rem;
    background: #fff;
    border-radius: 0.21333rem;
    font-size: 0.26667rem;
    color: #666;
    padding: 0;
  }

  .code-row {
    height: 100%;
  }

  .grid {
    :deep(.van-grid-item__content) {
      background-color: unset;
    }
  }
  .van-grid-item {
    color: #fff;
    font-size: 0.34667rem;
    :deep(.van-grid-item__text) {
      margin-top: 0.10667rem;
      color: #fff;
    }
  }
}

// 主体区域
main {
  .grid {
    color: #646566;
    // 字体图标
    .toutiao {
      font-size: 0.6rem;

      &.toutiao-lishi {
        color: #ffb31d;
      }
      &.toutiao-shoucang {
        color: #ed5253;
      }
    }
  }
  .link {
    margin: 10px 0;
  }
}
.login-btn {
  :deep(.van-button__text) {
    color: red;
  }
}
.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 1.76rem;
    height: 1.76rem;
  }
  span {
    font-size: 0.37333rem;
    color: #fff;
    margin-top: 0.13333rem;
  }
  .warp {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
