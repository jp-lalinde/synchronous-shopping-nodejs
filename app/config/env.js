const env = {
    database: 'db-synch-shop',
    username: 'postgres',
    password: 'admin',
    host: '35.245.11.52',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  };
   
  module.exports = env;