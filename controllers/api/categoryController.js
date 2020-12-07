const express = require('express')
const db = require('../../models')
const { Restaurant, User, Category } = db
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      if (req.params.id) {
        return Category.findByPk(req.params.id, { nest: true, raw: true }).then((category) => {
          Category.findAll({ nest: true, raw: true }).then(categories => { return res.render('admin/categories', data) })
        })
      } return Category.findAll({ nest: true, raw: true }).then(categories => { return res.render('admin/categories', data) })
    })

  }
}

module.exports = categoryController

