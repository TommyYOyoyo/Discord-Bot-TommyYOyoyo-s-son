// Sharding

const { ShardingManager } = require('discord.js')

const manager = new ShardingManager('./bot.js', {
    token: process.env.BOT_TOKEN,
    totalShards: 'auto'
})

manager.on('shardCreate', shard => console.log(`[SHARDING CREATION] Shard created and launcher ${shard.id}`));

manager.spawn();
