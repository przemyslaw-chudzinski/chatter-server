// JWT TOKEN SECRET KEY
!process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY = 'jwt_token_env_secret' : null;
!process.env.PORT ? process.env.PORT = 3000 : null;
!process.env.DB_URL ? process.env.DB_URL = 'mongodb://localhost:27017/chatter_db' : null;