<template>
  <div>
    <!-- 没有图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleInfoDesc"
    />

    <!-- 一张图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleInfoDesc"
    >
      <van-image
        width="3rem"
        height="1.9rem"
        :src="articleInfo.cover.images[0]"
      />
    </van-cell>

    <!-- 三张图片 -->
    <van-cell v-if="articleInfo.cover.type === 3" :title="articleInfo.title">
      <template #label>
        <!-- 图片 -->
        <div class="imgs">
          <van-image
            v-for="(item, index) in articleInfo.cover.images"
            :key="index"
            width="2.5rem"
            height="1.9rem"
            :src="item"
          />
        </div>

        <!-- label -->
        <span>{{ articleInfoDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs.js'
export default {
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleInfoDesc() {
      const art = this.articleInfo
      const time = dayjs(art.pubdate).fromNow()
      return `${art.aut_name} ${art.comm_count}评论 ${time}`
    }
  }
}
</script>

<style scoped lang="less">
.imgs {
  display: flex;
  justify-content: space-between;
}
</style>
