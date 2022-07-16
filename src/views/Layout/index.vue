<template>
  <div>
    <van-tabbar route>
      <van-tabbar-item to="/ ">
        <template>
          <span class="toutiao toutiao-shouye"></span>
          <span class="text">首页</span>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <template>
          <span class="toutiao toutiao-shipin"></span>
          <span class="text">视频</span>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <template>
          <span class="toutiao toutiao-wenda"></span>
          <span class="text">问答</span>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/profile">
        <template>
          <span class="toutiao toutiao-wode"></span>
          <!-- <span class="text" v-if="!!this.$store.state.user.token">我的</span>
          <span class="text" v-else>未登录</span> -->
          <span class="text">{{
            !!$store.state.user.token ? '我的' : '未登录'
          }}</span>
        </template>
      </van-tabbar-item>
    </van-tabbar>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped lang="less">
:deep(.van-tabbar-item__text) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  .toutiao {
    font-size: 0.53333rem;
  }
  .text {
    font-size: 0.32rem;
  }
}
</style>
