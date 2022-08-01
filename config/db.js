import { Sequelize } from "sequelize";

const db = new Sequelize("autentikasi", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
