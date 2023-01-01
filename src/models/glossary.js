import db from "../plugins/sequelize.js";

import { DataTypes } from "sequelize";

const Glossary = db.define(
  "glossary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    term: DataTypes.TEXT,
    definition: DataTypes.TEXT,
    time: DataTypes.INTEGER,
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }, // 是否已删除
  },
  {
    timestamps: false,
  }
);

export default Glossary;
