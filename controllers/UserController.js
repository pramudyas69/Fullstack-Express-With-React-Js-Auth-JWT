import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// import { BIG5_CHINESE_CI } from "mysql/lib/protocol/constants/charsets.js";

export const getAllUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({
      msg: "Passsword not Match!",
    });
  //   const pandu = "abcdefg";

  const salt = await bcrypt.genSalt();
  const passwordHashed = await bcrypt.hash(password, salt);
  console.log(passwordHashed);
  try {
    const data = await Users.create({
      name: name,
      email: email,
      password: passwordHashed,
    });

    // console.log(name);
    res.json({
      msg: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    console.log(req.body.email);
    const match = await bcrypt.compare(req.body.password, user[0].password);
    // console.log(match);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json(accessToken);
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
    console.log(error);
  }
};
