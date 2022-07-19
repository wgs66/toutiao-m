import request from '@/utils/request'
import storage from '@/utils/storage'
/**
 * 获取用户频道
 * @returns Promise
 */
export const getMyChannel = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

/**
 * 获取所有频道列表
 * @returns Promise
 */
export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}

/**
 *  删除用户频道
 * @param {String} target 删除用户的id
 * @returns  Promise
 */

export const delMychannels = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}

export const addChannel = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    data: { channels: [{ id, seq }] },
    method: 'PATCH'
  })
}

const HEIMA_TOUTIAO_CHANNELS = 'HEIMA_TOUTIAO_CHANNELS'
export const getMyChannelByLocal = () => storage.get(HEIMA_TOUTIAO_CHANNELS)
export const setMyChannelByLocal = (channel) =>
  storage.set(HEIMA_TOUTIAO_CHANNELS, channel)
