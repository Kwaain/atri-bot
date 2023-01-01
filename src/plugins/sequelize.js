import Sequelize from "sequelize";

const db = new Sequelize("sqlite:src/data/db.sqlite");

export default db;
