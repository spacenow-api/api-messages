const messageItemService = require('../../services/message-item.service')
const r = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  const { id } = event.pathParameters
  const { userId } = event.queryStringParameters
  context.callbackWaitsForEmptyEventLoop = false
  messageItemService
    .countUnreadMessageItems(id, userId)
    .then((data) => callback(null, r.success(data)))
    .catch((err) => callback(null, r.failure(err)))
}
