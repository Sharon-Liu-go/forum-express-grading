const db = require("../models")
const restaurant = require("../models/restaurant")
const { Restaurant, Category } = db


const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ nest: true, raw: true, include: [Category] }).then(restaurants => {
      console.log(restaurants)
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      console.log(data)
      return res.render('restaurants', { restaurants: data })
    })
  }



}

module.exports = restController


