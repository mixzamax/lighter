const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

const servers = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
});

const prefix = "==";
client.on('message',msg => {
    
    if(!msg.content.startsWith(prefix)) return;


    const cm = msg.content.slice(prefix.length).split(" ");
    console.log(cm[0]);
    switch(cm[0]){

        // case 'join':
        //     if(msg.member.voice.channel){
        //         const connection =  msg.member.voice.channel.join();
        //     } else {
        //         msg.reply('You need to join a voice channel first!');
        //     }
        // break;

        case 'dc':
            if(msg.member.voice.channel){
                const connection = msg.member.voice.channel.leave();
            } else {
                msg.reply('You need to join a voice channel first!');
            }
        break;

        case 'play':

            function play(connection,msg){
                var server = servers[msg.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0].url, {filter: "audioonly"}));
                server.queue.shift();

                server.dispatcher.on("finish",function(){
                    console.log('end');
                    if(server.queue[0]){
                        play(connection,msg);
                    } else {
                        connection.disconnect();
                    }
                })
            }

            if(!cm[1]) {
                msg.reply("must have url!!");
            }

            if(!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];

            yts(cm[1],function(err,res){
                if(err) console.log(err);
                var video = res.videos[0];
                console.log(url);
                
                
                server.queue.push({title:video.title,url:video.url});
            })

            if(!msg.guild.voice) msg.member.voice.channel.join().then(connection => {
                play(connection,msg);
            })
            
        break;

        case 'q':
            var server = servers[msg.guild.id];
            msg.channel.send(server.queue);

        break;

        case 'skip':
            var server = servers[msg.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            console.log(server.dispatcher);
            


        break;



    }

});

client.login(auth.token);