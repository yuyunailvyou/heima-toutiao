import http from '@/utils/request.js'
export const reqGetComments = (page, per_page) => {
  return http({
    method: 'get',
    url: '/mp/v1_0/articles',
    params: {
      page,
      per_page,
      response_type: 'comment'
    }
  })
}
export const reqChangeCommentStatus = (articleId, flag) => {
  return http({
    method: 'put',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: flag
    }
  })
}
