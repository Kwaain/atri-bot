import Sequelize from "sequelize";

const db = new Sequelize("sqlite:data/db.sqlite");

export default db;
