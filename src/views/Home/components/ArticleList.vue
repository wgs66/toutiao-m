<template>
  <div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onLoadNextPage"
      success-text="刷新成功！"
    >
      <van-list
        @load="onLoadNextPage"
        :offset="300"
        v-model="loading"
        :finished="isFinished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesList } from '@/api'
import ArticleItem from './ArticleItem.vue'
export default {
  name: 'ArticleList',
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      isFinished: false,
      error: false,
      refreshing: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticlesList()
  },
  methods: {
    async getArticlesList() {
      try {
        const { data } = await getArticlesList(this.id, +new Date())
        // console.log(data)
        this.articles = data.data.results
        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        const status = error.response.status
        // console.log(error)
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    async onLoadNextPage() {
      try {
        const { data } = await getArticlesList(this.id, this.pre_timestamp)
        console.log(data)

        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }

        if (this.refreshing) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }

        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshing = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
