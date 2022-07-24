<template>
  <div>
    <!-- 文章 -->
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
        <article
          v-html="content"
          class="markdown-body article-content"
        ></article>

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

        <van-icon name="comment-o" :badge="count" />
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
      <!-- 弹出评论对话层 -->
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '20%' }"
        class="pop-one"
      >
        <van-cell center class="pop">
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
            <van-button @click="postComments">发布</van-button>
          </template>
        </van-cell>
      </van-popup>
      <!-- comments -->
      <div class="comment">
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
            v-for="(item, index) in commentList"
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
                  <van-button
                    class="btn1"
                    v-else
                    @click="clickCommentLikings(item)"
                    ><van-icon name="good-job-o" />
                    {{ item.like_count }}</van-button
                  >
                </div>
                <p class="content">{{ item.content }}</p>
                <div class="buttom">
                  <span class="times">{{ dayjs(item) }}</span>
                  <van-button
                    round
                    class="btn2"
                    size="mini"
                    @click="isShows(index)"
                    >回复 {{ item.reply_count }}</van-button
                  >
                </div>
              </van-cell>
            </template>
          </van-cell>
        </van-list>
      </div>
    </div>
    <!-- 回复 -->
    <div class="hf_pop">
      <van-popup v-model="shows" position="bottom" :style="{ height: '100%' }">
        <van-nav-bar
          :title="
            commentLists.length === 0
              ? '暂无回复'
              : `${commentLists.length}条回复`
          "
          class="huifutitle"
          left-arrow
          @click-left="shows = !shows"
        />

        <!-- --------------------------------------- -->
        <!-- 单独 cell -->
        <div class="cell-btn">
          <van-cell class="comments1" :border="true">
            <template #icon>
              <van-image width="36" height="36" round :src="items.aut_photo" />
            </template>

            <template #title>
              <van-cell class="right-comment">
                <div class="top">
                  <div class="username">{{ items.aut_name }}</div>
                  <van-button
                    class="btn1"
                    v-if="items.like_count === 0"
                    @click="clickiLkings(items)"
                    ><van-icon name="good-job-o" /> 赞</van-button
                  >

                  <van-button class="btn1" v-else @click="clickiLkings(items)"
                    ><van-icon name="good-job-o" /> {{ items.like_count }}
                  </van-button>
                </div>
                <p class="content">{{ items.content }}</p>
                <div class="buttom">
                  <span class="times"> {{ dayjs(items) }} </span>
                  <van-button round class="btn3" size="mini"
                    >回复 {{ items.reply_count }}
                  </van-button>
                </div>
              </van-cell>
            </template>
          </van-cell>
          <div>
            <van-cell title="全部回复" class="cell-all" />
          </div>
        </div>
        <!-- list 加载 -->
        <div class="list-cell">
          <van-list
            v-model="loadings"
            :finished="finisheds"
            finished-text="没有更多了"
            :offset="50000"
            @load="onLoading(items)"
            :error.sync="errors"
            error-text="请求失败，点击重新加载"
            class="list-items"
          >
            <van-cell
              class="comments2"
              :border="true"
              v-for="(item, index) in commentLists"
              :key="index"
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
                      @click="clickiLkings(item)"
                      ><van-icon name="good-job-o" /> 赞</van-button
                    >
                    <van-button class="btn1" v-else @click="clickiLkings(item)"
                      ><van-icon name="good-job-o" />
                      {{ item.like_count }}</van-button
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
        </div>
        <!-- 评论 -->
        <div class="btn-bottom">
          <van-button
            type="default"
            round
            size="small"
            class="btn"
            @click="isShow = !isShow"
          >
            写评论
          </van-button>
          <van-popup
            v-model="isShow"
            position="bottom"
            :style="{ height: '20%' }"
          >
            <van-cell center class="pop">
              <template #title>
                <van-field
                  v-model="messages"
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
                <van-button @click="postComment">发布</van-button>
              </template>
            </van-cell>
          </van-popup>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  getArticlesDetail,
  postCollection,
  delCollection,
  postLikings,
  delLikings,
  followingsAPI,
  cancelFollowingsAPI,
  postComments,
  getCommentList,
  postCommentLikings,
  delCommentLikings
} from '@/api'
import dayjs from '@/utils/dayjs.js'

export default {
  name: 'Detail',
  data() {
    return {
      content: '',
      isShow: false,
      newsList: {},
      // this.$route 可以拿到当前路由的信息
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
      isFollowed: '',
      count: '', // 计数
      new_obj: {}, // 评论
      message: '',
      show: false, // 弹出层
      // --------------------

      commentList: [], // 文章评论
      loading: false,
      finished: false,
      ids: this.$route.params.article_id,
      last_id: '', // 文章评论下一页
      error: false,
      shows: false, // 回复弹出
      items: '',
      last_ids: '', // 回复评论下一页
      commentLists: [], // 回复评论
      finisheds: false, //
      loadings: false, //
      errors: false, //
      messages: ''
    }
  },
  // mounted() {
  //   // ImagePreview(['https://img01.yzcdn.cn/vant/apple-1.jpg'])
  // },
  created() {
    this.getArticlesDetail()
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取新闻详情
    async getArticlesDetail() {
      if (this.newsList.length === 0) {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true
        })
      }
      try {
        const res = await getArticlesDetail(this.id)
        // console.log(res)
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
    // 收藏文章
    async clickCollection(id) {
      if (!this.newsList.is_collected) {
        try {
          this.$toast.success('操作成功！')
          await postCollection(id)
          // this.getArticlesDetail(this.id)
          this.newsList.is_collected = !this.newsList.is_collected
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
          // this.getArticlesDetail(this.id)
          this.newsList.is_collected = !this.newsList.is_collected
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
          // this.getArticlesDetail(this.id)
          this.newsList.attitude = 1
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
          // this.getArticlesDetail(this.id)
          this.newsList.attitude = -1
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
          // this.getArticlesDetail(this.id)
          this.isFollowed = !this.isFollowed
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
          // this.getArticlesDetail(this.id)
          this.isFollowed = !this.isFollowed
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
    },
    // 对文章进行评论
    async postComments() {
      try {
        if (this.message.trim() === '') {
          this.$toast.fail('输入内容不能为空！')
        } else {
          const res = await postComments(this.id, this.message)
          this.new_obj = res.data.data.new_obj
          this.commentList.unshift(this.new_obj)
          this.count++
          this.message = ''
          this.show = false
        }
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
    },

    // ------------------------------------------------------------

    // 文章list加载
    async onLoad() {
      try {
        // if (Math.random() < 0.7) {
        //   throw new Error(123)
        // }

        const res = await getCommentList('a', this.ids, this.last_id)
        this.count = res.data.data.total_count
        // console.log(res)
        this.last_id = res.data.data.last_id
        this.commentList.push(...res.data.data.results)
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
        // console.log(item.com_id)
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
    },
    // 点击回复评论信息
    isShows(index) {
      this.shows = true
      // console.log(index)
      this.items = this.commentList[index]
      // console.log(this.items)
      this.commentLists = []
      this.$nextTick(() => {
        this.finisheds = false
      })
    },
    // 文章回复评论点赞
    async clickiLkings(item) {
      // console.log(item)
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
        // console.log(item.com_id)
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
    },
    // 评论回复list加载
    async onLoading(items) {
      try {
        // console.log(items.com_id)
        const res = await getCommentList('c', this.items.com_id, this.last_ids)
        this.last_ids = res.data.data.last_id
        this.commentLists.push(...res.data.data.results)
        // console.log(res)
        if (this.last_ids === null) {
          this.finisheds = true
        }
      } catch (error) {
        this.errors = true
      } finally {
        this.loadings = false
      }
    },
    // 对文章评论进行评论
    async postComment() {
      console.log(this.items)
      try {
        if (this.messages.trim() === '') {
          this.$toast.fail('输入内容不能为空！')
        } else {
          const res = await postComments(
            this.items.com_id,
            this.messages,
            this.id
          )
          // console.log(res)
          this.new_objs = res.data.data.new_obj
          this.commentLists.unshift(this.new_objs)
          this.messages = ''
          this.items.reply_count++
          this.isShow = false
        }
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
  // margin-bottom: 100px;
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
}
// 评论对话层
.pop-one {
  display: flex;
  align-items: center;
  z-index: 9999;
  .pop {
    padding-right: 0;
  }
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

.van-cell--center {
  margin-top:15px;
  display: flex;
  align-items: center;
  z-index: 9999;
  padding-right: 0;

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
.comment {
  border-bottom: 0.02667rem solid #ebedf0;
  margin: 10px 16px 90px 16px;
}
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

.huifutitle {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #4c4c4c;
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 33px;
  }
}

.hf_pop {
  .van-popup--bottom{
    display:blank;
    :deep(.van-popup__close-icon){
      z-index: 0;
      color:#4c4c4c;
    }
  }
}
  .cell-btn {

    margin-top: 100px;

    width: 100%;
    border-bottom: 0.02667rem solid #eee;
  }
// cell 单独
.comments1 {

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
        color:#333
        // line-height: 30px;
      }
    }
    .buttom {
      display: flex;
      .times {
        margin-right: 0.33333rem;
        line-height: 0.48rem;
      }
      .btn3 {
        padding: 0 31px;
        line-height: 0.48rem;
        color:#333;
        border: 1px solid #ddd;
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

.list-cell{
  width: 100%;
  // margin-top:400px ;

}

// cell all
.comments2 {
    border-bottom: 0.02667rem solid #eee;

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
        color:#333
        // line-height: 30px;
      }
    }
    .buttom {
      display: flex;
      .times {
        margin-right: 0.33333rem;
        line-height: 0.48rem;
      }
      .btn2 {
        padding: 0 31px;
        line-height: 0.48rem;
        color:#333;
        border: 1px solid #ddd;
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

// 底部评论
.btn-bottom{

  position:  fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 10px 10px;
  background-color: #ddd;
  width: 100%;
  height: 100px;
  .btn{
    padding: 40px 100px;
    width: 80%;
    color:#333;
    font-size: 28px;
  }
}
.list-items{
  margin-bottom:100px;
  z-index: 0;
}
</style>
