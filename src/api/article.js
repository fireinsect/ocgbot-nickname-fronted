import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}
export function fetchCardList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

// 需要实现自动判断是更新还是创建
export function updateNickName(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}

