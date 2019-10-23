'use strict'

const { MessageItem } = require('../../db/models')
const paginate = require('../helpers/paginate.utils')
const { Op } = require('sequelize')

const postMessageItem = async value => {
  try {
    const data = await MessageItem.create(value)
    return data
  } catch (error) {
    throw error
  }
}

const getMessageItems = async (id, pageIndex = 0, pageSize = 10) => {
  try {
    const data = await MessageItem.findAndCountAll({
      ...paginate(pageIndex, pageSize),
      where: { messageId: id },
      order: [['createdAt', 'DESC']]
    })
    return data
  } catch (error) {
    throw error
  }
}

const countUnreadMessageItems = async (id, userId) => {
  try {
    let data = await MessageItem.count({
      where: {
        sentBy: {
          [Op.ne]: userId
        },
        messageId: id,
        isRead: 0
      }
    })
    return data
  } catch (error) {
    throw error
  }
}

const readMessageItems = async id => {
  try {
    const valueToUpdate = await MessageItem.findOne({ where: { messageId: id } })
    if (!valueToUpdate) throw new Error(`Message Item ${id} not found.`)
    const data = await MessageItem.update({ isRead: 1 }, { where: { messageId: id } })
    return { isRead: data[0] }
  } catch (error) {
    throw error
  }
}

module.exports = { postMessageItem, getMessageItems, countUnreadMessageItems, readMessageItems }
