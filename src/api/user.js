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
 *关注用户
 * @param {String} id //关注对象用户的id
 * @returns Promise
 */
export const followingsAPI = (id) =>
  request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })

/**
 *关注用户
 * @param {String} id //需要取消关注对象用户的id
 * @returns Promise
 */
export const cancelFollowingsAPI = (id) =>
  request({
    url: `/v1_0/user/followings/${id}`,
    method: 'DELETE'
  })
