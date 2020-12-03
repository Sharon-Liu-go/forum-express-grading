const db = require("../models")
const restaurant = require("../models/restaurant")
const { Restaurant, Category, User, Comment } = db
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ""

    if (req.query.page) {
      offSet = (Number(req.query.page) - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId

    }
    Restaurant.findAndCountAll({ include: [Category], where: whereQuery, offset: offset, pageLimit: pageLimit }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name
      }))
      Category.findAll({ nest: true, raw: true }).then(categories => {
        return res.render('restaurants', { restaurants: data, categories, categoryId, totalPage, prev, next, page })
      })

    })
  },

  getRestaurant: (req, res) => {

    Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] }).then(restaurant => {
      restaurant.update({
        viewCounts: restaurant.viewCounts + 1
      })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
  },

  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },

  getDashboard: (req, res) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: [User] }] })
    ]).then(([restaurant]) => {
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    })

  }
}

module.exports = restController


