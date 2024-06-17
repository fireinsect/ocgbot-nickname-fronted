import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/nickName/getList',
    method: 'get',
    params: query
  })
}
export function getSameNickName(query) {
  return request({
    url: '/nickName/getAllSameNickName',
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

export function getCard(query) {
  return request({
    url: '/nickName/getCard',
    method: 'get',
    params: query
  })
}

export function useNickName(data) {
  return request({
    url: '/nickName/useName',
    method: 'post',
    data
  })
}

export function updateNickName(data) {
  return request({
    url: '/nickName/update',
    method: 'post',
    data
  })
}

export function check(data) {
  return request({
    url: '/nickName/check',
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
