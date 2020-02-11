'use strict'

const { Op } = require('sequelize')

const { Message, MessageItem, MessageHost } = require('../../db/models')
const paginate = require('../helpers/paginate.utils')
const reservationUtils = require('./../helpers/reservation.utils')
const { onSendEmail } = require('./../helpers/email.function')

const postMessage = async value => {
  try {
    const data = await Message.create({
      listingId: value.listingId,
      hostId: value.hostId,
      guestId: value.guestId
    })
    await MessageItem.create({
      messageId: data.id,
      sentBy: value.guestId,
      content: value.content
    })
    console.log('value', value)
    if (value.contactHost) {
      const messageHostValues = getNewContactHostMessage(value.contactHost)
      await MessageHost.create({
        ...messageHostValues,
        messageId: data.id
      })
      if (messageHostValues.reason === 'inspection') {
        // Send inspection emails
        // await onSendEmail(`api-emails-${process.env.environment}-sendEmailInspectionNotification`, data.id)
        await onSendEmail(`api-emails-sandpit-sendEmailInspectionNotification`, data.id)
      }
    }

    return getMessage(data.id)
  } catch (err) {
    throw new Error(err)
  }
}

const getMessage = async id => {
  try {
    const data = await Message.findOne({
      where: {
        id
      },
      include: [
        {
          model: MessageItem,
          as: 'messageItems',
          order: [['createdAt', 'DESC']],
          separate: true
        },
        {
          model: MessageHost,
          as: 'messageHost'
        }
      ]
    })
    if (data && data.messageHost) {
      data.messageHost.reservations = data.messageHost.reservations.split(',')
    }
    return data
  } catch (err) {
    throw new Error(err)
  }
}

const getUserMessages = async (id, type, pageIndex = 0, pageSize = 10) => {
  let condition = { hostId: id }
  if (type === 'guest') {
    condition = { guestId: id }
  }
  const where = {
    where: condition,
    ...paginate(pageIndex, pageSize),
    order: [['updatedAt', 'DESC'], ['isRead', 'ASC']],
    include: [
      {
        model: MessageItem,
        as: 'messageItems',
        order: [['isRead', 'ASC'], ['createdAt', 'DESC']],
        limit: 1,
        separate: true
      },
      {
        model: MessageHost,
        as: 'messageHost'
      }
    ]
  }
  try {
    const messages = await Message.findAndCountAll(where)
    if (messages && messages.rows) {
      messages.rows.map(o => {
        if (o.messageHost) {
          o.messageHost.reservations = o.messageHost.reservations.split(',')
        }
        return o
      })
    }
    return messages
  } catch (err) {
    throw new Error(err)
  }
}

const countUnreadMessages = async (id, type) => {
  let where = { hostId: id }
  try {
    if (type === 'guest') {
      where = { guestId: id }
    }
    where = { ...where, isRead: false }
    const data = await Message.count({
      where
    })
    return { count: data }
  } catch (err) {
    throw new Error(err)
  }
}

const readMessage = async (id, userId) => {
  try {
    const valueToUpdate = await Message.findOne({ where: { id } })
    if (!valueToUpdate) throw new Error(`Message ${id} not found.`)
    try {
      // await Message.update({ isRead: 1 }, { where: { id } })
      await MessageItem.update(
        { isRead: 1 },
        {
          where: {
            messageId: id,
            sentBy: {
              [Op.ne]: userId
            }
          }
        }
      )
    } catch (err) {
      console.error(err)
      return { isRead: 0 }
    }
    return { isRead: 1 }
  } catch (err) {
    throw new Error(err)
  }
}

const getNewContactHostMessage = details => {
  const messageHost = {
    bookingPeriod: details.bookingPeriod,
    period: details.period,
    flexibleTime: details.hasFlexibleTime ? 1 : 0,
    peopleQuantity: details.peopleQuantity,
    reason: details.reason
  }
  messageHost.reservations = [...details.reservations].join(',')
  if (details.bookingPeriod === 'hourly') {
    messageHost.reservations = [details.reservations[0]].toString()
    messageHost.startTime = details.checkInTime
    messageHost.endTime = details.checkOutTime
  }
  if (details.bookingPeriod.includes('weekly', 'monthly')) {
    const endDate = reservationUtils.getEndDate(details.reservations[0], details.period, details.bookingPeriod)
    const fullReservation = reservationUtils.getDates(details.reservations[0], endDate)
    const sortedReservation = reservationUtils.onSortDates(fullReservation)
    messageHost.reservations = sortedReservation.join(',')
  }
  return messageHost
}

module.exports = {
  postMessage,
  getMessage,
  getUserMessages,
  countUnreadMessages,
  readMessage
}
