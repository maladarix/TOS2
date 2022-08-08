const Discord = require('discord.js')
const Distribution = require('./src/game/distribution')
const Player = require('./src/game/player')
const action = require('./src/game/actions')
const Partie = require('./src/game/game')
const fs = require('fs')
const bot = new Discord.Client()
require("dotenv").config()

let pasGod = new Discord.MessageEmbed()
.setDescription("Tu n'es pas " + `<@&${godId}>` )
.setColor(color)

let prefix = "!"
let dataPartie = null
let listejoueur = []

let arrayId = ["824726156141658132","825029496305614927","824749359118811187","824725851198849075","824726635902271518","830253971637665832","824725623346954271","824761075387727912","824728100645896314","839977061384978492","839977410966847539","824731087863021588","850422940646506617","824727128758943795","824726760808513606","824727077366005800","824732131678617600","824762348396216401","830113799763525642", "830114000448258058" ,"824725152692174879" ,"825868136782757918","824726713605947403","832301102236958770","829870229470838814","824731870628413480"]

let mort = arrayId[0]           
let jour = arrayId[1]          
let nuit = arrayId[2]           
let vivant = arrayId[3]         
let spec = arrayId[4]           
let devid = arrayId[5]              
let quiVeutJouer = arrayId[6]   
let jailedid = arrayId[7]      
let jail = arrayId[8]          
let vampirechat = arrayId[9]    
let observatoire = arrayId[10]   
let mafiaChat = arrayId[11]     
let covenid = arrayId[12]     
let panchanid = arrayId[13]    
let dmchanid = arrayId[14]     
let villageid = arrayId[15]    
let gameannoncid = arrayId[16]  
let spyHideout = arrayId[17]  
let turtleId = arrayId[18]      
let eyesId = arrayId[19]       
let godId = arrayId[20]       
let graveyard = arrayId[21]       
let parentwhisp = arrayId[22]   
let parentInterface = arrayId[23] 
let adminchat = arrayId[24]   
let listeroleid = arrayId[25]

fs.readFile('./data/dataGame.json', "utf8", (err, JsonString) => {
  if(err) {
    console.log(err)
  }else{
    dataPartie = JSON.parse(JsonString)
  }
})

fs.readFile('./data/dataJoueur.json', "utf8", (err, JsonString) => {
  if(err) {
    console.log(err)
  }else{
    listejoueur = JSON.parse(JsonString)
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
    if(dataPartie.time == undefined) return dataPartie = new Partie()

    fs.writeFileSync('./data/dataGame.json', JSON.stringify(dataPartie), "utf8", function(err) {
      if(err) throw err;})

    fs.writeFileSync('./data/dataGame2.json', JSON.stringify(dataPartie), "utf8", function(err) {
      if(err) throw err;})

    fs.writeFileSync('./data/dataJoueur.json', JSON.stringify(listejoueur), "utf8", function(err) {
      if(err) throw err;})

    fs.writeFileSync('./data/dataJoueur2.json', JSON.stringify(listejoueur), "utf8", function(err) {
      if(err) throw err;})


    if(dataPartie.jour == 0 || dataPartie.jour == -1) return
    if(new Date().toUTCString().split(" ")[4] == dataPartie.HeureResults) {
      processVote()
    }    
  }, 1000);

  bot.on('ready', () => {
    console.log("bot online")
    console.log(new Date().toLocaleString())
    bot.user.setActivity("BING BONG", { type: "WATCHING" })
  })

  bot.on("message", (message) => {
    if(message.author.bot) return
    let jailChan = message.guild.channels.cache.get(jail)
    let jailedChan = message.guild.channels.cache.get(jailedid)
    let spyChan = message.guild.channels.cache.get(spyHideout)
    let vampirechan = message.guild.channels.cache.get(vampirechat)
    let observatoirechan = message.guild.channels.cache.get(observatoire)
    let mafiaChan = message.guild.channels.cache.get(mafiaChat)
    let covenchan = message.guild.channels.cache.get(covenid)
    let adminchannel = message.guild.channels.cache.get(adminchat)
    let villagechan = message.guild.channels.cache.get(villageid)
    let listerolechan = message.guild.channels.cache.get(listeroleid)
    let gameannoncchan = message.guild.channels.cache.get(gameannoncid)
    let dev = message.member.roles.cache.has(devid)
    let god = message.member.roles.cache.has(godId)
    let dmChan = message.guild.channels.cache.get(dmchanid)

    if(message.channel == mafiaChan) {
      spyChan.send(message.content)
    }else if(message.channel == jailChan) {
      jailedChan.send(message.content)
    }else if(message.channel == jailedChan) {
      jailChan.send(message.content)
    }else if(message.channel == vampirechan) {
      observatoire.send(message.content)
    }

    if(message.content.toLowerCase().includes("charles")) message.channel.send("lowkey jtau pub")

    if(!message.content.startsWith(prefix)) return

    let MessageArray = message.content.split(" ")
    let cmd = MessageArray[0].slice(prefix.length)
    let args = MessageArray.slice(1)
  
    try{
      listejoueur.forEach(player => {
        if(message.mentions.members.first().user.username == player.name){
          tagged = player
        }
      })
    }
    catch(err){tagged = null}
  
    listejoueur.forEach(player => {
      if(message.author.username == player.name){
        author = player
      }
    })
    var taggedUser = message.mentions.members.first()

    if(cmd == "end") {
      if(!god && !dev) return message.channel.send(pasGod)

      for (let i = 0; i < listejoueur.length; i++) {
        listejoueur[i].user.roles.remove(vivant)
        listejoueur[i].user.roles.remove(mort)
        listejoueur[i].user.roles.remove(spec)
        listejoueur[i].user.roles.remove(jour)
        listejoueur[i].user.roles.remove(nuit)
        if(listejoueur[i].serverRoles.includes(godId)) {
          listejoueur[i].serverRoles = [godId]
        }else{
          listejoueur[i].serverRoles = []
        }
      }
    }

  })

  bot.login(process.env.BOT_TOKEN)