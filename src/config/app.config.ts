export const EnvConfiguration = () => ({
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  port: process.env.PORT,
  hostApi: process.env.HOST_API,
  JwtSecret: process.env.JWT_SECRET,
});