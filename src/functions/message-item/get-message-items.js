const messageItemService = require('../../services/message-item.service')
const r = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  const { pageIndex = 0, pageSize = 10 } = event.queryStringParameters
  const { id } = event.pathParameters
  context.callbackWaitsForEmptyEventLoop = false
  messageItemService
    .getMessageItems(id, pageIndex, pageSize)
    .then((data) => callback(null, r.success(data)))
    .catch((err) => callback(null, r.failure(err)))
}
