class Storage {
  // localStorage.setItem('token', JSON.stringify(token))
  set(key, value) {
    // 因为本地存储内存放的是json字符串，
    // 本地存放对象形式的是需要转json字符串的，但是存储的也有可能不是对象,比如字符串 所有要判断类型
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }

  // JSON.parse(localStorage.getItem('token')) || {}
  get(key) {
    // 把获取来的值存储起来。使用json.parse吧json字符串转化为对象。
    // 使用try catch try 试一下能不能转换 如果能转直接返回，如果不能转走 catch
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  // 清除本地存储
  remove(key) {
    localStorage.removeItem(key)
  }
}

const storage = new Storage()

export default storage
