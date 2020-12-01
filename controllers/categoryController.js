const db = require('../models')
const { Category } = db


const categoryController = {

  getCategories: (req, res) => {
    Category.findAll({ nest: true, raw: true }).then(categories => { return res.render('admin/categories', { categories }) })

  }

}

module.exports = categoryController
