const Action = require('../../action')

class amne {
    constructor(){
        this.name = "Amnésiac"
        this.description = "Vous êtes un patient de l’hôpital psychiatrique qui ne se rappelle pas qui il est."
        this.isUnique = false
        this.needsTwoTargets = false
        this.alignement = "Neutral Bening"
        this.command = "chose"
        this.priority = 6
        this.wikiLink = "https://town-of-salem.fandom.com/wiki/Amnesiac"
        this.winwith = "Équipe choisie."
        this.hab = `Une fois par partie, vous pouvez choisir un rôle parmi les personnes qui sont mortes. Rappelez-vous, une fois qu’un rôle sera choisi, le message “Un amnésique s’est rappelé qu’il est un [Rôle]".`
        this.defense = 0
        this.attack = 0
    }

    action(author, target){
        return new Action("remember", author, target)
    }
}

module.exports = amne