const Action = require('../../action')

class Gf {
    constructor(){
        this.name = "Godfather"
        this.description = "Vous êtes le leader du crime organisé."
        this.isUnique = true
        this.needsTwoTargets = false
        this.alignement = "Mafia Killing"
        this.command = "attack"
        this.priority = 5
        this.wikiLink = "https://town-of-salem.fandom.com/wiki/Godfather"
        this.winwith = "Mafias, Sorcières, Survivants."
        this.hab = "Ordonnez au mafioso de tuer une cible"
        this.defense = 1
        this.attack = 1
    }

    action(author, target){
        return new Action("attack", author, target)
    }
}

module.exports = Gf