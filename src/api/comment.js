import request from '@/utils/request'

/**
 * 获取评论或评论回复
 * @param {String} type 类型
 * @param {String | Number} id 传入的id
 * @returns Promise
 */
export const getCommentList = (type, source, offset, limit) => {
  return request({
    url: '/v1_0/comments',
    params: { type, source, offset, limit }
  })
}

/**
 * 对评论或回复评论点赞
 * @param {*} target 评论id
 * @returns Promise
 */
export const postCommentLikings = (target) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
}

/**
 * 取消对评论或回复评论点赞
 * @param {*} target 评论id
 * @returns Promise
 */
export const delCommentLikings = (target) => {
  return request({
    url: `/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}

/**
 * 对文章或评论进行评论
 * @param {*} target 评论目标id 文章id/评论id
 * @param {*} content 评论内容
 * @param {*} artId 文章id
 * @returns Promise
 */
export const postComments = (target, content, artId) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: { target, content, art_id: artId }
  })
}
