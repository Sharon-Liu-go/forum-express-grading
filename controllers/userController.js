const db = require('../models')
const { Restaurant, Category, User, Comment, Favorite, Like, Followship } = db
const bcrypt = require('bcryptjs')
const fs = require('fs')
const imgur = require('imgur-node-api')
const favorite = require('../models/favorite')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const followship = require('../models/followship')

function userId() {
  const users = User.findAll()
  Promise.all([users])
    .then((users) => {
      users = users[0].map(u => u.id)
      const index = Math.floor(Math.random() * users.length)
      return users[index]
    }).catch(error => console.log(error))
}

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else if (req.body.email.indexOf(" ") >= 0) {
      req.flash('error_messages', '信箱不能有空格！')
      return res.redirect('/signup')
    } else if (req.body.email.indexOf("@") <= 0) {
      req.flash('error_messages', 'email欄位不是郵箱地址')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })
            .then(() => {
              req.flash('success_messages', '成功註冊帳號！')
              res.redirect('/signin')
            })
        }
      })
    }
  },

  signInPage: (req, res) => {
    const commentUserId = userId()
    console.log(`userId:${commentUserId}`)
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: [{ model: Comment, include: [Restaurant] }, { model: Restaurant, as: 'FavoritedRestaurants' }, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }] }).then(user => {
      const isFollowed = user.Followers.map(u => u.id).includes(helpers.getUser(req).id)
      return res.render('userProfile', { userData: user.toJSON(), isFollowed, })
    })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      return res.render('editProfile', { user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Please input name")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            }).then((user) => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${user.id}`)
            }
            )
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect(`/users/${user.id}`)
          }).catch(err => console.log(err))
        })
    }
  },

  deleteUserImage: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      user.update({ image: null })
      return res.redirect(`/users/${user.id}/edit`)
    })
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => { return res.redirect('back') })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => { return res.redirect('back') })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => { return res.redirect('back') })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then((like) => { like.destroy().then((restaurant) => { return res.redirect('back') }) })
  },

  getTopUser: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: helpers.getUser(req).Followings.map(u => u.id).includes(user.id)

        }))
        // 依追蹤者人數排序清單
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        return res.render('topUser', { users: users })
      })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    }).then(followship => {
      followship.destroy().then(followship => { return res.redirect('back') })
    })
  }

}
module.exports = userController


