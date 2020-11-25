const db = require('../models')
const { Restaurant } = db

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true }).then(restaurants => { return res.render('admin/restaurants', { restaurants: restaurants }) })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "沒有餐廳名稱")
      return res.redirect('back')
    }
    return Restaurant.create(req.body).then(() => {
      req.flash('success_messages', "成功新增一筆餐廳")
      res.redirect('/admin/restaurants')
    })

  }
}




module.exports = adminController