'use strict'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'MessageHost',
    {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      messageId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'Message',
          key: 'id'
        }
      },
      flexibleTime: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      },
      peopleQuantity: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: '1'
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      reservations: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      startTime: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      endTime: {
        type: DataTypes.STRING(10),
        allowNull: true
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
      tableName: 'MessageHost'
    }
  )
}
