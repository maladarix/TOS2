const Action = require('../../action')

class consort {
    constructor(){
        this.name = "Consort"
        this.description = "Vous êtes une belle femme au service de la mafia."
        this.isUnique = false
        this.needsTwoTargets = false
        this.alignement = "Mafia Support"
        this.command = "block"
        this.priority = 2
        this.wikiLink = "https://town-of-salem.fandom.com/wiki/Consort"
        this.winwith = "Mafias, Sorcières, Survivants."
        this.hab = "Distraire une personne pour l’empêcher d’effectuer son rôle."
        this.defense = 0
        this.attack = 0
    }

    action(author, target){
        return new Action("clock", author, target)
    }
}

module.exports = consort