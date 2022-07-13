<template>
  <div>
    <h1>黑马头条</h1>
    <span class="toutiao toutiao-dianzan"></span>
    <br />
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>

    <div class="login"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
.login {
  width: 694px;
  height: 88px;
  background-color: #6db4fb;
  border-radius: 10px;
}
</style>
