const Discord = require('discord.js')
const Distribution = require('./src/game/distribution')
const Player = require('./src/game/player')
const action = require('./src/game/actions')
const Partie = require('./src/game/game')
const fs = require('fs')
const bot = new Discord.Client()
require("dotenv").config()

let dataPartie = null

fs.readFile('./data/dataGame.json', "utf8", (err, JsonString) => {
  if(err) {
    console.log(err)
  }else{
    dataPartie = JSON.parse(JsonString)
  }
})

var shuffle = function (array) {
  var m = array.length, t, i;
    
  // While there remain elements to shuffle…
  while (m) {
    
  // Pick a remaining element…
  i = Math.floor(Math.random() * m--);
       
  // And swap it with the current element.
  t = array[m];
  array[m] = array[i];
  array[i] = t;
  }
        
  return array;
}

let clearJail = async function(jailedChan){
  for(i = 0; i<3; i++){
    await jailedChan.messages.fetch({limit: 100}).then(messages =>{
      jailedChan.bulkDelete(messages)
    })
  }
}

var kill = function(died) {
  let graveyardmot = new Discord.MessageEmbed()
  .setDescription(`Le lastwill de **${died.displayname}** était: 
  ${died.lastwillappear}`)
  .addField("Son rôle était: ", `**${died.roleappear}**`)
  .setColor(color)

  let pasLW = new Discord.MessageEmbed()
  .setDescription(`Nous n'avons pas pu trouver de lastwill.`)
  .addField(`Le rôle de **${died.displayname}** était:`, `${died.roleappear}`)
  .setColor(color)

  if(died.lastwillappear == null) {
    died.serverRoles = [mort]
    bot.channels.cache.get(graveyard).send(pasLW)   
  }else{
    died.serverRoles = [mort]
    bot.channels.cache.get(graveyard).send(graveyardmot)      
  }

  if(died.role.alignement == "Coven Evil") {
    for( var i = 0; i < joueurCoven.length; i++){
      if ( joueurCoven[i] === died) { 
        joueurCoven.splice(i, 1); 
      }
    }
  }

  died.necro = false
  died.user.roles.add(mort)
  died.user.roles.add(spec)
  died.user.roles.remove(vivant)
  died.user.roles.remove(nuit)
  died.user.roles.remove(jour)
}

var processVote = function() {
  var targetedPlayer = [alive()[0]]
  alive().forEach(player => {
        player.id,
        {VIEW_CHANNEL: true, SEND_MESSAGES: false}
    if (player.id != targetedPlayer[0].id){
      if(targetedPlayer[0].votesFor < player.votesFor){
        targetedPlayer = [player]
      }
      else if (targetedPlayer[0].votesFor == player.votesFor) {
        targetedPlayer.push(player) 
      }
    }
  });  
  if(targetedPlayer.length == alive().length) {
    return bot.channels.cache.get(panchanid).send(new Discord.MessageEmbed()
    .setDescription("Il n'y a pas eu de vote aujourd'hui")
    .setColor(color))
  }else if (targetedPlayer.length == 1){
    if(targetedPlayer[0].votesFor > (alive().length + votemaire) / 2){
      bot.channels.cache.get(panchanid).send(new Discord.MessageEmbed()
      .setDescription(`Le village a décidé de pendre **${targetedPlayer[0].displayname}** par un vote de **${targetedPlayer[0].votesFor}** - **${(alive().length - targetedPlayer[0].votesFor)}**.
      Il sera mort au début de la nuit.`)
      .setColor(color))
      killed = (targetedPlayer[0])
    }
    else{
      return bot.channels.cache.get(panchanid).send(new Discord.MessageEmbed()
    .setDescription(`Le village a décidé d'épargner **${targetedPlayer[0].displayname}** par un vote de **${targetedPlayer[0].votesFor}** - **${(alive().length - targetedPlayer[0].votesFor)}**`)
    .setColor(color))
    }
  }else{
    var desc = "Il y a une égalité entre "
    targetedPlayer.forEach(player => {
      if(player.id != targetedPlayer[0].id){
        desc += " et "
      }
      desc += player.displayname
    });
    desc += ". Aucun des deux ne sera pendu"
    return bot.channels.cache.get(panchanid).send(new Discord.MessageEmbed()
    .setDescription(desc)
    .setColor(color))
  }
}

setInterval( //!résults automatique + save
  () => {
    console.log(dataPartie)
    if(dataPartie.time == undefined) return dataPartie = new Partie()
    if(dataPartie.jour == 0 || dataPartie.jour == -1) return
    if(new Date().toUTCString().split(" ")[4] == dataPartie.HeureResults) {
      processVote()
    }
    
    fs.writeFile('./data/dataGame.json', JSON.stringify(dataPartie), "utf8", function(err) {
      if(err) throw err;})

    fs.writeFileSync('./data/dataGame2.json', JSON.stringify(dataPartie), "utf8", function(err) {
      if(err) throw err;})
    
  }, 1000);

  bot.on('ready', () => {
    console.log("bot online")
    console.log(new Date().toLocaleString())
    bot.user.setActivity("BING BONG", { type: "WATCHING" })
  })

  bot.on("message", (messages) => {
    if(messages.author.bot) return
  })

  bot.login(process.env.BOT_TOKEN)