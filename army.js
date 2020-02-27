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

function _trainUnit(unit){
    switch (unit.type) {
        case "Knight":
            unit.points += 10;
            console.log("[INFO] "+unit.name+" has now 10 points more");
            break;
        case "Archer":
            unit.points += 7;
            console.log("[INFO] "+unit.name+" has now 7 points more");
            break;
        case "Pikeman":
            unit.points += 3;
            console.log("[INFO] "+unit.name+" has now 3 points more");
            break;
    }
}

function _transformUnit(unit){
    switch (unit.type) {
        case "Knight":
            console.log("[ERROR] A Knight can not execute a transform");
            break;
        case "Archer":
            unit.type = "Knight";
            console.log("[INFO] "+unit.name+" is now a Knight");
            break;
        case "Pikeman":
            unit.type = "Archer";
            console.log("[INFO] "+unit.name+" is now an Archer");
            break;
    }
}

function _trainArmy(army, unitID){
    const unit = army.units.filter(unit => unit.id === unitID);
    unit[0].train();
    switch (unit[0].type) {
        case "Knight":
            army.gold -= 30;
            console.log(`[INFO] ${army.name} has now 30 gold less`);
            break;
        case "Archer":
            army.gold -= 20;
            console.log(`[INFO] ${army.name} has now 20 gold less`);
            break;
        case "Pikeman":
            army.gold -= 10;
            console.log(`[INFO] ${army.name} has now 10 gold less`);
            break;
    }
}

function _transformArmy(army, unitID){
    const unit = army.units.filter(unit => unit.id === unitID);
    switch (unit[0].type) {
        case "Knight":
            console.log("[ERROR] A Knight can not execute a transform");
            break;
        case "Archer":
            army.gold -= 40;
            unit[0].transform();
            console.log(`[INFO] ${army.name} has now 40 gold less`);
            break;
        case "Pikeman":
            army.gold -= 30;
            unit[0].transform();
            console.log(`[INFO] ${army.name} has now 30 gold less`);
            break;
    }
}

function _battle(army, enemy, loses=2, losesDraw=2){
    if(army instanceof Army && enemy instanceof Army){
        console.log(`[INFO] There was a Battle between ${army.name} and ${enemy.name}`);
        const armyPoints1 = _getPoints(army);
        const armyPoints2 = _getPoints(enemy);
        if (armyPoints1 === armyPoints2) {
            let lostArmy1 = []; 
            let lostArmy2 = [];
            for (let index = 0; index < losesDraw; index++) {
                const indexArmy1 = _getIndexMaxUnit(army.units);
                const indexArmy2 = _getIndexMaxUnit(enemy.units);
                lostArmy1 = lostArmy1.concat(army.units.splice(indexArmy1,1));
                lostArmy2 = lostArmy2.concat(enemy.units.splice(indexArmy2,1));
            }
            army.records = army.records.concat(new Record("Draw", lostArmy1, enemy.name));
            enemy.records = enemy.records.concat(new Record("Draw", lostArmy2, army.name));
            console.log("[INFO] Draw!");
        } else if (armyPoints1 > armyPoints2) {
            let lostArmy2 = [];
            for (let index = 0; index < loses; index++) {
                const indexArmy2 = _getIndexMaxUnit(enemy.units);
                lostArmy2 = lostArmy2.concat(enemy.units.splice(indexArmy2,1));
            }
            army.gold += 100;
            army.records = army.records.concat(new Record("Victory", [], enemy.name));
            enemy.records = enemy.records.concat(new Record("Lost", lostArmy2, army.name));
            console.log(`[INFO] ${army.name} won!`);        
        } else {
            let lostArmy1 = []; 
            for (let index = 0; index < losesDraw; index++) {
                const indexArmy1 = _getIndexMaxUnit(army.units);
                lostArmy1 = lostArmy1.concat(army.units.splice(indexArmy1,1));
            }
            army.records = army.records.concat(new Record("Lost", lostArmy1, enemy.name));
            enemy.gold += 100;
            enemy.records = enemy.records.concat(new Record("Victory", [], army.name)); 
            console.log(`[INFO] ${enemy.name} won!`);           
        }
    }
    else console.log("[ERROR] A Battle needs 2 armies");
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
    this.train = () => _trainUnit(this);
    this.transform = () => _transformUnit(this);
    console.log(`[INFO] ${this.type==="Archer"?"An":"A"} ${this.type} was created`);
    unitCounter++;
}

function Army(civilization="Civilization"){
    this.id = armyCounter;
    this.name = civilization + " " + this.id.toString();
    this.gold = 1000;
    this.records = [];
    switch (civilization.toLowerCase()) {
        case "byzantines":
            this.units = _createArmy(5,8,15);
            this.civilization = "Byzantines"
            break;
        case "english":
            this.units = _createArmy(10,10,10);
            this.civilization = "English"
            break;
        case "chinese":
        default:
            this.units = _createArmy(2,25,2);
            this.civilization = "Chinese"
            break;
    }
    this.train = (id) => _trainArmy(this, id);
    this.transform = (id) => _transformArmy(this, id);
    this.battle = (enemy) => _battle(this, enemy);
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

module.exports = {Army, Unit};