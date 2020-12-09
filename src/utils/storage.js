const key = 'heima-73-system'
export const setUser = (obj) => {
  localStorage.setItem(key, JSON.stringify(obj))
}
export const getUser = () => {
  return JSON.parse(localStorage.getItem(key)) || {}
}
export const removeUser = () => {
  localStorage.removeItem(key)
}
