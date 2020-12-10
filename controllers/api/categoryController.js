const express = require('express')
const db = require('../../models')
const { Restaurant, User, Category } = db
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController

