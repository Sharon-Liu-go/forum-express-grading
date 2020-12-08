const express = require('express')
const db = require('../models')
const { Restaurant, User, Category } = db

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true, nest: true, include: [Category]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { nest: true, raw: true, include: [Category] }).then(restaurant => {
      callback({ restaurant })
    })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            req.flash('success_messages', "成功刪除一筆資料")
            callback({ status: "success", message: " " })
          })
      })
  }
}
module.exports = adminService