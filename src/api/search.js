import request from '@/utils/request'

export const getSearchSuggestions = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: { q }
  })
}
