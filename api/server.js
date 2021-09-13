const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')

const authRouter = require('./auth/auth-router')
const userRouter = require('./users/users-router')

const server = express()

server.use(helmet())
server.use(express.json())
server.use(cors())

server.use(
  session({
    name: 'chocolatechip',
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  }),
)

server.use('/api/auth', authRouter)
server.use('/api/users', userRouter)
server.get('/', (req, res) => {
  res.json({ api: 'up' })
})

// eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
