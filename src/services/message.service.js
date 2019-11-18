'use strict'

const { Op } = require('sequelize')

const { Message, MessageItem, MessageHost } = require('../../db/models')
const paginate = require('../helpers/paginate.utils')
const reservationUtils = require('./../helpers/reservation.utils')

const postMessage = async (value) => {
  const values = {
    where: {
      listingId: value.listingId,
      hostId: value.hostId,
      guestId: value.guestId
    }
  }
  try {
    let data = await Message.findOne(values)
    if (!data) {
      data = await Message.create(values.where)
      if (value.contactHost) {
        const messageHostValues = getNewContactHostMessage(value.contactHost)
        await MessageHost.create({
          ...messageHostValues,
          messageId: data.id
        })
      }
    }
    await MessageItem.create({
      messageId: data.id,
      sentBy: value.guestId,
      content: value.content
    })
    return getMessage(data.id)
  } catch (error) {
    throw error
  }
}

const getMessage = async (id) => {
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
  } catch (error) {
    throw error
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
    order: [
      ['isRead', 'ASC'],
      ['updatedAt', 'DESC']
    ],
    include: [
      {
        model: MessageItem,
        as: 'messageItems',
        order: [
          ['isRead', 'ASC'],
          ['createdAt', 'DESC']
        ],
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
      messages.rows.map((o) => {
        if (o.messageHost) {
          o.messageHost.reservations = o.messageHost.reservations.split(',')
        }
        return o
      })
    }
    return messages
  } catch (error) {
    throw error
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
  } catch (error) {
    throw error
  }
}

const readMessage = async (id, userId) => {
  try {
    const valueToUpdate = await Message.findOne({ where: { id } })
    if (!valueToUpdate) throw new Error(`Message ${id} not found.`)
    try {
      await Message.update({ isRead: 1 }, { where: { id } })
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
  } catch (error) {
    throw error
  }
}

const getNewContactHostMessage = (details) => {
  const messageHost = {
    bookingPeriod: details.bookingPeriod,
    period: details.period,
    flexibleTime: details.hasFlexibleTime ? 1 : 0,
    peopleQuantity: details.peopleQuantity,
    reason: details.reason
  }
  messageHost.reservations = [...details.reservations].join(',')
  if (details.bookingPeriod === 'hourly') {
    messageHost.reservations = [details.reservations[0]]
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
