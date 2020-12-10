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
  },

  postCategories: (req, res, callback) => {
    if (!req.body.name || (req.body.name.indexOf(" ") === 0)) {   //多一個首字不能為空格的判斷
      return callback({ status: "error", message: "請輸入類別名稱" })
    }
    return Category.create({ name: req.body.name }).then(() => {
      callback({ status: "success", message: "成功新增一筆分類" })
    }).catch(err => console.log(err))
  }
}

module.exports = categoryService

