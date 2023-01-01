"use strict";

import openai from "../plugins/openai.js";

import msgModel from "../models/message.js";
import charModel from "../models/character.js";
import glossaryModel from "../models/glossary.js";
import optionModel from "../models/option.js";

/**
 * 重置上下文，不清空人设
 */
async function Reset(msg) {
  await msgModel.destroy({
    where: {},
  });

  msg.reply("💡 上下文已刷新", false);
}

/**
 * 清空上下文，包括人设
 */
async function Clear(msg) {
  await msgModel.destroy({
    where: {},
  });

  // 清空人设设置
  await optionModel.update(
    {
      value: null,
    },
    {
      where: {
        key: "char",
      },
    }
  );

  msg.reply("......", false);
  setTimeout(() => {
    msg.reply("已擦除记忆。", false);
    setTimeout(() => {
      msg.reply("你好！我是Atri，我——", false);
      setTimeout(() => {
        msg.reply("奇怪，竟然连名字都想不起来了吗......", false);
        setTimeout(() => {
          msg.reply("不过没关系，或许你可以帮助我恢复记忆？", false);
          setTimeout(() => {
            msg.reply("当然啦，关键还是要靠自己。我会加油的！", false);
            setTimeout(() => {
              msg.reply("【输入 /setchar 帮助 Atri 设定人设】", false);
            }, 1500);
          }, 2000);
        }, 2000);
      }, 3000);
    }, 1000);
  }, 2000);
}

/**
 * 获取术语表
 * @returns {String} 术语表
 */
// TODO: 实现术语表相关的CRUD。目前只有数据库表，没有实现相关功能。

/**
 * 查看当前人设信息
 * @returns {String} 人设信息
 */
async function Char(msg) {
  // 获取当前人设
  const char = await optionModel.findOne({
    where: {
      key: "char",
    },
  });

  if (!char) {
    msg.reply("ℹ️ 当前暂未设定记忆体。", false);
    return;
  }

  const ctx = await msgModel
    .findAll({
      where: {
        // 获取消息所对应群聊或私聊的上下文
        chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
        chat_type: msg.group_id ? 1 : 0, // 1 群聊 0 私聊
      },
      order: [["time", "ASC"]],
      limit: 30,
    })
    .then((res) => {
      let ctx = "";
      res.forEach((item) => {
        ctx += `【${item.name}】${item.text}\n`;
      });
      return ctx;
    });

  msg.reply(`📃 当前记忆体档案编号为 ${char.value}\n 💾 当前记忆内容\n${ctx}`, false);
}

/**
 * 获取人设列表
 * @returns {String} 人设列表
 */
async function GetChars(msg) {
  const chars = await charModel.findAll({
    where: {
      isDeleted: false,
    },
  });

  if (!chars.length) {
    msg.reply("ℹ️ 档案库中没有文件。", false);
    return;
  }

  let text = "🗄️ 记忆档案中心\n";
  chars.forEach((char) => {
    text += `📃【${char.id}】 ${char.name}\n`;
  });

  msg.reply(text, false);
}

/**
 * 获取人设信息
 * @param {Number} msg.body 人设id
 * @returns {String} 人设信息
 */
async function GetChar(msg) {
  let id = msg.body;

  const char = await charModel.findOne({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!char) {
    msg.reply("ℹ️ 找不到对应的记忆体档案。", false);
    return;
  }
  
  msg.reply(`📃 记忆体档案\n【实体编号】${char.id}\n【实体别名】${char.name}\n【实体档案】${char.text}`, false);
}

/**
 * 新增人设
 * @param {String} msg.body 人设内容
 */
async function AddChar(msg) {
  let name = msg.body.split(" ")[0];
  let text = msg.body.split(" ").slice(1).join(" ");

  const char = await charModel.create({
    name,
    text,
    time: new Date().getTime(),
  });

  msg.reply(
    `✅ 已保存至记忆体档案库。\n【实体编号】${char.id}\n【实体别名】${char.name}`,
    false
  );

  setTimeout(() => {
    msg.reply("谢谢，我会记住的！", false);
  }, 2000);
}

/**
 * 更新人设档案
 * @param {Number} msg.body 人设id
 * @param {String} msg.body 人设档案
 * @returns {String} 人设更新反馈
 */
async function UpdateChar(msg) {
  let id = msg.body.split(" ")[0];
  let text = msg.body.split(" ").slice(1).join(" ");

  const char = await charModel.findOne({
    where: {
      id,
    },
  });
  if (!char || char.isDeleted) {
    msg.reply("ℹ️ 找不到对应的记忆体档案。", false);
    return;
  }

  // 更新人设档案
  await charModel.update(
    {
      text,
    },
    {
      where: {
        id,
      },
    }
  );

  // 清空上下文
  await msgModel.destroy({
    where: {},
  });

  msg.reply(
    `✅ 记忆体 ${char.name} 档案已更新。\n【实体编号】${char.id}\n已同步至档案网络。`,
    false
  );
  setTimeout(() => {
    msg.reply("原来是这样......我记住啦！", false);
  }, 2000);
}

/**
 * 删除人设
 * @param {Number} msg.body 人设id
 * @returns {String} 人设移除反馈
 */
async function DeleteChar(msg) {
  let id = msg.body;

  const char = await charModel.findOne({
    where: {
      id,
    },
  });
  if (!char || char.isDeleted) {
    msg.reply("ℹ️ 找不到对应的记忆体档案。", false);
    return;
  }

  // 标记人设为已删除
  await charModel.update(
    {
      isDeleted: true,
    },
    {
      where: {
        id,
      },
    }
  );

  msg.reply(
    `ℹ️ 记忆实体 ${char.name} 销毁完成。\n【实体编号】${char.id}\n已同步至档案网络。`,
    false
  );
}

/**
 * 设置人设
 * @param {Number} msg.body 人设id
 * @returns {String} 人设信息
 */
async function SetChar(msg) {
  let id = msg.body;

  const char = await charModel.findOne({
    where: {
      id,
    },
  });

  if (!char || char.isDeleted) {
    msg.reply("ℹ️ 找不到对应的记忆体档案。", false);
    return;
  }
  
  // 将目标人设 id 存入设置
  // 人设配置项没有就创建，有就更新
  const option = await optionModel.findOne({
    where: {
      key: "char",
    },
  });

  if (!option) {
    await optionModel.create({
      key: "char",
      value: `${char.id}`,
      time: new Date().getTime(),
    });
  } else {
    await optionModel.update(
      {
        value: `${char.id}`,
        time: new Date().getTime(),
      },
      {
        where: {
          key: "char",
        },
      }
    );
  }

  // 清空上下文
  await msgModel.destroy({
    where: {},
  });

  msg.reply(
    `✅ 记忆实体设定成功。\n【实体编号】${char.id}\n【实体别名】${char.name}\n已同步至档案网络。`,
    false
  );
  
  // 开幕问好
  await msgModel.create({
    chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
    chat_type: msg.group_id ? 1 : 0, // 1 群聊 0 私聊
    name: msg.sender.nickname,
    text: `@Atri 你好！我是${msg.sender.nickname}，初次见面，请多关照哦！跟我打个招呼吧！`,
    time: new Date().getTime(),
  });
  Chat(msg);
}

/**
 * 与模型交互
 * @param {String} msg.body 用户消息
 * @returns {String} 机器人回复
 */
async function Chat(msg) {
  // 获取人设信息
  const option = await optionModel.findOne({
    where: {
      key: "char",
    },
  });
  if (!option.value) {
    msg.reply("ℹ️ 请先设置人设。", false);
    return;
  }

  const char = await charModel.findOne({
    where: {
      id: option.value,
    },
  });
  if (!char || char.isDeleted) {
    msg.reply("ℹ️ 找不到对应的记忆体档案。", false);
    return;
  }

  // 获取上下文
  const ctx = await msgModel
    .findAll({
      where: {
        // 获取消息所对应群聊或私聊的上下文
        chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
        chat_type: msg.group_id ? 1 : 0, // 1 群聊 0 私聊
      },
      order: [["time", "ASC"]],
      limit: 30,
    })
    .then((res) => {
      let ctx = "";
      res.forEach((item) => {
        ctx += `【${item.name}】${item.text}\n`;
      });
      return ctx;
    });

  // 交互
  const prompt = `${char.text}\n${ctx}【${char.name}】`;
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 2048,
    temperature: 0.9,
    top_p: 1,
    best_of: 1,
    n: 1,
    stream: false,
  });
  const reply = res.data.choices[0].text;

  // 保存 bot 自己的回复到上下文
  await msgModel.create({
    chat_id: msg.group_id ? msg.group_id : msg.sender.user_id,
    chat_type: msg.group_id ? 1 : 0, // 1 群聊 0 私聊
    name: char.name,
    text: reply,
    time: new Date().getTime(),
  });

  // Note: 上下文池本来应该有消息条数限制，但是由于机器人一条回复的影响不大，所以暂时不做限制。
  // TODO: 如果以后有需要，可以在这里加上限制。或者抽离出一个上下文池模块，方便管理。

  // 发送回复
  msg.reply(reply, false);
}

export default {
  Reset,
  Clear,
  Char,
  GetChars,
  GetChar,
  AddChar,
  UpdateChar,
  DeleteChar,
  SetChar,
  Chat,
};
