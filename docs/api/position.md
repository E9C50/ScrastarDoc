# Position API

Position objects represent coordinates in a galaxy. They are attached to ships, planets, structures, and other game objects.

## Position Properties

| Property | Type | Description |
|------|------|------|
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |
| `galaxyId` | `number` | Galaxy ID |

## Position Methods

### `pos.getDistance(otherPos)`

Calculate the Chebyshev distance (chess king distance) between two positions.

```javascript
const dist = ship.pos.getDistance(planet.pos);
console.log(`Distance: ${dist} grids`);
```

**Returns**: `number` - Distance in grid units

:::info Chebyshev Distance
Also known as "chess king distance", it is the maximum of the absolute differences in coordinates:
```
distance = max(|x1 - x2|, |y1 - y2|)
```
This means diagonal moves cost the same distance as orthogonal moves.
:::

### `pos.isNear(otherPos, [range])`

Check if another position is within range.

```javascript
// Check if adjacent (distance <= 1)
if (ship.pos.isNear(planet.pos)) {
  ship.harvest(planet);
}

// Check custom range
if (ship.pos.isNear(enemy.pos, 3)) {
  ship.attackTarget(enemy.id);
}
```

**Parameters**:
- `otherPos`: Position to check
- `range` (optional): Maximum distance (default: 1)

**Returns**: `boolean`

### `pos.inSameGalaxy(otherPos)`

Check if two positions are in the same galaxy.

```javascript
if (ship.pos.inSameGalaxy(planet.pos)) {
  console.log('Ship and planet in same galaxy');
}
```

**Returns**: `boolean`

## Accessing Positions

All major game objects have positions:

```javascript
// Ships
const shipPos = ship.pos;
console.log(`Ship at (${shipPos.x}, ${shipPos.y})`);

// Planets
const planetPos = planet.pos;

// Structures
const structurePos = structure.pos;

// Jumpgates
const gatePos = jumpgate.pos;

// Space Stations
const stationPos = spaceStation.pos;
```

## Position Calculations

### Find Nearest Object

```javascript
function findNearest(fromPos, objects) {
  let nearest = null;
  let minDist = Infinity;
  
  for (const obj of objects) {
    const dist = fromPos.getDistance(obj.pos);
    if (dist < minDist) {
      nearest = obj;
      minDist = dist;
    }
  }
  
  return { object: nearest, distance: minDist };
}

// Usage
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();
const result = findNearest(ship.pos, planets);

console.log(`Nearest planet: ${result.object.name}`);
console.log(`Distance: ${result.distance}`);
```

### Sort by Distance

```javascript
// Sort planets by distance from ship
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

const sorted = planets.sort((a, b) => {
  const distA = ship.pos.getDistance(a.pos);
  const distB = ship.pos.getDistance(b.pos);
  return distA - distB;
});

console.log('Planets sorted by distance:');
for (const planet of sorted.slice(0, 5)) {
  const dist = ship.pos.getDistance(planet.pos);
  console.log(`${planet.name}: ${dist} grids`);
}
```

### Position Filtering

```javascript
// Find all objects within range
function getObjectsInRange(centerPos, objects, range) {
  return objects.filter(obj => 
    centerPos.isNear(obj.pos, range)
  );
}

// Usage
const nearbyPlanets = getObjectsInRange(
  ship.pos,
  galaxy.getPlanets(),
  5
);

console.log(`${nearbyPlanets.length} planets within 5 grids`);
```

## Movement Calculations

### Straight-Line Path Distance

```javascript
// Calculate total distance of a path
function calculatePathLength(positions) {
  let totalDistance = 0;
  
  for (let i = 1; i < positions.length; i++) {
    totalDistance += positions[i-1].getDistance(positions[i]);
  }
  
  return totalDistance;
}

// Usage: find shortest path
const waypoints = [ship.pos, planet1.pos, planet2.pos, base.pos];
const distance = calculatePathLength(waypoints);
console.log(`Total path length: ${distance} grids`);
```

### Estimate Travel Time

```javascript
// Estimate ticks to reach destination
function estimateTravelTime(fromPos, toPos, shipEnergyPerTick) {
  const distance = fromPos.getDistance(toPos);
  // Ships move 1 grid per action, consuming 1 energy
  // Assuming ship acts once per tick
  return distance;
}

const ticks = estimateTravelTime(ship.pos, planet.pos, 10);
console.log(`Estimated arrival: ${ticks} ticks`);
```

## Coordinate Operations

### Manual Position Checking

```javascript
// Check if position is valid in galaxy
const galaxy = Game.getGalaxy(galaxyId);

function isValidPosition(x, y, galaxy) {
  return x >= galaxy.minCoord && x <= galaxy.maxCoord &&
         y >= galaxy.minCoord && y <= galaxy.maxCoord;
}

if (isValidPosition(50, 50, galaxy)) {
  console.log('Position (50, 50) is valid');
}
```

### Position Comparison

```javascript
// Check if two positions are identical
function samePosition(pos1, pos2) {
  return pos1.x === pos2.x && 
         pos1.y === pos2.y && 
         pos1.galaxyId === pos2.galaxyId;
}

if (samePosition(ship.pos, planet.pos)) {
  console.log('Ship is at planet position');
}
```

## Advanced Examples

### Area Scanner

```javascript
// Scan area around a position
function scanArea(centerPos, radius, galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  const scan = {
    center: { x: centerPos.x, y: centerPos.y },
    radius: radius,
    planets: [],
    ships: [],
    structures: [],
    jumpgates: []
  };
  
  // Scan planets
  for (const planet of galaxy.getPlanets()) {
    if (centerPos.isNear(planet.pos, radius)) {
      scan.planets.push({
        name: planet.name,
        pos: { x: planet.pos.x, y: planet.pos.y },
        distance: centerPos.getDistance(planet.pos),
        resources: planet.resources
      });
    }
  }
  
  // Scan ships
  for (const ship of galaxy.getAllShips()) {
    if (centerPos.isNear(ship.pos, radius)) {
      scan.ships.push({
        id: ship.id,
        name: ship.name,
        ownerId: ship.ownerId,
        pos: { x: ship.pos.x, y: ship.pos.y },
        distance: centerPos.getDistance(ship.pos)
      });
    }
  }
  
  // Scan structures
  for (const structure of galaxy.getAllStructures()) {
    if (centerPos.isNear(structure.pos, radius)) {
      scan.structures.push({
        id: structure.id,
        type: structure.type,
        ownerId: structure.ownerId,
        pos: { x: structure.pos.x, y: structure.pos.y },
        distance: centerPos.getDistance(structure.pos)
      });
    }
  }
  
  // Scan jumpgates
  for (const gate of galaxy.getJumpGates()) {
    if (centerPos.isNear(gate.pos, radius)) {
      scan.jumpgates.push({
        targetGalaxyId: gate.targetGalaxyId,
        pos: { x: gate.pos.x, y: gate.pos.y },
        distance: centerPos.getDistance(gate.pos)
      });
    }
  }
  
  return scan;
}

// Usage
const scan = scanArea(ship.pos, 10, ship.galaxyId);
console.log('Scan results:', JSON.stringify(scan, null, 2));
```

### Strategic Position Analysis

```javascript
// Analyze strategic value of a position
function analyzePosition(pos, galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  const analysis = {
    position: { x: pos.x, y: pos.y },
    nearbyResources: 0,
    nearbyPlanets: 0,
    enemyPresence: false,
    nearJumpgate: false,
    strategic_value: 0
  };
  
  // Check nearby planets and resources
  const planets = galaxy.getPlanets();
  for (const planet of planets) {
    const dist = pos.getDistance(planet.pos);
    if (dist <= 5) {
      analysis.nearbyPlanets++;
      const totalRes = Object.values(planet.resources)
        .reduce((sum, amt) => sum + amt, 0);
      analysis.nearbyResources += totalRes / (dist + 1);
    }
  }
  
  // Check enemy presence
  const enemies = galaxy.findHostileShips();
  for (const enemy of enemies) {
    if (pos.isNear(enemy.pos, 10)) {
      analysis.enemyPresence = true;
      break;
    }
  }
  
  // Check jumpgate proximity
  const gates = galaxy.getJumpGates();
  for (const gate of gates) {
    if (pos.isNear(gate.pos, 3)) {
      analysis.nearJumpgate = true;
      break;
    }
  }
  
  // Calculate strategic value
  analysis.strategic_value = 
    analysis.nearbyResources * 2 +
    analysis.nearbyPlanets * 10 +
    (analysis.nearJumpgate ? 50 : 0) -
    (analysis.enemyPresence ? 100 : 0);
  
  return analysis;
}

// Find best expansion position
const galaxy = Game.getGalaxy(ship.galaxyId);
let bestPos = null;
let bestValue = -Infinity;

for (let x = galaxy.minCoord; x <= galaxy.maxCoord; x += 5) {
  for (let y = galaxy.minCoord; y <= galaxy.maxCoord; y += 5) {
    const testPos = { x, y, galaxyId: ship.galaxyId };
    const analysis = analyzePosition(testPos, ship.galaxyId);
    
    if (analysis.strategic_value > bestValue) {
      bestValue = analysis.strategic_value;
      bestPos = testPos;
    }
  }
}

console.log(`Best expansion position: (${bestPos.x}, ${bestPos.y})`);
console.log(`Strategic value: ${bestValue}`);
```

