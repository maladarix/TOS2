const Action = require('../../action')

class jester {
    constructor(){
        this.name = "Jester"
        this.description = "Un lunatique qui a absolument perdu la carte pour qui son seul rêve est de se faire pendre sur la place publique."
        this.isUnique = false
        this.needsTwoTargets = false
        this.alignement = "Neutral Evil"
        this.priority = 1
        this.command = "execute"
        this.wikiLink = "https://town-of-salem.fandom.com/wiki/Jester"
        this.winwith = "Tout le monde"
        this.hab = "Si vous accomplissez votre rêve de vous faire pendre, vous pourrez tuer quelqu’un qui vous a accusé la nuit dernière, juste parce que c’est drôle de tuer des gens."
        this.defense = 0
        this.attack = 3
    }

    action(author, target){
        return new Action("jestExecute", author, target)
    }
}

module.exports = jester