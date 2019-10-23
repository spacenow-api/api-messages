'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('message', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true
        },
        listing_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        host_id: {
          type: Sequelize.UUID,
          allowNull: false
        },
        guest_id: {
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
        queryInterface.addConstraint('message', ['listing_id'], {
          type: 'foreign key',
          name: 'fk_message_listing_id',
          references: {
            table: 'Listing',
            field: 'id'
          }
        })
      )
      .then(() =>
        queryInterface.addConstraint('message', ['host_id'], {
          type: 'foreign key',
          name: 'fk_user_host_id',
          references: {
            table: 'User',
            field: 'id'
          }
        })
      )
      .then(() =>
        queryInterface.addConstraint('message', ['guest_id'], {
          type: 'foreign key',
          name: 'fk_user_guest_id',
          references: {
            table: 'User',
            field: 'id'
          }
        })
      )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message')
  }
}
