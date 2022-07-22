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
