const User = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: 'You shall not pass!',
    })
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body
    const result = await User.findBy({ username })

    if (!result.length) {
      next()
    } else {
      next({
        status: 422,
        message: 'Username taken',
      })
    }
  } catch (err) {
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  const { username } = req.body
  try {
    const user = await User.findBy({ username })
    if (user.length) {
      req.user = user[0]
      next()
    } else {
      next({
        status: 401,
        message: 'Invalid credentials',
      })
    }
  } catch (err) {
    next(err)
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body

  if (!password || password.length < 3) {
    next({
      status: 422,
      message: 'Password must be longer than 3 chars',
    })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
