"use strict";

import { createClient } from "oicq";

import Config from "./config/index.js"; 

import db from "./plugins/sequelize.js";

import router from "./router/index.js";

await db.sync(); // 初始化数据库

const bot = createClient(Config.account);

// 登录
bot
  .on("system.login.qrcode", function (e) {
    this.logger.mark("扫码后按Enter完成登录");
    process.stdin.once("data", () => {
      this.login();
    });
  })
  .login();

// 监听白名单消息，传入路由
bot.on("message.group", async (msg) => {
  if (Config.whitelist.group.includes(msg.group_id)) {
    await router(msg);
  }
});

bot.on("message.private", async (msg) => {
  if (Config.whitelist.user.includes(msg.sender.user_id)) {
    await router(msg);
  }
});

export default bot;

// 程序崩溃时的错误处理
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
