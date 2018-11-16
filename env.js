// JWT TOKEN SECRET KEY
!process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY = 'jwt_token_env_secret' : null;
!process.env.PORT ? process.env.PORT = 3000 : null;
!process.env.DB_NAME ? process.env.DB_NAME = 'chatter_db' : null;
!process.env.DB_HOST ? process.env.DB_HOST = 'localhost' : null;
!process.env.DB_PORT ? process.env.DB_PORT = 27017 : null;