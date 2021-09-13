const db = require('../../data/db-config')

function find() {
  return db('users').select('user_id', 'username').orderBy('user_id')
}

function findBy(filter) {
  return db('users').where(filter).orderBy('user_id')
}

function findById(user_id) {
  return db('users').where({ user_id }).first()
}

async function add(user) {
  const [user_id] = await db('users').insert(user)
  return findById(user_id)
}

module.exports = {
  find,
  findBy,
  findById,
  add,
}
