const db = require('../models')
const restaurant = require('../models/restaurant')
const { Restaurant } = db
const { User } = db
const { Category } = db
const fs = require('fs')
const imgur = require('imgur-node-api')
const category = require('../models/category')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService')


const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => { return res.render('admin/restaurants', data) })
  },

  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then(categories => {
      return res.render('admin/create', { categories })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === "error") {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')

    })

  },

  getRestaurant: (req, res) => {

    //用findByPk / raw:true的方法 
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
    //用findByPk / toJSON的方法
    // return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => { return res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) })

    //用findOne / toJSON的方法
    // return Restaurant.findOne({ where: { id: req.params.id, }, include: [Category] }).then(restaurant => res.render('admin/restaurant', { restaurant: restaurant.toJSON() }))

    //用findOne / raw:true的方法 
    // return Restaurant.findOne({ nest: true, raw: true, include: [Category], where: { id: req.params.id } }).then(restaurant => {
    //   res.render('admin/restaurant', { restaurant })
    // })
  },

  editRestaurant: (req, res) => {
    Category.findAll({ nest: true, raw: true, }).then(categories => {
      return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => { return res.render('admin/create', { restaurant, categories }) })

    })

  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })

    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === "success") {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true, nest: true }).then(users => { return res.render('admin/users', { users }) })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: user.isAdmin ? false : true
      }).then(() => {
        req.flash('success_messages', 'user was successfully updated ')
        return res.redirect('/admin/users')
      })

    })
  }

}
module.exports = adminController