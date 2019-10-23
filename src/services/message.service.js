'use strict'

const { Message } = require('../../db/models')
const { MessageItem } = require('../../db/models')
const paginate = require('../helpers/paginate.utils')
const { Op } = require('sequelize')

const postMessage = async value => {
  const values = {
    where: { listingId: value.listingId, hostId: value.hostId, guestId: value.guestId }
  }
  try {
    let data = await Message.findOne(values)
    if (!data) {
      data = await Message.create(values.where)
    }
    await MessageItem.create({
      messageId: data.id,
      sentBy: value.guestId,
      content: value.content
    })
    return data
  } catch (error) {
    throw error
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
        }
      ]
    })
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
    order: [['isRead', 'ASC'], ['updatedAt', 'DESC']],
    include: [
      {
        model: MessageItem,
        as: 'messageItems',
        order: [['isRead', 'ASC'], ['createdAt', 'DESC']],
        limit: 1,
        separate: true
      }
    ]
  }

  try {
    const data = await Message.findAndCountAll(where)
    return data
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

module.exports = { postMessage, getMessage, getUserMessages, countUnreadMessages, readMessage }
