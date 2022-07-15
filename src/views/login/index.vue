<template>
  <div>
    <!-- header -->
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="backToPage"
    >
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- main -->

    <van-form ref="form" class="form" @submit="login">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="text"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>

        <template #right-icon>
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="isShowCountDown = false"
          />
          <van-button
            v-else
            class="code-btn"
            size="mini"
            round
            @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>

    <!-- footer -->
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user.js'
import { mobileRules, codeRules } from './rules'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    backToPage() {
      // console.log(this)
      // $router的原型上有back方法
      this.$router.back()
    },
    // 登陆
    async login() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        console.log(res)
        // 存储token
        this.$store.commit('setToken', res.data.data)
        this.$toast.success('登陆成功')
        this.$router.push('/profile')
      } catch (e) {
        console.log(e)
        const status = e.response.status
        let message = '登陆错误，请刷新'
        if (status === 400) {
          message = e.response.data.message
        }
        this.$toast.fail(message)
      }
    },
    // 发送验证码
    async sendCode() {
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送请求
        await sendCode(this.mobile)
        // 显示倒计时
        this.isShowCountDown = true
      } catch (error) {
        // 表单校验失败
        if (!error.response) {
          this.$toast.fail('非法数据！')
        } else {
          // 验证码导致的失败
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon-cross {
    color: #fff;
  }
}
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-field__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 38px;
  }
  .code-btn {
    background-color: #ededed;
    color: #666;
    padding: 0 20px;
  }
}
</style>
