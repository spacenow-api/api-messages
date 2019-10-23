'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('message_item', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true
        },
        message_id: {
          type: Sequelize.UUID,
          allowNull: false
        },
        sent_by: {
          type: Sequelize.UUID,
          allowNull: false
        },
        content: {
          type: Sequelize.UUID,
          allowNull: false
        },
        is_read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      })
      .then(() =>
        queryInterface.addConstraint('message_item', ['message_id'], {
          type: 'foreign key',
          name: 'fk_m_item_message_id',
          references: {
            table: 'message',
            field: 'id'
          }
        })
      )
      .then(() =>
        queryInterface.addConstraint('message_item', ['sent_by'], {
          type: 'foreign key',
          name: 'fk_user_sent_by_id',
          references: {
            table: 'User',
            field: 'id'
          }
        })
      )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message_item')
  }
}
