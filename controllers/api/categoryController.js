const express = require('express')
const db = require('../../models')
const { Restaurant, User, Category } = db
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, (data) => {
      if (data["status"] === "error") {
        return res.json(data)
      }
      req.flash('success_messages', data['message'])
      return res.json(data)
    }).catch(err => console.log(err))
  },
  putCategories: (req, res) => {
    categoryService.putCategories(req, res, (data) => {
      if (data['status'] === "error") {
        return res.json(data)
      }
      return res.json(data)
    }).catch(err => console.log(err))
  },
  deleteCategories: (req, res) => {
    categoryService.deleteCategories(req, res, data => {
      return res.json(data)
    }).catch(err => console.log(err))
  }
}

module.exports = categoryController

