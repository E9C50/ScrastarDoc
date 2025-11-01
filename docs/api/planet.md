# Planet API

Planets are natural celestial bodies containing harvestable resources. They are locations for building structures.

## Planet Properties

| Property | Type | Description |
|------|------|------|
| `name` | `string` | Planet name |
| `type` | `string` | Planet type (determines resources) |
| `size` | `number` | Planet size |
| `resources` | `object` | Available resources and amounts |
| `galaxyId` | `number` | Parent galaxy ID |
| `pos` | `Position` | Planet coordinates |
| `structures` | `array` | Structures built on this planet |

## Resource Types

Planets can contain various resources:

- `iron_ore` - Basic building material
- `crystal` - Advanced components
- `deuterium` - Fuel and energy
- `metal` - Refined iron ore
- `alloy` - Advanced building material

## Methods

### `planet.getStructures()`

Get all structures built on this planet (that you own).

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

for (const planet of planets) {
  const structures = planet.getStructures();
  console.log(`${planet.name} has ${structures.length} structures`);
}
```

**Returns**: `array` - Array of Structure objects

## Accessing Planets

Access planets through Galaxy objects:

```javascript
// Get galaxy
const galaxy = Game.getGalaxy(galaxyId);

// Get all natural planets
const planets = galaxy.getPlanets();

// Iterate through planets
for (const planet of planets) {
  console.log(`Planet: ${planet.name}`);
  console.log(`Type: ${planet.type}`);
  console.log(`Position: (${planet.pos.x}, ${planet.pos.y})`);
  console.log(`Resources:`, planet.resources);
}
```

## Resource Depletion

Planet resources are finite. When harvesting, the available amount decreases:

```javascript
const planet = planets[0];
console.log(`Remaining iron ore: ${planet.resources.iron_ore}`);

// After harvesting
ship.harvest(planet, 'iron_ore');

// Resources decreased
console.log(`Remaining iron ore: ${planet.resources.iron_ore}`);
```

:::info Resource Regeneration
Currently, planet resources do not regenerate. Plan your mining operations carefully!
:::

## Planet Ownership

Planets can be claimed by building structures on them:

```javascript
// Build the first structure on an unclaimed planet
ship.build(planet, 'mining_facility');

// Planet is now owned by you
// Other players cannot build here until you abandon it
```

## Finding Planets

### Find by Resource

Find planets with specific resources:

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

const ironPlanets = planets.filter(p => 
  p.resources.iron_ore && p.resources.iron_ore > 100
);

console.log(`Found ${ironPlanets.length} planets with iron ore`);
```

### Find by Distance

Find the nearest planet to a ship:

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

let nearest = null;
let minDist = Infinity;

for (const planet of planets) {
  const dist = ship.pos.getDistance(planet.pos);
  if (dist < minDist) {
    nearest = planet;
    minDist = dist;
  }
}

if (nearest) {
  console.log(`Nearest planet: ${nearest.name} at distance ${minDist}`);
}
```

### Find by Type

Different planet types have different resource distributions:

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

// Group by type
const byType = {};
for (const planet of planets) {
  if (!byType[planet.type]) {
    byType[planet.type] = [];
  }
  byType[planet.type].push(planet);
}

console.log('Planets by type:', Object.keys(byType));
```

## Space Stations

Space stations are player-built and behave like planets:

```javascript
// Get all space stations in galaxy
const stations = galaxy.getSpaceStations();

// Only your stations
const myStations = galaxy.getMyStations();

// Build on a station (same as planets)
ship.build(station, 'factory');
```

See [Galaxy API](./galaxy) for details.

## Examples

### Efficient Mining Strategy

```javascript
// Find the best mining planet
function findBestMiningPlanet(ship) {
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const planets = galaxy.getPlanets();
  
  let best = null;
  let bestScore = 0;
  
  for (const planet of planets) {
    // Skip planets with no resources
    const ironAmount = planet.resources.iron_ore || 0;
    if (ironAmount === 0) continue;
    
    // Calculate score based on resources and distance
    const distance = ship.pos.getDistance(planet.pos);
    const score = ironAmount / (distance + 1);
    
    if (score > bestScore) {
      best = planet;
      bestScore = score;
    }
  }
  
  return best;
}

// Use the function
const myShips = Game.getMyShips();
for (const ship of myShips) {
  const planet = findBestMiningPlanet(ship);
  if (planet) {
    ship.moveTo(planet.pos);
  }
}
```

### Survey All Planets

```javascript
// Create a resource map
function surveyGalaxy(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const planets = galaxy.getPlanets();
  
  const survey = {
    totalPlanets: planets.length,
    resources: {},
    planetList: []
  };
  
  for (const planet of planets) {
    const planetInfo = {
      name: planet.name,
      type: planet.type,
      pos: { x: planet.pos.x, y: planet.pos.y },
      resources: planet.resources,
      hasStructures: planet.structures.length > 0
    };
    
    survey.planetList.push(planetInfo);
    
    // Aggregate resources
    for (const [resource, amount] of Object.entries(planet.resources)) {
      if (!survey.resources[resource]) {
        survey.resources[resource] = 0;
      }
      survey.resources[resource] += amount;
    }
  }
  
  return survey;
}

// Run survey
const survey = surveyGalaxy(ship.galaxyId);
console.log('Galaxy survey:', JSON.stringify(survey, null, 2));
```

