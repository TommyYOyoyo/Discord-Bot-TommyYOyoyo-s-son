// Sharding

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./src/bot.js', {
    token: process.env.BOT_TOKEN,
    totalShards: 'auto'
});

manager.on('shardCreate', shard => console.log(`${new Date().toString()} [SHARDING CREATION] Shard created and launched ${shard.id} \n`));

manager.spawn();
