<template>
  <div>
    <!-- hearder -->
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        @focus="visibleSearchSuggestion"
      />
    </form>

    <component :is="componentName" :keyWords="keywords"></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data() {
    return {
      keywords: '',
      isShowSearchResults: false
    }
  },
  computed: {
    componentName() {
      // 显示搜索历史
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      // 显示搜索结果
      if (this.isShowSearchResults) {
        return 'SearchResults'
      }
      // 显示搜索建议
      return 'SearchSuggestion'
    }
  },
  methods: {
    onSearch() {
      this.isShowSearchResults = true
      console.log(123)
    },
    backToPrePage() {
      this.$router.go(-1)
    },
    visibleSearchSuggestion() {
      this.isShowSearchSuggestions = false
    }
  }
}
</script>

<style scoped lang="less">
.van-search--show-action {
  background-color: #3296fa;
  .van-search__action {
    color: #fff;
  }
}
</style>
