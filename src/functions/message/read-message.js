const messageService = require('../../services/message.service')
const r = require('../../helpers/response.utils')

module.exports.main = (event, context, callback) => {
  const { id } = event.pathParameters
  const { userId } = event.queryStringParameters
  context.callbackWaitsForEmptyEventLoop = false
  messageService
    .readMessage(id, userId)
    .then((data) => callback(null, r.success(data)))
    .catch((err) => callback(null, r.failure(err)))
}
