<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '97%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道 -->
      <div class="my-channel">
        <!-- 我的频道标题 -->
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="popup-btn"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>
        <!-- 我的频道list -->
        <van-grid :border="false" gutter="0.2rem">
          <van-grid-item
            :text="item.name"
            v-for="(item, index) in myChannels"
            :key="item.id"
            :class="{ 'active-item': item.name === '推荐' }"
            @click="onClickChannel(item, index)"
          >
            <template #icon>
              <van-icon name="cross" v-show="isEdit && item.name !== '推荐'" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->

      <div class="recommend-channel">
        <!-- 推荐频道标题 -->
        <van-cell title="推荐频道"> </van-cell>
        <!-- 推荐频道list -->
        <van-grid :border="false" gutter="0.2rem">
          <van-grid-item
            icon="plus"
            :text="item.name"
            v-for="item in recommendChannels"
            :key="item.id"
            @click="addChannel(item)"
          >
            <template #icon> </template>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels()
      console.log(data)
      this.allChannels = data.data.channels
    },
    onClickChannel(channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        this.$emit('delChannel', channel.id)
      }
      if (!this.isEdit) {
        this.isShow = false

        this.$emit('changeChannel', index)
      }
    },
    addChannel(item) {
      this.$emit('addMychannel', { ...item })
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((item) => {
        // const results = this.myChannels.find((obj) => obj.id === item.id)
        // if (results) {
        //   return false
        // } else {
        //   return true
        // }
        // ----------------------第一种简化方式
        // return !results
        // const results = this.myChannels.find((obj) => obj.id === item.id)
        // ----------------------第二种极简方式
        return !this.myChannels.find((obj) => obj.id === item.id)
      })
    }
  }
}
</script>

<style scoped lang="less">
.active-item {
  :deep(.van-grid-item__text) {
    color: #ff69b4;
  }
}
.popupMain {
  padding-top: 100px;
  .popup-btn {
    color: red;
    padding: 0 30px;
    height: 49px;
    border: 0.02667rem solid red;
  }
  :deep(.van-grid-item__content) {
    background-color: #eee;
    height: 81px;
  }
  // 我的频道
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.32rem;
          font-size: 10px;
        }
      }
    }
  }
  // 推荐频道
  .recommend-channel {
    :deep(.van-grid-item__content) {
      background-color: #eee;
      height: 81px;
      flex-direction: row;
    }
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      .van-grid-item__icon {
        font-size: 0.47rem;
        margin-right: 8px;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
