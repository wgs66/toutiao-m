<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :offset="300"
    @load="onLoad"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
  >
    <van-cell
      class="comments"
      :border="true"
      v-for="item in commentList"
      :key="item.com_id"
    >
      <template #icon>
        <van-image width="36" height="36" round :src="item.aut_photo" />
      </template>

      <template #title>
        <van-cell class="right-comment">
          <div class="top">
            <div class="username">{{ item.aut_name }}</div>
            <van-button
              class="btn1"
              v-if="item.like_count === 0"
              @click="clickCommentLikings(item)"
              ><van-icon name="good-job-o" /> 赞</van-button
            >
            <van-button class="btn1" v-else @click="clickCommentLikings(item)"
              ><van-icon name="good-job-o" /> {{ item.like_count }}</van-button
            >
          </div>
          <p class="content">{{ item.content }}</p>
          <div class="buttom">
            <span class="times">{{ dayjs(item) }}</span>
            <van-button round class="btn2" size="mini"
              >回复 {{ item.reply_count }}</van-button
            >
          </div>
        </van-cell>
      </template>
    </van-cell>
  </van-list>
</template>

<script>
import dayjs from 'dayjs'

import { getCommentList, postCommentLikings, delCommentLikings } from '@/api'
export default {
  data() {
    return {
      commentList: [],
      loading: false,
      finished: false,
      id: this.$route.params.article_id,
      last_id: '',
      error: false
    }
  },
  props: {
    newObj: {
      type: Object,
      required: true
    }
  },
  watch: {
    newObj: {
      // immediate: true,
      handler(val, old) {
        // this.onLoad()
        console.log(val, old)
        this.commentList.unshift(old)
      },
      deep: true
    }
  },
  methods: {
    // list加载
    async onLoad() {
      try {
        // if (Math.random() < 0.7) {
        //   throw new Error(123)
        // }
        // if (this.newObj !== '') {
        //   this.commentList.unshift(this.newObj)
        // }

        const res = await getCommentList('a', this.id, this.last_id)
        console.log(res)
        this.last_id = res.data.data.last_id
        this.commentList.push(...res.data.data.results)
        this.$emit('total_count', res.data.data.total_count)
        if (this.last_id === null) {
          this.finished = true
        }
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    // 处理时间
    dayjs(item) {
      const time = dayjs(item.pubdate).fromNow()
      return time
    },
    // 文章评论点赞
    async clickCommentLikings(item) {
      if (!item.is_liking) {
        try {
          // console.log(item.com_id)

          await postCommentLikings(item.com_id)
          item.is_liking = !item.is_liking
          item.like_count++
        } catch (error) {
          const status = error.response.status
          if (status === 400) {
            throw new Error(error.response.data.message)
          } else if (status === 401) {
            throw new Error(error.response.data.message)
          } else if (status === 507) {
            throw new Error(error.response.data.message)
          } else {
            this.$toast.fail('请刷新重试')
          }
        }
      } else {
        console.log(item.com_id)
        try {
          await delCommentLikings(item.com_id)
          item.is_liking = !item.is_liking
          item.like_count--
        } catch (error) {
          const status = error.response.status
          if (status === 401) {
            throw new Error(error.response.data.message)
          } else if (status === 404) {
            throw new Error(error.response.data.message)
          } else if (status === 507) {
            throw new Error(error.response.data.message)
          } else {
            this.$toast.fail('请刷新重试')
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.comments {
  .right-comment {
    padding: 0;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn1 {
        border: none;
        padding: 0;
        height: 46px;
        // line-height: 30px;
      }
    }
    .buttom {
      display: flex;
      align-items: center;
      .times {
        margin-right: 0.33333rem;
        line-height: 0.48rem;
      }
      .btn2 {
        padding: 0 31px;
        line-height: 0.48rem;
      }
    }
    .content {
      font-size: 32px;
      color: #222;
    }
  }
  .van-image--round {
    margin-right: 0.33333rem;
  }
}
</style>
