"use strict";

import Config from "../config/index.js";

import msgModel from "../models/message.js";

import TestController from "../controllers/test.js";
import ChatController from "../controllers/chat.js";

// 路由表
const routes = [
  {
    cmd: "/test",
    controller: TestController,
  },
  {
    cmd: "@Atri",
    controller: ChatController.Chat,
  },
  {
    cmd: "/char", // 查看当前人设信息
    controller: ChatController.Char,
  },
  {
    cmd: "/getchars", // 获取人设列表
    controller: ChatController.GetChars,
  },
  {
    cmd: "/getchar", // 获取人设信息
    controller: ChatController.GetChar,
  },
  {
    cmd: "/addchar", // 新增人设
    controller: ChatController.AddChar,
  },
  {
    cmd: "/upchar", // 更新人设
    controller: ChatController.UpdateChar,
  },
  {
    cmd: "/rmchar", // 删除人设
    controller: ChatController.DeleteChar,
  },
  {
    cmd: "/setchar", // 设置当前人设
    controller: ChatController.SetChar,
  },
  {
    cmd: "/clear", // 清空上下文
    controller: ChatController.Clear,
  },
  {
    cmd: "/reset", // 重置上下文
    controller: ChatController.Reset,
  },
];

// 消息存储器
async function store(msg) {
  // 不存储指令
  if (msg.raw_message.startsWith("/")) {
    return;
  }

  // TODO: 舍弃长消息
  // TODO: 优化存储方式

  // 存原始消息到上下文库，限制 2000 条
  await msgModel.create({
    chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
    chat_type: msg.group_id ? 1 : 0,
    name: msg.sender.nickname,
    text: msg.raw_message,
    time: new Date().getTime(),
  });

  // 每个会话对应的上下文只存 50 条 
  const ctxCount = await msgModel.count({
    where: {
      chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
    },
  });
  if (ctxCount > 50) {
    await msgModel.destroy({
      where: {
        chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
      },
      limit: 1,
    });
  }
}

// 请求解析
async function parse(msg) {
  if (msg.raw_message.startsWith("/") || msg.raw_message.startsWith("@Atri")) {
    // 是命令，解析消息
    msg.cmd = msg.raw_message.split(" ")[0];
    msg.body = msg.raw_message.split(" ").slice(1).join(" ");
  } else {
    // 非命令，不处理
    console.log(`[Router] ${msg.raw_message} -> (ignored)`)
    return;
  }
}

// 路由器
async function router(msg) {
  // 消息存储
  store(msg);

  // 请求解析
  parse(msg);

  // 路由匹配
  routes.forEach(function (route) {
    if (msg.cmd === route.cmd) {
      console.log(`[Router] ${msg.raw_message} -> ${msg.cmd}${msg.body ? `?body=${msg.body}` : ""}`)

      // 权限检查
      if (route.admin && !Config.admins.includes(msg.sender.user_id)) {
        return;
      }

      // 执行控制器
      route.controller(msg);
    }
  });
}

export default router;
