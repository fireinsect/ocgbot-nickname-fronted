import store from 'store'
import Cookies from 'js-cookie'
const TokenKey = 'user-token'

export function getToken() {
  // return store.get(TokenKey)
  return Cookies.get(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 })
  // return store.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
  // return Cookies.remove(TokenKey)
}
