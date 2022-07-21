<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadToPage"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :offset="300"
    >
      <van-cell v-for="obj in resultsList" :key="obj.art_id">
        <template #title> {{ obj.title }}</template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchItems } from '@/api'
export default {
  data() {
    return {
      resultsList: [],
      loading: false,
      finished: false,
      page: 1,
      error: false
    }
  },
  props: {
    results: {
      type: String,
      required: true
    }
  },
  created() {
    this.getSearchItems()
  },
  methods: {
    async getSearchItems() {
      try {
        // console.log(this.results)
        const res = await getSearchItems(this.results)
        // console.log(res)
        this.resultsList = res.data.data.results
        // console.log(this.resultsList)
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else if (status === 507) {
          throw new Error(error.response.data.message)
        } else if (status === 401) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请刷新重试！')
        }
      }
    },
    async onLoadToPage() {
      try {
        // console.log(this.page)
        // 测试
        // if (Math.random() < 0.7) {
        //   throw new Error(123)
        // }
        this.page++
        const {
          data: { data }
        } = await getSearchItems(this.results, this.page)
        // console.log(data.results.length === 0)
        if (data.results.length === 0) {
          this.finished = true
        }
        this.resultsList.push(...data.results)
        // console.log(data)
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
