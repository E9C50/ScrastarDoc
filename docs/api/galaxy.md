# Galaxy API

Galaxies are star systems containing planets, jumpgates, ships, and structures. They are the primary containers for game objects.

## Getting Galaxies

### `Game.getGalaxy(galaxyId)`

Get a galaxy object by ID.

```javascript
const galaxy = Game.getGalaxy(12345);
console.log(`Galaxy: ${galaxy.name}`);
```

### `Game.getVisibleGalaxies()`

Get the IDs of all galaxies where you have a presence (ships or structures).

```javascript
const myGalaxies = Game.getVisibleGalaxies();
console.log(`I have presence in ${myGalaxies.length} galaxies`);

for (const galaxyId of myGalaxies) {
  const galaxy = Game.getGalaxy(galaxyId);
  console.log(`- ${galaxy.name}`);
}
```

**Returns**: `array` of `number` - Galaxy IDs

## Galaxy Properties

| Property | Type | Description |
|------|------|------|
| `seed` | `number` | Galaxy seed (same as ID) |
| `name` | `string` | Galaxy name |
| `starType` | `string` | Star type (affects planet distribution) |
| `positionX` | `number` | X coordinate in universe |
| `positionY` | `number` | Y coordinate in universe |
| `planetsCount` | `number` | Number of natural planets |
| `gridSize` | `number` | Internal grid size |
| `minCoord` | `number` | Minimum coordinate |
| `maxCoord` | `number` | Maximum coordinate |

## Galaxy Methods

### Planets

#### `galaxy.getPlanets()`

Get all natural planets in the galaxy.

```javascript
const galaxy = Game.getGalaxy(galaxyId);
const planets = galaxy.getPlanets();

console.log(`${galaxy.name} has ${planets.length} planets`);

for (const planet of planets) {
  console.log(`- ${planet.name} at (${planet.pos.x}, ${planet.pos.y})`);
}
```

**Returns**: `array` of Planet objects

### Space Stations

#### `galaxy.getSpaceStations()`

Get all space stations in the galaxy (all players).

```javascript
const stations = galaxy.getSpaceStations();
console.log(`${stations.length} stations in galaxy`);
```

**Returns**: `array` of SpaceStation objects

#### `galaxy.getMyStations()`

Get only your space stations in this galaxy.

```javascript
const myStations = galaxy.getMyStations();
```

**Returns**: `array` of SpaceStation objects

#### `galaxy.getStationsByOwner(ownerId)`

Get space stations owned by a specific player.

```javascript
const enemyStations = galaxy.getStationsByOwner(enemyPlayerId);
```

**Returns**: `array` of SpaceStation objects

#### `galaxy.findHostileStations()`

Get all hostile space stations in the galaxy.

```javascript
const hostileStations = galaxy.findHostileStations();
```

**Returns**: `array` of SpaceStation objects

### Ships

#### `galaxy.getMyShips()`

Get all your ships in this galaxy.

```javascript
const myShips = galaxy.getMyShips();
console.log(`I have ${myShips.length} ships here`);
```

**Returns**: `array` of Ship objects

#### `galaxy.getAllShips()`

Get all ships in the galaxy (including hostile).

```javascript
const allShips = galaxy.getAllShips();
```

**Returns**: `array` of Ship objects

#### `galaxy.getShipsByOwner(ownerId)`

Get ships owned by a specific player.

```javascript
const enemyShips = galaxy.getShipsByOwner(enemyPlayerId);
```

**Returns**: `array` of Ship objects

#### `galaxy.findHostileShips()`

Get all hostile ships in the galaxy.

```javascript
const enemies = galaxy.findHostileShips();
if (enemies.length > 0) {
  console.log(`Warning: ${enemies.length} hostile ships detected!`);
}
```

**Returns**: `array` of Ship objects

### Structures

#### `galaxy.getMyStructures()`

Get all your structures in this galaxy.

```javascript
const myStructures = galaxy.getMyStructures();
```

**Returns**: `array` of Structure objects

#### `galaxy.getAllStructures()`

Get all structures in the galaxy (including hostile).

```javascript
const allStructures = galaxy.getAllStructures();
```

**Returns**: `array` of Structure objects

#### `galaxy.getStructuresByOwner(ownerId)`

Get structures owned by a specific player.

```javascript
const enemyStructures = galaxy.getStructuresByOwner(enemyPlayerId);
```

**Returns**: `array` of Structure objects

#### `galaxy.findHostileStructures()`

Get all hostile structures in the galaxy.

```javascript
const enemyBases = galaxy.findHostileStructures();
```

**Returns**: `array` of Structure objects

### Jumpgates

#### `galaxy.getJumpGates()`

Get all jumpgates in the galaxy.

```javascript
const gates = galaxy.getJumpGates();

for (const gate of gates) {
  console.log(`Jumpgate to galaxy ${gate.targetGalaxyId}`);
  console.log(`Location: (${gate.pos.x}, ${gate.pos.y})`);
}
```

**Returns**: `array` of JumpGate objects

See [Jumpgate API](./jumpgate) for details.

### Scanning

#### `galaxy.lookAt(x, y)`

Get all objects at a specific position.

```javascript
const objects = galaxy.lookAt(50, 50);

for (const obj of objects) {
  if (obj.type === 'planet') {
    console.log(`Found planet: ${obj.name}`);
  } else if (obj.type === 'ship') {
    console.log(`Found ship: ${obj.name}`);
  }
}
```

**Returns**: `array` of objects at that position

#### `galaxy.scanArea(x, y, radius)`

Scan for objects within an area.

```javascript
const scan = galaxy.scanArea(50, 50, 10);

console.log(`Ships in area: ${scan.ships.length}`);
console.log(`Structures in area: ${scan.structures.length}`);
console.log(`Center: (${scan.center.x}, ${scan.center.y})`);
console.log(`Radius: ${scan.radius}`);
```

**Returns**: Object containing:
- `ships`: Array of ships in range
- `structures`: Array of structures in range
- `center`: Center position
- `radius`: Scan radius

## Galaxy Coordinates

Galaxies use a grid coordinate system:

```javascript
const galaxy = Game.getGalaxy(galaxyId);

// Grid dimensions
console.log(`Grid size: ${galaxy.gridSize}x${galaxy.gridSize}`);
console.log(`Coordinates: ${galaxy.minCoord} to ${galaxy.maxCoord}`);

// Example: 21x21 grid from -10 to +10
// Center is at (0, 0)
```

## Star Types

Different star types have different characteristics:

- `blue_giant` - Large hot stars with many metal-rich planets
- `yellow_star` - Balanced systems, like our Sun
- `red_dwarf` - Cooler stars with fewer but resource-rich planets
- `white_dwarf` - Small dense systems
- `binary_star` - Binary star systems with unique planet formations

## Examples

### Galaxy Overview

```javascript
function getGalaxyOverview(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  return {
    name: galaxy.name,
    starType: galaxy.starType,
    coordinates: [galaxy.positionX, galaxy.positionY],
    naturalPlanets: galaxy.getPlanets().length,
    spaceStations: galaxy.getSpaceStations().length,
    myShips: galaxy.getMyShips().length,
    myStructures: galaxy.getMyStructures().length,
    enemyShips: galaxy.findHostileShips().length,
    enemyStructures: galaxy.findHostileStructures().length,
    jumpGates: galaxy.getJumpGates().length
  };
}

const overview = getGalaxyOverview(ship.galaxyId);
console.log(JSON.stringify(overview, null, 2));
```

### Multi-Galaxy Management

```javascript
// Manage all your galaxies
const myGalaxies = Game.getVisibleGalaxies();

for (const galaxyId of myGalaxies) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  console.log(`\n=== ${galaxy.name} ===`);
  
  // Count ships
  const ships = galaxy.getMyShips();
  console.log(`Ships: ${ships.length}`);
  
  // Count structures
  const structures = galaxy.getMyStructures();
  const completed = structures.filter(s => s.progress === 100).length;
  console.log(`Structures: ${completed}/${structures.length} complete`);
  
  // Check threats
  const enemies = galaxy.findHostileShips();
  if (enemies.length > 0) {
    console.log(`⚠️ Warning: ${enemies.length} hostile ships!`);
  }
}
```

### Resource Mapping

```javascript
// Create a resource map of the galaxy
function mapGalaxyResources(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const planets = galaxy.getPlanets();
  
  const resourceMap = {};
  
  for (const planet of planets) {
    for (const [resource, amount] of Object.entries(planet.resources)) {
      if (!resourceMap[resource]) {
        resourceMap[resource] = {
          total: 0,
          locations: []
        };
      }
      
      resourceMap[resource].total += amount;
      resourceMap[resource].locations.push({
        planet: planet.name,
        amount: amount,
        pos: { x: planet.pos.x, y: planet.pos.y }
      });
    }
  }
  
  // Sort locations by amount
  for (const resource in resourceMap) {
    resourceMap[resource].locations.sort((a, b) => b.amount - a.amount);
  }
  
  return resourceMap;
}

const resMap = mapGalaxyResources(ship.galaxyId);
console.log('Iron ore deposits:', resMap.iron_ore);
```

