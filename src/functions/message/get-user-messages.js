const messageService = require('../../services/message.service')
const r = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const {
    pageIndex = 0,
    pageSize = 10,
    type = 'host'
  } = event.queryStringParameters
  const { id } = event.pathParameters
  messageService
    .getUserMessages(id, type, pageIndex, pageSize)
    .then((data) => callback(null, r.success(data)))
    .catch((err) => {
      console.error('error in graph qpi', err)
      return callback(null, r.failure(err))
    })
}
