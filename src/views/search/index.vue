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

    <component
      :is="componentName"
      :keyWords="keywords"
      @searchItem="searchItems"
      :results="items"
      :items="itemList"
      @delItems="delIeme"
      @delAllItem="delAll"
      @toSearch="toSearchHistory"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import { removeItem, setItemLIST, getItemLIST } from '@/api'
export default {
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data() {
    return {
      keywords: '',
      isShowSearchResults: false,
      items: '',
      itemList: getItemLIST() || []
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
        return 'SearchResult'
      }
      // 显示搜索建议
      return 'SearchSuggestion'
    }
  },
  methods: {
    onSearch(val) {
      this.isShowSearchResults = true
      // console.log(123)
      this.items = val
      // console.log(this.itemList.indexOf(val) !== -1)
      if (val.trim() !== '' && this.itemList.indexOf(val) === -1) {
        this.itemList.unshift(val)
        setItemLIST(this.itemList)
      } else if (val.trim() !== '' && this.itemList.indexOf(val) !== -1) {
        const index = this.itemList.indexOf(val)
        // console.log(index)
        this.itemList.splice(index, 1)
        this.itemList.unshift(val)
        setItemLIST(this.itemList)
      }
    },
    backToPrePage() {
      this.$router.go(-1)
    },
    visibleSearchSuggestion() {
      this.isShowSearchResults = false
    },
    searchItems(q) {
      this.items = q
      // this.onSearch()
      // console.log(q)
      this.isShowSearchResults = true

      this.keywords = this.items
      if (this.itemList.indexOf(q) === -1) {
        this.itemList.unshift(q)
        setItemLIST(this.itemList)
      } else {
        const index = this.itemList.indexOf(q)
        this.itemList.splice(index, 1)
        this.itemList.unshift(q)
        setItemLIST(this.itemList)
      }
    },
    delIeme(index) {
      // console.log(index)
      this.itemList.splice(index, 1)
      setItemLIST(this.itemList)
    },
    delAll() {
      removeItem()
      this.itemList = getItemLIST() || []
    },
    toSearchHistory(val) {
      // console.log(val)
      this.items = val
      this.isShowSearchResults = true
      this.keywords = this.items
      // ---------------------------
      const index = this.itemList.indexOf(val)
      this.itemList.splice(index, 1)
      this.itemList.unshift(val)
      setItemLIST(this.itemList)

      // console.log(index)
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
