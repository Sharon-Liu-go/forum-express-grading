const express = require('express')
const db = require('../../models')
const { Restaurant, User, Category } = db
const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController
