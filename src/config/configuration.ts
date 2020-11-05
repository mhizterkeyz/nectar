export interface Configuration {
  port: number;
  jwtSecret: string;
}

export default (): Configuration => ({
  port: +process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
});
