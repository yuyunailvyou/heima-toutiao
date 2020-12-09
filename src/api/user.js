import http from '@/utils/request.js'
import { getUser } from '@/utils/storage.js'
export const reqGetLogin = (objform) => {
  return http({
    method: 'post',
    url: '/mp/v1_0/authorizations',
    data: objform
  })
}
export const reqGetUserInfo = () => {
  const token = getUser().token
  return http({
    method: 'get',
    url: '/mp/v1_0/user/profile'

  })
}

export const reqEditProfile = (obj) => {
  return http({
    method: 'patch',
    url: '/mp/v1_0/user/profile',
    data: obj
  })
}

// 编辑用户头像
export const reqEditPhoto = (formData) => {
  return http({
    method: 'patch',
    url: '/mp/v1_0/user/photo',
    data: formData
  })
}
