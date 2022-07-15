import storage from './storage'

const TOKEN_KEY = 'token'
export const getToken = () => storage.get(TOKEN_KEY)

export const setToken = (value) => storage.set(TOKEN_KEY, value)

export const removeToken = () => storage.remove(TOKEN_KEY)
