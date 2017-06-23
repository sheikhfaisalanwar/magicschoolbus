module.exports = {
  'db': {
    'connector': 'mongodb',
    'host': process.env.MONGODB_HOST,
    'port': process.env.MONGODB_PORT,
    'database': process.env.MONGODB_DB,
    'user': process.env.MONGODB_USER,
    'password': process.env.MONGODB_PW
  }
};
