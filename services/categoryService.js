const express = require('express')
const db = require('../models')
const { Restaurant, User, Category } = db

let categoryService = {
  getCategories: (req, res, callback) => {
    if (req.params.id) {
      return Category.findByPk(req.params.id, { nest: true, raw: true }).then((category) => {
        Category.findAll({ nest: true, raw: true }).then(categories => { callback({ categories, category }) })
      })
    } return Category.findAll({ nest: true, raw: true }).then(categories => { callback({ categories }) })

  }
}

module.exports = categoryService

