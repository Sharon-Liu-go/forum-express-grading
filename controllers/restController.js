const db = require("../models")
const restaurant = require("../models/restaurant")
const { Restaurant, Category } = db
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
      console.log(result)
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
    Restaurant.findByPk(req.params.id, { nest: true, raw: true, include: [Category] }).then(restaurant => {
      return res.render('restaurant', { restaurant })
    })
  }



}

module.exports = restController


