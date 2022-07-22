import request from '@/utils/request'
/**
 * 获取文章新闻推荐
 * @param {*} channelId
 * @param {*} timestamp
 * @returns
 */
export const getArticlesList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}

/**
 * 获取新闻详情
 * @param {*} articleId
 * @returns
 */
export const getArticlesDetail = (articleId) => {
  return request({
    url: `/v1_0/articles/${articleId}`
  })
}

/**
 * 收藏文章
 * @param {Number} target 文章id
 * @returns Promise
 */
export const postCollection = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: { target }
  })
}

/**
 * 取消文章收藏
 * @param {Number} target 文章id
 * @returns Promise
 */
export const delCollection = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}

/**
 * 文章点赞
 * @param {Number} target 文章id
 * @returns Promise
 */
export const postLikings = (target) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: { target }
  })
}

/**
 * 取消文章点赞
 * @param {Number} target 文章id
 * @returns Promise
 */
export const delLikings = (target) => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
