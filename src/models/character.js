import db from "../plugins/sequelize.js";

import { DataTypes } from "sequelize";

const Character = db.define(
  "character",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.TEXT,
    text: DataTypes.TEXT,
    time: DataTypes.INTEGER,
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }, // 是否已删除
  },
  {
    timestamps: false,
  }
);

export default Character;
