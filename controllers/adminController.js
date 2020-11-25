const db = require('../models')
const restaurant = require('../models/restaurant')
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
  },

  getRestaurant: (req, res) => {

    //用findByPk / raw:true的方法 
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => { return res.render('admin/restaurant', { restaurant }) })

    //用findByPk / toJSON的方法
    // return Restaurant.findByPk(req.params.id).then(restaurant => { return res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) })

    //用findOne / toJSON的方法
    // return Restaurant.findOne({ where: { id: req.params.id } }).then(restaurant => res.render('admin/restaurant', { restaurant: restaurant.toJSON() }))

    //用findOne / raw:true的方法 
    // return Restaurant.findOne({ raw: true, where: { id: req.params.id } }).then(restaurant => res.render('admin/restaurant', { restaurant }))
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => { return res.render('admin/create', { restaurant }) })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update(req.body)
          .then((restaurant) => {
            req.flash('success_messages', "成功修改一筆資料")
            return res.redirect('/admin/restaurants')
          })

      })
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            req.flash('success_messages', "成功刪除一筆資料")
            return res.redirect('/admin/restaurants')
          })

      })
  }

}


module.exports = adminController