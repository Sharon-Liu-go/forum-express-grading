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
  }
}

module.exports = adminService