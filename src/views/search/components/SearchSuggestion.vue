<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="clickItem($event)"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api'
export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keyWords: {
      type: String,
      required: true
    }
  },
  watch: {
    keyWords: {
      immediate: true,
      handler() {
        this.getSearchSuggestions()
      }
    }
  },
  computed: {
    highlightData() {
      const reg = new RegExp(this.keyWords, 'ig')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style='color:red'>${match}</span>`)
      )
    }
  },
  methods: {
    async getSearchSuggestions() {
      try {
        const res = await getSearchSuggestions(this.keyWords)
        // console.log(res)

        this.suggestions = res.data.data.options.filter(Boolean)
        if (this.suggestions.length === 0) {
          this.$toast.fail('没有更多提示了！')
        }
        // console.log(this.suggestions)
      } catch (error) {
        console.log(error)
      }
    },
    clickItem(e) {
      const q = e.target.innerText
      this.$emit('searchItem', q)
      // console.log(e.target.innerText)
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
  margin-right: 10px;
}
</style>
