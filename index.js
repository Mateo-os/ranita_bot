const { Client, Events } = require('discord.js');
const client = new Client({ intents: [37633]});
require('dotenv').config();
const mysql = require('mysql2');

const token = process.env.TOKEN;
const port = (process.env.PORT || 3306);

var con = mysql.createConnection({
    host: "localhost",
    user: "Ranita",
    password: "ribbit",
    database: "las3ranas",
    port: port
});
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on('messageCreate', async message => {
    if (message.content.charAt(0) != '/'){
        return;
    } 
    const msg = message.content.replace('/','');
    let response = '';
    switch(msg){
        case 'roll':
            response = 'No me presten atencion, probando cosas';
            break;
        case 'chapas':
            response = 'No me presten atencion, probando cosas 2';
            break;
    }
    if (response){ 
        message.channel.send(response)
    }
    /*if(msg.toLowerCase() === '/roll'){

        con.query("SELECT nombre FROM cartas", function (err, result) {
            if (err) throw err;
            let str ="";
            for (let i=0; i<5; i++) 
                str+=result[Math.floor(Math.random()*result.length)].nombre+"\n";
            message.channel.send(str);
    });}
    if(msg.toLowerCase() === '/chapas')message.channel.send('Usted tiene: la nada \n (aun no se configuro los usuarios)');
    */
}); 

client.login(token);