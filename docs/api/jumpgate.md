# Jumpgate API

Jumpgates are natural wormholes that connect galaxies. They allow ships to travel instantly between star systems.

## Jumpgate Properties

| Property | Type | Description |
|------|------|------|
| `id` | `number` | Unique identifier |
| `name` | `string` | Jumpgate name |
| `galaxyId` | `number` | Current galaxy ID |
| `targetGalaxyId` | `number` | Destination galaxy ID |
| `pos` | `Position` | Jumpgate position |

## Accessing Jumpgates

Access jumpgates through Galaxy objects:

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const gates = galaxy.getJumpGates();

for (const gate of gates) {
  console.log(`Jumpgate to galaxy ${gate.targetGalaxyId}`);
  console.log(`Location: (${gate.pos.x}, ${gate.pos.y})`);
}
```

## Using Jumpgates

### `ship.useJumpGate(jumpgate)`

Travel to another galaxy through a jumpgate.

```javascript
// Find jumpgates in current galaxy
const galaxy = Game.getGalaxy(ship.galaxyId);
const gates = galaxy.getJumpGates();

if (gates.length > 0) {
  const gate = gates[0];
  
  // Move to jumpgate
  if (ship.pos.isNear(gate.pos)) {
    // Use the jumpgate
    ship.useJumpGate(gate);
    console.log(`Jumped to galaxy ${gate.targetGalaxyId}`);
  } else {
    ship.moveTo(gate.pos);
  }
}
```

**Requirements**:
- Ship must be adjacent to jumpgate (distance `<=` 1)
- Requires `warp_drive` component
- Consumes energy based on component efficiency

**Returns**: `boolean` - success/failure

:::info Warp Drive Required
Ships need a `warp_drive` component to use jumpgates. Without it, ships cannot travel between galaxies.
:::

## Jumpgate Network

Galaxies are connected through a network of jumpgates:

```javascript
// Map all connected galaxies
function mapGalaxyNetwork(startGalaxyId, maxDepth = 3) {
  const network = {
    galaxies: new Set([startGalaxyId]),
    connections: [],
    explored: new Set()
  };
  
  function explore(galaxyId, depth) {
    if (depth > maxDepth || network.explored.has(galaxyId)) {
      return;
    }
    
    network.explored.add(galaxyId);
    
    try {
      const galaxy = Game.getGalaxy(galaxyId);
      const gates = galaxy.getJumpGates();
      
      for (const gate of gates) {
        network.galaxies.add(gate.targetGalaxyId);
        network.connections.push({
          from: galaxyId,
          to: gate.targetGalaxyId,
          pos: { x: gate.pos.x, y: gate.pos.y }
        });
        
        explore(gate.targetGalaxyId, depth + 1);
      }
    } catch (e) {
      // Galaxy inaccessible
    }
  }
  
  explore(startGalaxyId, 0);
  
  return {
    galaxyCount: network.galaxies.size,
    connectionCount: network.connections.length,
    galaxies: Array.from(network.galaxies),
    connections: network.connections
  };
}

// Usage
const network = mapGalaxyNetwork(ship.galaxyId, 2);
console.log(`Connected to ${network.galaxyCount} galaxies`);
console.log(`Total connections: ${network.connectionCount}`);
```

## Finding Paths

### `Game.findPathBetweenGalaxies(fromGalaxyId, toGalaxyId)`

Find a path between two galaxies through jumpgates.

```javascript
const path = Game.findPathBetweenGalaxies(
  ship.galaxyId,
  targetGalaxyId
);

if (path) {
  console.log(`Found path: ${path.length} jumps`);
  for (let i = 0; i < path.length; i++) {
    console.log(`${i + 1}. Galaxy ${path[i]}`);
  }
} else {
  console.log('No path found');
}
```

**Returns**: Array of galaxy IDs, or `null` if no path exists

## Examples

### Automated Exploration

```javascript
// Explore through jumpgates
function exploreNewGalaxies(ship) {
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const gates = galaxy.getJumpGates();
  
  // Filter gates to unvisited galaxies
  const unvisited = gates.filter(gate => {
    const visited = Game.getVisibleGalaxies();
    return !visited.includes(gate.targetGalaxyId);
  });
  
  if (unvisited.length > 0) {
    const gate = unvisited[0];
    
    if (ship.pos.isNear(gate.pos)) {
      ship.useJumpGate(gate);
      console.log(`Exploring galaxy ${gate.targetGalaxyId}`);
    } else {
      ship.moveTo(gate.pos);
    }
    
    return true;
  }
  
  return false;
}

// Run explorer ships
const explorers = Game.getMyShips()
  .filter(s => s.components.includes('warp_drive'));

for (const ship of explorers) {
  exploreNewGalaxies(ship);
}
```

### Trade Route Planning

```javascript
// Plan trade route through multiple galaxies
function planTradeRoute(startGalaxyId, galaxyIds) {
  const route = {
    start: startGalaxyId,
    stops: [],
    totalJumps: 0,
    feasible: true
  };
  
  let currentGalaxy = startGalaxyId;
  
  for (const targetGalaxy of galaxyIds) {
    const path = Game.findPathBetweenGalaxies(currentGalaxy, targetGalaxy);
    
    if (!path) {
      route.feasible = false;
      console.log(`Cannot reach galaxy ${targetGalaxy} from ${currentGalaxy}`);
      break;
    }
    
    route.stops.push({
      galaxy: targetGalaxy,
      path: path,
      jumps: path.length - 1
    });
    
    route.totalJumps += path.length - 1;
    currentGalaxy = targetGalaxy;
  }
  
  return route;
}

// Usage
const tradeRoute = planTradeRoute(ship.galaxyId, [
  12345,  // Mining galaxy
  12346,  // Processing galaxy
  12347   // Market galaxy
]);

if (tradeRoute.feasible) {
  console.log(`Trade route: ${tradeRoute.totalJumps} total jumps`);
}
```

### Fleet Coordination

```javascript
// Move entire fleet through jumpgates
function moveFleetThroughGate(ships, targetGalaxyId) {
  // Find ships already in target galaxy
  const scouts = ships.filter(s => s.galaxyId === targetGalaxyId);
  
  if (scouts.length > 0) {
    console.log('Fleet already has presence in target galaxy');
  }
  
  // Move remaining ships
  for (const ship of ships) {
    if (ship.galaxyId === targetGalaxyId) {
      continue; // Already there
    }
    
    // Find path to target galaxy
    const path = Game.findPathBetweenGalaxies(
      ship.galaxyId,
      targetGalaxyId
    );
    
    if (!path || path.length < 2) {
      console.log(`Ship ${ship.name}: No path to target`);
      continue;
    }
    
    // Get next galaxy in path
    const nextGalaxyId = path[1];
    
    // Find jumpgate to next galaxy
    const galaxy = Game.getGalaxy(ship.galaxyId);
    const gate = galaxy.getJumpGates()
      .find(g => g.targetGalaxyId === nextGalaxyId);
    
    if (!gate) {
      console.log(`Ship ${ship.name}: Jumpgate not found`);
      continue;
    }
    
    // Move and use jumpgate
    if (ship.pos.isNear(gate.pos)) {
      if (ship.useJumpGate(gate)) {
        console.log(`Ship ${ship.name}: Jumped to galaxy ${nextGalaxyId}`);
      }
    } else {
      ship.moveTo(gate.pos);
      console.log(`Ship ${ship.name}: Moving to jumpgate`);
    }
  }
}

// Move fleet to target
const myFleet = Game.getMyShips()
  .filter(s => s.components.includes('warp_drive'));

moveFleetThroughGate(myFleet, 12345);
```

### Jumpgate Defense

```javascript
// Defend jumpgates in your territory
function defendJumpgates(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const gates = galaxy.getJumpGates();
  const defenders = galaxy.getMyShips()
    .filter(s => s.components.some(c => 
      c === 'laser_weapon' || c === 'missile_launcher'
    ));
  
  for (const gate of gates) {
    // Check for enemies near jumpgate
    const enemies = galaxy.findHostileShips()
      .filter(e => gate.pos.isNear(e.pos, 5));
    
    if (enemies.length > 0) {
      console.log(`⚠️ ${enemies.length} enemies near jumpgate!`);
      
      // Assign defenders
      const nearest = defenders
        .sort((a, b) => {
          const distA = a.pos.getDistance(gate.pos);
          const distB = b.pos.getDistance(gate.pos);
          return distA - distB;
        })[0];
      
      if (nearest) {
        const target = enemies[0];
        const dist = nearest.pos.getDistance(target.pos);
        
        if (dist <= 2) {
          nearest.attackTarget(target.id);
        } else {
          nearest.moveTo(gate.pos);
        }
      }
    }
  }
}

defendJumpgates(ship.galaxyId);
```

