import request from '@/utils/request'
import storage from '@/utils/storage'

/**
 * 获取搜索建议
 * @param {*} q
 * @returns
 */
export const getSearchSuggestions = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: { q }
  })
}

/**
 * 获取搜索结果
 * @param {*} q
 * @returns
 */
export const getSearchItems = (q, page) => {
  return request({
    url: '/v1_0/search',
    params: { q, page }
  })
}

const ITEM_LIST = 'ITEM_LIST'

export const getItemLIST = () => storage.get(ITEM_LIST)
export const setItemLIST = (item) => storage.set(ITEM_LIST, item)
export const removeItem = () => storage.remove(ITEM_LIST)
