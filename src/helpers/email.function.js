const AWS = require('aws-sdk')

const lambda = new AWS.Lambda()

module.exports.onSendEmail = (emailFunctionName, messageId) => {
  return new Promise((resolve, reject) => {
    lambda.invoke(
      {
        FunctionName: emailFunctionName,
        Payload: JSON.stringify({ pathParameters: { messageId: messageId } })
      },
      error => {
        if (error) {
          reject(error)
        } else {
          console.info(`Email sent with success by message ${messageId}`)
          resolve()
        }
      }
    )
  })
}
