<template>
  <div id="app" class="users">
    <!-- title -->
    <div>
      <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    </div>

    <!-- 头像 -->
    <input type="file" ref="file" hidden accept=".png,.jpg" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image width="30" height="30" round :src="userProfile.photo" />
    </van-cell>
    <!-- 头像弹出层 -->
    <van-popup
      v-model="show"
      v-if="show"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdatePhoto
        @close="closeShow"
        @succes="succesShow"
        :photo="photo"
        v-show="show"
      ></UpdatePhoto>
    </van-popup>

    <!-- 昵称 -->
    <van-cell title="昵称" :value="userProfile.name" is-link @click="ncPop" />
    <!-- 昵称弹出层 -->
    <van-popup
      class="popNc"
      v-model="names"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- title -->
      <van-nav-bar
        title="更改昵称"
        left-text="返回"
        right-text="确定"
        @click-left="backPage"
        @click-right="onClickRight"
        class="ncNav"
      />
      <!-- imput area -->
      <van-field
        v-model="message"
        rows="2"
        :autosize="false"
        type="textarea"
        maxlength="7"
        placeholder="请输入新的昵称"
        show-word-limit
        ref="ncPopValue"
      />
    </van-popup>

    <!-- 性别 -->
    <van-cell
      title="更新性别"
      :value="userProfile.gender === 1 ? '女' : '男'"
      is-link
      @click="sex = true"
    />
    <!-- 性别弹出层 -->
    <van-popup
      v-model="sex"
      position="bottom"
      :style="{ height: '45%' }"
      class="sexPop"
    >
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="userProfile.gender"
        ref="sexTitle"
      />
    </van-popup>

    <!-- 生日 -->
    <van-cell
      title="生日"
      :value="userProfile.birthday"
      is-link
      @click="datas = true"
    />
    <!-- 生日弹出层 -->
    <van-popup
      v-model="datas"
      position="bottom"
      :style="{ height: '45%' }"
      class="dataPop"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="datas = false"
        @confirm="updataDatasPop"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile, patchUserProfile } from '@/api'
import UpdatePhoto from './components/Head_portrait.vue'
import dayjs from '@/utils/dayjs.js'

// 如何拿到用户选择的图片?
// - 监听input的change事件
export default {
  components: {
    UpdatePhoto
  },
  data() {
    return {
      show: false,
      photo: '',
      userProfile: {},
      names: false,
      message: '',
      sex: false,
      columns: ['男', '女'],
      value: '',
      datas: false,
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      newTimes: ''
    }
  },

  created() {
    // 调用数据
    this.getUserProfile()
  },
  mounted() {
    this.$refs.file.addEventListener('change', (e) => {
      const file = e.target.files[0]
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = (e) => {
        this.photo = e.target.result
        this.show = true
      }
    })
  },
  methods: {
    // 返回上一页
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取用户个人资料
    async getUserProfile() {
      try {
        const res = await getUserProfile()
        // console.log(res)
        this.userProfile = res.data.data
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else if (status === 401) {
          throw new Error(error.response.data.message)
        } else if (status === 507) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    // 触发input修改头像
    ccc() {
      this.$refs.input.click()
    },
    // 取消关闭弹出
    closeShow() {
      this.show = false
    },
    // 成功关闭弹出并刷新数据
    succesShow() {
      this.show = false
      this.getUserProfile()
    },
    // 修改昵称
    async onClickRight() {
      try {
        await patchUserProfile({
          name: this.$refs.ncPopValue.value
        })
        // console.log(res)
        this.$toast.success('操作成功！')
        this.userProfile.name = this.$refs.ncPopValue.value
        this.names = false
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else if (status === 401) {
          throw new Error(error.response.data.message)
        } else if (status === 507) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    // 关闭昵称弹出层
    backPage() {
      this.names = false
    },
    // 弹出昵称弹出层
    ncPop() {
      this.names = true
      this.message = this.userProfile.name
    },
    // 修改性别
    async onConfirm(value) {
      if (value === '男') {
        try {
          await patchUserProfile({
            gender: 0
          })
          this.userProfile.gender = 0
          this.$toast.success('操作成功！')
          this.sex = false
        } catch (error) {
          const status = error.response.status
          if (status === 400) {
            throw new Error(error.response.data.message)
          } else if (status === 401) {
            throw new Error(error.response.data.message)
          } else if (status === 507) {
            throw new Error(error.response.data.message)
          } else {
            this.$toast.fail('请刷新重试！')
          }
        }
      } else if (value === '女') {
        try {
          await patchUserProfile({
            gender: 1
          })
          this.userProfile.gender = 1
          this.$toast.success('操作成功！')
          this.sex = false
        } catch (error) {
          const status = error.response.status
          if (status === 400) {
            throw new Error(error.response.data.message)
          } else if (status === 401) {
            throw new Error(error.response.data.message)
          } else if (status === 507) {
            throw new Error(error.response.data.message)
          } else {
            this.$toast.fail('请刷新重试！')
          }
        }
      }
    },
    // 关闭性别弹出
    onCancel() {
      this.sex = false
    },
    // 修改生日
    async updataDatasPop(value) {
      try {
        this.newTimes = this.dayjs(value)
        await patchUserProfile({
          birthday: this.newTimes
        })
        this.userProfile.birthday = this.newTimes
        this.$toast.success('操作成功！')
        this.datas = false
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else if (status === 401) {
          throw new Error(error.response.data.message)
        } else if (status === 507) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    // 处理时间
    dayjs(times) {
      const time = dayjs(times).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  background-color: #f5f7f9;
  height: 100vh;
}
.van-nav-bar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-nav-bar__arrow) {
    color: #fff;
  }
}
.van-popup {
  background-color: #000000;
}
.popNc {
  background-color: #fff;
}
.ncNav {
  background-color: #fff;
  :deep(.van-nav-bar__title) {
    color: #333;
  }
}
.sexPop {
  background-color: #fff;
}
.dataPop {
  background-color: #fff;
}
</style>
