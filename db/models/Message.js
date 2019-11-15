'use strict'

module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      listingId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Listing',
          key: 'id'
        }
      },
      hostId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      guestId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      isRead: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'Message'
    }
  )

  Message.associate = function(models) {
    Message.hasMany(models.MessageItem, {
      as: 'messageItems',
      foreignKey: 'messageId'
    })
  }

  return Message
}
