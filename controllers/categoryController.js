const db = require('../models')
const { Category } = db
const categoryService = require('../services/categoryService')


const categoryController = {

  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategories: (req, res) => {
    categoryService.postCategories(req, res, (data) => {
      if (data["status"] === "error") {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    }).catch(err => console.log(err))
  },

  putCategories: (req, res) => {
    categoryService.putCategories(req, res, (data) => {
      if (data['status'] === "error") {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      } req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    }).catch(err => console.log(err))
  },

  deleteCategories: (req, res) => {
    return Category.findByPk(req.params.id).then((category) => category.destroy()).then(() => {
      req.flash('success_messages', '成功刪除一筆類別')
      res.redirect('/admin/categories')
    }).catch(err => console.log(err))
  }


}
module.exports = categoryController
