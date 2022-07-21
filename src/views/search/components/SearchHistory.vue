<template>
  <div class="main">
    <van-cell title="搜索历史">
      <template>
        <van-icon name="delete-o" v-show="isShow" @click="isShow = !isShow" />
        <div v-show="!isShow">
          <span @click="delAll">全部删除</span>
          <span @click="isShow = !isShow"> 完成</span>
        </div>
      </template>
    </van-cell>
    <van-cell
      :title="obj"
      v-for="(obj, index) in items"
      :key="index"
      @click="toSearch(obj)"
    >
      <template>
        <van-icon name="close" v-show="!isShow" @click.stop="delItem(index)" />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    toSearch(val) {
      // console.log(val)
      this.$emit('toSearch', val)
    },
    delItem(index) {
      // console.log(index)
      this.$emit('delItems', index)
    },
    delAll() {
      // console.log(123)
      this.$emit('delAllItem')
    }
  }
}
</script>

<style scoped lang="less">
.main {
  background-color: #f5f7f9;
  height: 100vh;
}
</style>
