const db = require('../models')
const { Restaurant, Category, User, Comment } = db
const bcrypt = require('bcryptjs')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    let countOfComments = 0
    User.findByPk(req.params.id, { include: { model: Comment, include: [Restaurant] } }).then(user => {
      User.count({ where: { id: req.params.id }, include: { model: Comment, include: [Restaurant] } }).then(count => {
        countOfComments = user.Comments.length ? count : 0
        return res.render('userProfile', { user: user.toJSON(), count: countOfComments })
      })
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
    console.log('==========')
    User.findByPk(req.params.id).then(user => {
      user.update({ image: null })
      return res.redirect(`/users/${user.id}/edit`)
    })
  }
}
module.exports = userController


