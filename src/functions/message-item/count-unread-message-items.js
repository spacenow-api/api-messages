const messageItemService = require('../../services/message-item.service')
const r = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const { id } = event.pathParameters
  const { userId } = event.queryStringParameters
  messageItemService
    .countUnreadMessageItems(id, userId)
    .then((data) => callback(null, r.success(data)))
    .catch((err) => callback(null, r.failure(err)))
}
