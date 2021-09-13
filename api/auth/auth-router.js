const router = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require('./auth-middleware')

router.post(
  '/register',
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      const hash = bcrypt.hashSync(password, 8)
      const newUser = { username, password: hash }
      const user = await User.add(newUser)

      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
)

router.post(
  '/login',

  checkUsernameExists,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      const [exsitingUser] = await User.findBy({ username })

      if (exsitingUser && bcrypt.compareSync(password, exsitingUser.password)) {
        req.session.user = exsitingUser
        res.json({
          message: `Welcome ${exsitingUser.username}`,
        })
      } else {
        next({
          status: 401,
          message: 'Invalid credentials',
        })
      }
    } catch (err) {
      next(err)
    }
  },
)

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err)
      } else {
        res.status(200).json({
          message: 'logged out',
        })
      }
    })
  } else {
    res.status(200).json({
      message: 'no session',
    })
  }
})

module.exports = router
