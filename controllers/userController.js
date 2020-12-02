const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

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
    User.findByPk(req.params.id).then(user => {
      return res.render('userProfile', { user: user.toJSON() })
    })
  },

  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      console.log(user.toJSON())
      return res.render('editProfile', { user: user.toJSON() })
    })
  }
}
module.exports = userController


