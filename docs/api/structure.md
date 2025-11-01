# Structure API

Structures are buildings you construct on planets and space stations. They produce resources, store materials, build ships, and defend your territory.

## Getting Structures

### `Game.getMyStructures()`

Returns all your structures across all galaxies.

```javascript
const myStructures = Game.getMyStructures();
console.log(`Total structures: ${myStructures.length}`);
```

### `Game.getAllStructures(galaxyId)`

Returns all structures in a specified galaxy (including hostile).

```javascript
const allStructures = Game.getAllStructures(ship.galaxyId);
```

### `Game.findHostileStructures(galaxyId)`

Returns only hostile structures in the galaxy.

```javascript
const enemyBases = Game.findHostileStructures(ship.galaxyId);
```

## Structure Properties

| Property | Type | Description |
|------|------|------|
| `id` | `number` | Unique structure identifier |
| `name` | `string` | Structure name |
| `type` | `string` | Structure type |
| `hp` | `number` | Current hit points |
| `maxHP` | `number` | Maximum hit points |
| `energy` | `number` | Current energy |
| `maxEnergy` | `number` | Maximum energy capacity |
| `defense` | `number` | Defense level |
| `storage` | `object` | Resource storage |
| `storageCapacity` | `number` | Maximum storage space |
| `level` | `number` | Structure level (upgradeable structures) |
| `progress` | `number` | Construction progress (0-100) |
| `working` | `object` | Current production state |
| `ownerId` | `number` | Owner player ID |
| `galaxyId` | `number` | Galaxy ID |
| `planetId` | `string` | Planet/space station identifier |
| `pos` | `Position` | Structure position |

## Construction Status

### Under Construction (`progress < 100`)

When a structure is being built:

```javascript
for (const structure of Game.getMyStructures()) {
  if (structure.progress < 100) {
    console.log(`${structure.name}: ${structure.progress}% complete`);
    console.log('Required resources:', structure.requiredResources);
    console.log('Remaining resources:', structure.remainingResources);
    console.log('Build time:', structure.buildTime, 'ticks');
  }
}
```

**Special properties**:
- `requiredResources` - Total resources needed
- `remainingResources` - Resources still needed
- `buildTime` - Total build time (ticks)

### Operational (`progress === 100`)

Fully constructed structures can produce resources and provide services.

## Structure Types

### Production Facilities

#### Mining Facility
Automatically extracts resources from planets.

```javascript
// Start mining operation
miningFacility.startWork('iron_ore');

// Check production
console.log('Working on:', miningFacility.working);
```

#### Factory
Produces refined materials from raw resources.

```javascript
// Produce metal from iron ore
factory.startWork('metal');
```

#### Component Factory
Manufactures ship components.

```javascript
// Build mining laser
componentFactory.startWork('mining_laser');
```

#### Energy Plant
Generates energy for other structures.

```javascript
// Energy plants work automatically
console.log('Energy production:', energyPlant.working);
```

### Storage

#### Warehouse
Stores large amounts of resources.

```javascript
// Check storage
console.log('Stored:', warehouse.storage);
console.log('Capacity:', warehouse.storageCapacity);

// Withdraw resources
ship.withdraw(warehouse, 'iron_ore', 100);
```

#### Storage Facility
Basic resource storage.

### Military

#### Defense Tower
Automatically attacks hostile ships in range.

```javascript
// Defense towers work automatically
// They attack the nearest enemy in range
```

**Properties**:
- Attack Power: 60
- Range: 3 grids
- Energy Cost: 20 per attack

#### Shield Generator
Protects structures on the same planet.

```javascript
// Shield generators work automatically
// They provide shields to nearby friendly structures
```

### Special

#### Shipyard
Builds new ships.

```javascript
// Start building a ship
shipyard.buildShip('Explorer-1', ['mining_laser', 'storage']);
```

#### Trade Terminal
Trade resources with other players (future feature).

#### Laboratory
Research new technologies (future feature).

## Structure Methods

### `structure.getLocation()`

Get the planet or space station this structure is on.

```javascript
const location = structure.getLocation();
console.log(`Structure at: ${location.name}`);
console.log(`Position: (${location.pos.x}, ${location.pos.y})`);
```

**Returns**: Planet or SpaceStation object

### Production Methods

These methods are available on production structures:

#### `structure.startWork(product)`

Start producing a product (if the structure supports it).

```javascript
// Check available recipes
const recipes = Game.Config.getRecipes(structure.type);

// Start production
if (structure.type === 'factory') {
  structure.startWork('metal');
}
```

**Parameters**:
- `product`: Resource or item to produce

**Returns**: `boolean` - success/failure

:::info Production Requirements
Structures need:
- Sufficient input resources in storage
- Available energy
- Correct recipe for the structure type
:::

### Shipyard Methods

#### `shipyard.buildShip(name, components)`

Build a new ship with specified components.

```javascript
shipyard.buildShip('Miner-1', [
  'mining_laser',
  'mining_laser',
  'storage',
  'basic_engine'
]);
```

**Parameters**:
- `name`: Ship name
- `components`: Array of component types

**Returns**: `boolean` - success/failure

## Building Structures

Ships with `construction_arm` can build structures:

```javascript
// Start construction
ship.build(planet, 'mining_facility');

// Supply construction sites with resources
const sites = Game.getMyStructures()
  .filter(s => s.progress < 100);

for (const site of sites) {
  if (ship.pos.isNear(site.pos)) {
    ship.supplyConstruction(site);
  }
}
```

## Structure Costs

Use the Config API to query build costs:

```javascript
const cost = Game.Config.getStructureCost('mining_facility');
console.log('Build cost:', cost);
/*
{
  energy: 20,
  resources: {
    iron_ore: 100,
    crystal: 50
  },
  buildTime: 10
}
*/
```

See [Config API](./config) for details.

## Examples

### Automated Production Manager

```javascript
// Manage all production facilities
function manageProduction() {
  const factories = Game.getMyStructures()
    .filter(s => s.type === 'factory' && s.progress === 100);
  
  for (const factory of factories) {
    // Check if working
    if (!factory.working || !factory.working.product) {
      // Check available resources
      const ironOre = factory.storage.iron_ore || 0;
      const crystal = factory.storage.crystal || 0;
      
      // Start production based on available resources
      if (ironOre >= 10) {
        factory.startWork('metal');
      } else if (crystal >= 10) {
        factory.startWork('alloy');
      }
    }
  }
}

// Run每个 tick
manageProduction();
```

### Construction Queue

```javascript
// Supply all construction sites
function supplyConstruction() {
  const sites = Game.getMyStructures()
    .filter(s => s.progress < 100);
  
  const myShips = Game.getMyShips()
    .filter(s => s.components.includes('construction_arm'));
  
  for (const site of sites) {
    // Find nearest ship with resources
    let bestShip = null;
    let minDist = Infinity;
    
    for (const ship of myShips) {
      const dist = ship.pos.getDistance(site.pos);
      const hasResources = Object.keys(site.remainingResources)
        .some(r => ship.storage[r] > 0);
      
      if (hasResources && dist < minDist) {
        bestShip = ship;
        minDist = dist;
      }
    }
    
    if (bestShip) {
      if (bestShip.pos.isNear(site.pos)) {
        bestShip.supplyConstruction(site);
      } else {
        bestShip.moveTo(site.pos);
      }
    }
  }
}

supplyConstruction();
```

### Defense Network

```javascript
// Get all defense towers and their coverage
function getDefenseNetwork(galaxyId) {
  const towers = Game.getMyStructures()
    .filter(s => s.type === 'defense_tower' && s.galaxyId === galaxyId);
  
  const network = {
    towers: towers.length,
    coverage: []
  };
  
  for (const tower of towers) {
    network.coverage.push({
      pos: { x: tower.pos.x, y: tower.pos.y },
      range: 3,
      attack: 60
    });
  }
  
  return network;
}

const defense = getDefenseNetwork(ship.galaxyId);
console.log('Defense network:', defense);
```

