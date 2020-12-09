import http from '@/utils/request.js'
export const reqGetChannel = () => {
  return http({
    method: 'get',
    url: '/mp/v1_0/channels'
  })
}
export const reqGetArticlesList = (queryObj) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/articles',
    params: queryObj || {}
  })
}
export const reqDelArticles = (articleId) => {
  return http({
    method: 'delete',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
export const reqAddArticles = (draft, articleObj) => {
  return http({
    method: 'post',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data: articleObj
  })
}
