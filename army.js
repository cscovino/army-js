//////////////////////////////////// UTILS ////////////////////////////////////////////
let unitCounter = 1;
let recordCounter = 1;
let armyCounter = 1;

function _createArmy(pikeman, archer, knight){
    let units = [];
    for (let index = 0; index < pikeman; index++) {
        units.push(new Unit("pikeman"))
    }
    for (let index = 0; index < archer; index++) {
        units.push(new Unit("archer"))
    }
    for (let index = 0; index < knight; index++) {
        units.push(new Unit("knight"))
    }
    return units
}

function _getPoints(army){
    return army.units.reduce((a,b) => a + (b['points'] || 0), 0);
}

function _getIndexMaxUnit(units){
    const tmp = units.map(unit => unit.points);
    const maxPoints = Math.max(...tmp);
    return tmp.indexOf(maxPoints);
}

//////////////////////////////////// MODELS ///////////////////////////////////////////
function Unit(type="Unit"){
    this.id = unitCounter;
    this.name = type + " " + this.id.toString();
    switch (type.toLowerCase()) {
        case "knight":
            this.points = 20;
            this.type = "Knight"
            break;
        case "archer":
            this.points = 10;
            this.type = "Archer"
            break;
        case "pikeman":
        default:
            this.points = 5;
            this.type = "Pikeman"
            break;
    }
    this.train = () => {
        switch (this.type) {
            case "Knight":
                this.points += 10;
                console.log("[INFO] "+this.name+" has now 10 points more");
                break;
            case "Archer":
                this.points += 7;
                console.log("[INFO] "+this.name+" has now 7 points more");
                break;
            case "Pikeman":
                this.points += 3;
                console.log("[INFO] "+this.name+" has now 3 points more");
                break;
        }
    }
    this.transform = () => {
        switch (this.type) {
            case "Knight":
                console.log("[ERROR] A Knight can not execute a transform");
                break;
            case "Archer":
                this.type = "Knight";
                console.log("[INFO] "+this.name+" is now a Knight");
                break;
            case "Pikeman":
                this.type = "Archer";
                console.log("[INFO] "+this.name+" is now an Archer");
                break;
        }
    }
    console.log(`[INFO] ${this.type==="Archer"?"An":"A"} ${this.type} was created`);
    unitCounter++;
}

function Army(civil="Civilization"){
    this.id = armyCounter;
    this.name = civil + " " + this.id.toString();
    this.gold = 1000;
    this.records = [];
    switch (civil.toLowerCase()) {
        case "byzantines":
            this.units = _createArmy(5,8,15);
            this.civil = "Byzantines"
            break;
        case "english":
            this.units = _createArmy(10,10,10);
            this.civil = "English"
            break;
        case "chinese":
        default:
            this.units = _createArmy(2,25,2);
            this.civil = "Chinese"
            break;
    }
    this.train = (id) => {
        const unit = this.units.filter(unit => unit.id === id);
        unit[0].train();
        switch (unit[0].type) {
            case "Knight":
                this.gold -= 30;
                console.log(`[INFO] ${this.name} has now 30 gold less`);
                break;
            case "Archer":
                this.gold -= 20;
                console.log(`[INFO] ${this.name} has now 20 gold less`);
                break;
            case "Pikeman":
                this.gold -= 10;
                console.log(`[INFO] ${this.name} has now 10 gold less`);
                break;
        }
    }
    this.transform = (id) => {
        const unit = this.units.filter(unit => unit.id === id);
        switch (unit[0].type) {
            case "Knight":
                console.log("[ERROR] A Knight can not execute a transform");
                break;
            case "Archer":
                this.gold -= 40;
                unit[0].transform();
                console.log(`[INFO] ${this.name} has now 40 gold less`);
                break;
            case "Pikeman":
                this.gold -= 30;
                unit[0].transform();
                console.log(`[INFO] ${this.name} has now 30 gold less`);
                break;
        }
    }
    armyCounter++;
}

function Record(result, lost, against){
    this.id = recordCounter;
    this.name = `Battle ${this.id.toString()}`;
    this.result = result;
    this.lost = lost;
    this. against = against;
    recordCounter++;
}

function Battle(army1, army2, loses=2, losesDraw=2){
    if(army1 instanceof Army && army2 instanceof Army){
        console.log(`[INFO] There was a Battle between ${army1.name} and ${army2.name}`);
        const armyPoints1 = _getPoints(army1);
        const armyPoints2 = _getPoints(army2);
        if (armyPoints1 === armyPoints2) {
            let lostArmy1 = []; 
            let lostArmy2 = [];
            for (let index = 0; index < losesDraw; index++) {
                const indexArmy1 = _getIndexMaxUnit(army1.units);
                const indexArmy2 = _getIndexMaxUnit(army2.units);
                lostArmy1 = lostArmy1.concat(army1.units.splice(indexArmy1,1));
                lostArmy2 = lostArmy2.concat(army2.units.splice(indexArmy2,1));
            }
            army1.records = army1.records.concat(new Record("Draw", lostArmy1, army2.name));
            army2.records = army2.records.concat(new Record("Draw", lostArmy2, army1.name));
            console.log("[INFO] Draw!");
        } else if (armyPoints1 > armyPoints2) {
            let lostArmy2 = [];
            for (let index = 0; index < loses; index++) {
                const indexArmy2 = _getIndexMaxUnit(army2.units);
                lostArmy2 = lostArmy2.concat(army2.units.splice(indexArmy2,1));
            }
            army1.gold += 100;
            army1.records = army1.records.concat(new Record("Victory", [], army2.name));
            army2.records = army2.records.concat(new Record("Lost", lostArmy2, army1.name));
            console.log(`[INFO] ${army1.name} won!`);        
        } else {
            let lostArmy1 = []; 
            for (let index = 0; index < losesDraw; index++) {
                const indexArmy1 = _getIndexMaxUnit(army1.units);
                lostArmy1 = lostArmy1.concat(army1.units.splice(indexArmy1,1));
            }
            army1.records = army1.records.concat(new Record("Lost", lostArmy1, army2.name));
            army2.gold += 100;
            army2.records = army2.records.concat(new Record("Victory", [], army1.name)); 
            console.log(`[INFO] ${army2.name} won!`);           
        }
    }
    else console.log("[ERROR] A Battle needs 2 armies");
}

module.exports = {Army, Unit, Battle};