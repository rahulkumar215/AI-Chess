import dotenv from "dotenv";
dotenv.config();

export default Object.freeze({
  PORT: process.env.PORT || 3001,
});
