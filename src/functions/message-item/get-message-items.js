const messageItemService = require('../../services/message-item.service')
const { success, failure } = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const { pageIndex, pageSize } = event.queryStringParameters
  const { id } = event.pathParameters
  messageItemService
    .getMessageItems(id, pageIndex || 0, pageSize || 5)
    .then(data => callback(null, success(data)))
    .catch(err => callback(null, failure(err)))
}
