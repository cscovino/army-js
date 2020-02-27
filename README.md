# army-js

An example to modeling objects with JavaScript.

## Definitions

### Units

There are three types of units with different scores:

|            |Points|
|:----------:|:----:|
|   Pikeman  |   5  |
|   Archer   |  10  |
|   Knight   |  20  |

### Armies

An army has an initial quantity of units according with its civilization. It can exist multiples armies from the same civilization.
An army has 1000 gold coins at the beginning.
Also each army has its own battles record.

#### Civilizations

|            | Pikemen | Archers | Knights |
|:----------:|:-------:|:-------:|:-------:|
|   Chinese  |    2    |   25    |    2    |
|   English  |   10    |   10    |   10    |
| Byzantines |    5    |    8    |   15    |

#### Training

You can train a specific unit by paying the price according to its type.

|            |Points Earned| Cost |
|:----------:|:-----------:|:----:|
|   Pikeman  |      3      |  10  |
|   Archer   |      7      |  20  |
|   Knight   |     10      |  30  |

#### Transforms

Also you can transform a specific unit to another by paying the price according to its type.

|Initial Type|Final Type| Cost |
|:----------:|:--------:|:----:|
|   Pikeman  |  Archer  |  30  |
|   Archer   |  Knight  |  40  |
|   Knight   |    -     |   -  |

#### Battles

An army can attack another at any time. The winner will be the army with more points and the results will be:

|  Result   |            Winner Army            |             Loser Army            |
|:---------:|:---------------------------------:|:---------------------------------:|
|An army won|         Earn 100 gold coins       |Lose the two units with more points|
|   Draw    |Lose the two units with more points|Lose the two units with more points|

## Usage

First of all you need to import the module (asumming that you are inside the folder of the project):
```
const armyjs = require('./army.js')
```

Then to create an army you need to run:
```
const army = new armyjs.Army('Chinese')
const enemy = new armyjs.Army('Byzantines')
```
If you print the object army you will see the attributes of that object.

To train a specific unit you have to pass the id of the unit to train to the train function, for example here we trained the `Pikeman 1` of the chinese army:
```
army.train(1)
```
Now if you print again the army object you will see that the attributes gold and the points of the unit have change according to the type of the unit.

To transform a unit to another unit type you have to pass the id of the unit to transform, for example here we transformed the `Pikeman 1`:
```
army.transform(1)
```
Again if you print the army object you will see that the attributes gold and the type of the unit have change.

Finally to attack other army you just have to pass the enemy army object to the battle function, for example here `army` army attacked `enemy` army:
```
army.battle(enemy)
```
And if you print the objects you will see that gold, records and units have change following the rules explained.