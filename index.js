import express from "express";
// import Server from "next/dist/server/base-server";
import db from "./config/db.js";
// import Users from "./models/UserModel.js";
// import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";

dotenv.config();

const app = express();
// const urlencoded = express();

try {
  await db.authenticate();
  //   db.sync();
  console.log("Database Connected");
  //   await Users.sync();
} catch (error) {
  console.log(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

// app.get("/", (req, res) => {
//   res.send("Pandu Ganteng!");
// });

// const port = 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server listen on port ${process.env.PORT}`);
});
