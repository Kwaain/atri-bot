import Sequelize from "sequelize";

const db = new Sequelize("sqlite:data/app.db");

export default db;
