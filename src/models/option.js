import db from "../plugins/sequelize.js";

import { DataTypes } from "sequelize";

const Option = db.define(
  "option",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    key: { type: DataTypes.TEXT, unique: true },
    value: DataTypes.TEXT,
    time: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

export default Option;
