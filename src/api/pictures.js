import http from '@/utils/request.js'
export const reqGetPictures = (queryObj) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/user/images',
    params: queryObj || {}
  })
}
export const reqGetPictureCollect = (id, collect) => {
  return http({
    method: 'put',
    url: `/mp/v1_0/user/images/${id}`,
    data: {
      collect
    }
  })
}
export const reqDelPictures = (id) => {
  return http({
    method: 'delete',
    url: `/mp/v1_0/user/images/${id}`
  })
}
