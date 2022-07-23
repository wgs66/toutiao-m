<template>
  <div>
    <!-- title -->
    <van-nav-bar
      title="黑马头条"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    <!-- main -->
    <div class="main">
      <!-- h1标题 -->
      <h1 class="article-title">{{ newsList.title }}</h1>
      <!-- 单元格 -->
      <van-cell title="单元格" value="内容" :border="false" class="user-info">
        <template #icon>
          <div class="one">
            <van-image
              center
              round
              width="35"
              height="68%"
              :src="newsList.aut_photo"
            />
          </div>
        </template>
        <template #title>
          <div>
            <div class="top">{{ newsList.aut_name }}</div>
            <div class="bottom">{{ articleInfoDesc() }}</div>
          </div>
        </template>
        <template>
          <div class="btns">
            <van-button
              type="info"
              round
              size="small"
              class="btn"
              v-if="!isFollowed"
              @click="clickFollowings(newsList.aut_id)"
              ><van-icon name="plus" /> 关注</van-button
            >
            <van-button
              type="info"
              v-else
              round
              size="small"
              class="btn btn2"
              @click="clickFollowings(newsList.aut_id)"
            >
              已关注</van-button
            >
          </div>
        </template>
      </van-cell>
      <!-- 主体内容 -->
      <article v-html="content" class="markdown-body article-content"></article>

      <van-divider>正文结束</van-divider>
      <!-- ------------------------- -->
    </div>
    <!-- footer -->
    <div class="footer">
      <van-button
        type="default"
        round
        size="mini"
        class="btn"
        @click="show = true"
      >
        写评论
      </van-button>
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '20%' }"
        @click-overlay="show = false"
      >
        <van-cell center>
          <template #title>
            <van-field
              v-model="message"
              rows="2"
              :autosize="false"
              type="textarea"
              maxlength="50"
              placeholder="请输入留言"
              show-word-limit
              class="post-field"
            />
          </template>
          <template>
            <van-button>发布</van-button>
          </template>
        </van-cell>
      </van-popup>
      <van-icon name="comment-o" :badge="commentList.total_count" />
      <van-icon
        name="star-o"
        @click="clickCollection(id)"
        v-if="!newsList.is_collected"
      />
      <van-icon
        name="star"
        v-else-if="newsList.is_collected"
        @click="clickCollection(id)"
      />
      <van-icon
        name="good-job-o"
        @click="clickLikings(id)"
        v-if="newsList.attitude !== 1 && newsList.attitude !== 0"
      />
      <van-icon name="good-job" v-else @click="clickLikings(id)" />
      <van-icon name="share" @click="showShare = true" />
    </div>
    <!-- icon 分享 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
  </div>
</template>

<script>
import {
  getArticlesDetail,
  getCommentList,
  postCollection,
  delCollection,
  postLikings,
  delLikings,
  followingsAPI,
  cancelFollowingsAPI
} from '@/api'
import dayjs from '@/utils/dayjs.js'
export default {
  name: 'Detail',
  data() {
    return {
      content: '',
      newsList: {},
      show: false,
      message: '',
      commentList: {},
      // this.route 可以拿到当前路由的信息
      id: this.$route.params.article_id,
      showShare: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],
      isFollowed: ''
    }
  },
  created() {
    this.getArticlesDetail()
    this.getCommentList()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取新闻详情
    async getArticlesDetail() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const res = await getArticlesDetail(this.id)
        this.newsList = res.data.data
        this.isFollowed = res.data.data.is_followed
        this.content = res.data.data.content
      } catch (error) {
        this.$toast.fail('请刷新重试！')
        const status = error.response.status
        if (status === 404) {
          throw new Error(error.response.data.message)
        } else if (status === 507) {
          throw new Error(error.response.data.message)
        } else {
          throw new Error(error.response.data.message)
        }
      }
    },
    // 处理时间
    articleInfoDesc() {
      const art = this.newsList
      const time = dayjs(art.pubdate).fromNow()
      return `${time}`
    },
    // 获取评论
    async getCommentList() {
      const res = await getCommentList('a', this.id)
      this.commentList = res.data.data
    },

    // 收藏文章
    async clickCollection(id) {
      if (!this.newsList.is_collected) {
        try {
          this.$toast.success('操作成功！')
          await postCollection(id)
          this.getArticlesDetail(this.id)
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
        try {
          this.$toast.success('操作成功！')
          await delCollection(id)
          this.getArticlesDetail(this.id)
        } catch (error) {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    // 点赞文章
    async clickLikings(id) {
      if (this.newsList.attitude !== 1) {
        try {
          await postLikings(id)
          this.$toast.success('操作成功！')
          this.getArticlesDetail(this.id)
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
      } else if (this.newsList.attitude === 1 || this.newsList.attitude === 0) {
        try {
          await delLikings(id)
          this.$toast.success('操作成功！')
          this.getArticlesDetail(this.id)
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
    },
    // 关注用户
    async clickFollowings(id) {
      if (!this.isFollowed) {
        try {
          await followingsAPI(id)
          this.$toast.success('已关注！')
          this.getArticlesDetail(this.id)
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
        try {
          await cancelFollowingsAPI(id)
          this.getArticlesDetail(this.id)

          this.$toast.success('已取消关注！')
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
:deep(.van-nav-bar) {
  background-color: #3296fa;
  color: #fff;
  position: fixed;
  width: 100%;
}
:deep(.van-icon-arrow-left) {
  color: #fff;
}
:deep(.van-nav-bar__title) {
  color: #fff;
}
.main {
  // padding-top: 90px;
  margin-bottom: 100px;
  .article-title {
    font-size: 0.53333rem;
    padding: 0.66667rem 0.42667rem;
    margin: 0;
    color: #3a3a3a;
  }
  .article-content {
    padding: 0.73333rem 0.42667rem;
  }
  .markdown-body {
    -webkit-text-size-adjust: 100%;
    color: #24292e;
    font-size: 0.21333rem;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .user-info {
    padding: 0 32px;
    .one {
      margin-right: 0.22667rem;
      padding-top: 12px;
    }
    .top {
      font-size: 0.32rem;
      color: #3a3a3a;
    }
    .bottom {
      font-size: 0.32rem;
      color: #b7b7b7;
    }
    .btns {
      padding-top: 15px;
      .btn {
        padding: 0 44px;
        line-height: 28px;
      }
      .btn2 {
        padding: 0 47px;
        line-height: 28px;
        background-color: transparent;
        color: #333;
        border: 0.02667rem solid #ebedf0;
      }
    }
  }
}
.footer {
  z-index: 1000;
  width: 100%;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .btn {
    padding: 0 95px;
    font-size: 0.4rem;
    line-height: 0.61333rem;
    color: #a7a7a7;
  }
  .van-cell--center {
    padding-right: 0;
  }
  .van-icon {
    font-size: 0.53333rem;
    color: rgb(119, 119, 119);
  }
  .van-icon-share {
    color: #666;
  }
  .van-icon-star {
    color: #3296fa;
  }
  .van-icon-good-job {
    color: #3296fa;
  }
  .van-popup--bottom {
    display: flex;
    align-items: center;

    .van-cell__title {
      flex: 5;
    }
    .post-field {
      background-color: #f5f7f9;
    }
    .van-button--default {
      border: transparent;
      color: #6ba3d8;
    }
  }
}
</style>
