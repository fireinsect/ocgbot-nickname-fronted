import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/nickName/getList',
    method: 'get',
    params: query
  })
}
export function fetchCardList(query) {
  return request({
    url: '/nickName/getList',
    method: 'get',
    params: query
  })
}

export function getJson() {
  return request({
    url: '/nickName/getJson',
    method: 'get'
  })
}

export function useNickName(data) {
  return request({
    url: '/nickName/useName',
    method: 'post',
    data
  })
}

// 需要实现自动判断是更新还是创建
export function updateNickName(data) {
  return request({
    url: '/nickName/update',
    method: 'post',
    data
  })
}

export function addNickName(data) {
  return request({
    url: '/nickName/add',
    method: 'post',
    data
  })
}

export function deleteNickName(data) {
  return request({
    url: '/nickName/delete',
    method: 'post',
    data
  })
}
