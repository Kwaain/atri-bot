import db from "../plugins/sequelize.js";

import { DataTypes } from "sequelize";

const Message = db.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    chat_id: DataTypes.INTEGER, // 会话 id。私聊为用户 id，群聊为群组 id
    chat_type: DataTypes.INTEGER, // 会话类型 0: 私聊 1: 群聊
    name: DataTypes.TEXT,
    text: DataTypes.TEXT,
    time: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
);

export default Message;
