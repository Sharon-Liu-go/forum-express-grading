'use strict';

const faker = require('faker')
const db = require('../models')
const { Restaurant, User } = db

function userId() {
  User.findAll().then((users) => {
    const userIdArray = users.map(u => u.id)
    const index = Math.floor(Math.random() * userIdArray.length)
    const userId = userIdArray[index]
    return userId
  })
}

function resId() {
  Restaurant.findAll().then((res) => {
    const resIdArray = res.map(u => u.id)
    const index = Math.floor(Math.random() * resIdArray.length)
    const resId = resIdArray[index]
    return resId
  })
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }).map((d, i) =>
        ({
          text: faker.lorem.sentence(),
          UserId: userId(),
          RestaurantId: resId(),
          createdAt: new Date(),
          updatedAt: new Date()

        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}