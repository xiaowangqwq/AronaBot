let mineflayer = require('mineflayer');
let isAttack = false;
const DIRECTIONS_TO_YAW = {
  '北': 0,
  '西': Math.PI / 2,
  '南': Math.PI,
  '东': -Math.PI / 2,
};
let attackInterval;
function Bot(options){
  let bot = mineflayer.createBot(options);
  bot.on('end', () => {
    console.log('Bot与服务器的连接已结束，准备重连...(没写)');
    loginIn = false; 
  });
  bot.on('error', (err) => {
    console.error('Bot遇到错误:', err);
  });
  bot.on('chat', (username, message) => {
    console.log(`[${new Date().toISOString()}]${username}${message}`);
  
  })
  bot.on('spawn', () => {
    console.log('Bot已连接到服务器');
    bot.chat('/register qwertyuiop1 qwertyuiop1');
    bot.chat('/login qwertyuiop1');
  });
  bot.on('whisper', (username, message) => {
    console.log(`[${new Date().toISOString()}] ${username}: ${message}`);
    if (message === "传送") {
      console.log("收到传送请求");
      bot.chat(`/tpa ${username}`);
    }
    if (message === "接受tpa") {
      console.log("收到传送请求");
      bot.chat(`/tpaccept`);
    }
    if (message === "查看背包") {
      console.log("收到查看背包请求");
      let response = "背包物品：";
      bot.inventory.items().forEach(item => {
        if (item) {
          response += `${item.name} x${item.count}  `;
        }
      });
      bot.chat(`/minecraft:msg ${username} ${response}`);
    }
    if (message.startsWith("使用 ")) {
      const itemName = message.slice(3); // 去掉"使用 "前缀得到物品名称
      console.log(`尝试使用物品: ${itemName}`);
  
      const itemToEquip = bot.inventory.items().find(item => item.name.includes(itemName));
      if (itemToEquip) {
        console.log(`找到物品: ${itemToEquip.name}, 准备装备到主手...`);
        bot.chat(`/minecraft:msg ${username} 已装备物品: ${itemName}`);
        bot.equip(itemToEquip, 'hand', (err) => {
          if (err) {
            console.error(`装备物品失败: ${err.message}`);
            bot.caht(`/minecraft:msg ${username} 无法装备物品: ${itemName}`);
          } else {
            console.log(`物品 ${itemName} 已装备到主手`);
            bot.chat(`/minecraft:msg ${username} 已装备物品: ${itemName}`);
          }
        });
      } else {
        console.log(`背包中没有找到物品: ${itemName}`);
        bot.chat(`/minecraft:msg ${username} 背包中没有找到物品: ${itemName}`);
      }
  
    }
  
    if (message.startsWith("转向 ")) {
      const direction = message.slice(3); // 去掉"转向 "前缀
      if (DIRECTIONS_TO_YAW.hasOwnProperty(direction)) {
        const targetYaw = DIRECTIONS_TO_YAW[direction];
        bot.look(targetYaw, 0);
  
      } else {
        bot.whisper(username, '无效的转向指令');
      }
    }
    if (message === "开始攻击") {
      bot.attack(bot.nearestEntity(), swing = true);
      console.log(`[${new Date().toISOString()}] 已左键点击`);
      isAttack = true;
      bot.whisper(username, '已开始攻击');
    }
    if (isAttack == true) {
      // 开始每0.5秒执行一次的攻击循环
      if(!attackInterval){
        attackInterval = setInterval(() => {
          const entity = bot.nearestEntity();
          if (entity && entity.type !== 'player' && entity.username !== bot.username) {
            bot.attack(entity, swing = true);// 左键点击
          }
        }, 500);
      }
    }
    if (message === "停止攻击") {
      console.log(`[${new Date().toISOString()}] 已停止攻击`);
      isAttack = false;
      if (attackInterval) {
        clearInterval(attackInterval);
        attackInterval = null;
        bot.whisper(username, '已停止攻击');
      } else {
        bot.whisper(username, '当前并未进行攻击');
      }
    }
  
  
  })
}
for (i=1;i<process.argv.slice(2);i++) {
  let botName="bot"+i
  let bot = {
    host: 'www.lizhiyu.vip', // 替换为你的服务器地址
    port: 25565, // 替换为你的服务器端口
    username: botName, // 替换为你的机器人用户名
    version: '1.20.4',
    physicsEnabled: false,
  };
  Bot(bot)
}