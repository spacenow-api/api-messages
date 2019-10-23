'use strict'
module.exports = (sequelize, DataTypes) => {
  const MessageItem = sequelize.define(
    'MessageItem',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'id'
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'message_id'
      },
      sentBy: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'sent_by'
      },
      content: {
        type: DataTypes.TEXT,
        field: 'content'
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_read'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    },
    {
      tableName: 'message_item',
      indexes: [
        {
          unique: true,
          fields: ['message_id']
        },
        {
          unique: true,
          fields: ['is_read']
        }
      ]
    }
  )
  return MessageItem
}
