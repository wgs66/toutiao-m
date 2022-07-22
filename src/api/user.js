import request from '@/utils/request'

/**
 * 登录
 * @param {String} mobile 手机号
 * @param {String} code  验证码
 * @returns Promise
 */

export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

/**
 *发送验证码
 * @param {String} mobile 手机号
 * @returns Promise
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 *获取用户自己的信息
 * @returns Promise
 */
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}

/**
 * 获取关注信息
 * @returns Promise
 */
export const getFollowings = () => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST'
  })
}

/**
 * 关注用户
 * @param {Number} target 文章id
 * @returns Promise
 */
export const postFollowings = (target) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: { target }
  })
}

/**
 * 取消关注用户
 * @param {Number} target 文章id
 * @returns Promise
 */
export const delFollowings = (target) => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}
