const db = require('../models')
const { Comment } = db


const commentController = {
  postComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    }).then(() =>
      res.redirect('back')
      // res.redirect(`/restaurants/${req.body.restaurantId}`)
    )
  }
}



module.exports = commentController