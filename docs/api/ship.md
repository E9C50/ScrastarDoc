# Ship API

Ships are the primary units in StarGame. They can move, collect resources, build structures, engage in combat, and more.

## Getting Ships

### `Game.getMyShips()`

Returns an array of all your ships.

```javascript
const myShips = Game.getMyShips();
console.log(`I have ${myShips.length} ships`);
```

### `Game.getAllShips(galaxyId)`

Returns all ships in the specified galaxy (including enemy ships).

```javascript
const allShips = Game.getAllShips(ship.galaxyId);
```

### `Game.findHostileShips(galaxyId)`

Returns only hostile ships in the galaxy.

```javascript
const enemies = Game.findHostileShips(ship.galaxyId);
```

## Ship Properties

| Property | Type | Description |
|------|------|------|
| `id` | `number` | Unique ship identifier |
| `name` | `string` | Ship name |
| `hp` | `number` | Current hit points |
| `maxHP` | `number` | Maximum hit points |
| `energy` | `number` | Current energy |
| `maxEnergy` | `number` | Maximum energy capacity |
| `shield` | `number` | Current shield strength |
| `maxShield` | `number` | Maximum shield capacity |
| `attack` | `number` | Attack power |
| `defense` | `number` | Defense level |
| `radiance` | `number` | Current radiance (action points) |
| `maxRadiance` | `number` | Maximum radiance |
| `storage` | `object` | Resource storage |
| `storageCapacity` | `number` | Maximum storage space |
| `components` | `array` | Installed components |
| `galaxyId` | `number` | Current galaxy ID |
| `pos` | `Position` | Ship position (see [Position API](./position)) |

## Movement

### `ship.move(direction)`

Move one grid space in a direction. Consumes 1 energy.

**Directions**: `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"`, `"sw"`

```javascript
ship.move("n");  // Move north
ship.move("ne"); // Move northeast
```

**Returns**: `boolean` - success/failure

### `ship.moveTo(target)`

Move towards a target position or object. Consumes 1 energy per grid space moved.

```javascript
// Move to coordinates
ship.moveTo(10, 20);

// Move to a position object
ship.moveTo(planet.pos);

// Move to another object
ship.moveTo(targetShip.pos);
```

**Returns**: `boolean` - success/failure

## Resource Harvesting

### `ship.harvest(target, [resourceType])`

Harvest resources from a planet. Requires `mining_laser` component.

```javascript
// Harvest the first available resource
ship.harvest(planet);

// Harvest a specific resource
ship.harvest(planet, 'iron_ore');
```

**Parameters**:
- `target`: Planet object
- `resourceType` (optional): Resource to harvest

**Returns**: `boolean` - success/failure

**Cost**: 5 energy

:::tip Mining Efficiency
Each `mining_laser` component increases harvesting rate by 2 units.
:::

## Construction

### `ship.build(target, structureType)`

Start building a structure. Requires `construction_arm` component.

```javascript
ship.build(planet, 'mining_facility');
```

**Parameters**:
- `target`: Planet or space station object
- `structureType`: Type of structure to build

**Returns**: `boolean` - success/failure

### `ship.supplyConstruction(constructionSite, [resources])`

Deliver resources to a construction site.

```javascript
// Deliver all required resources
ship.supplyConstruction(site);

// Deliver specific resources
ship.supplyConstruction(site, {
  iron_ore: 50,
  crystal: 20
});
```

**Returns**: `boolean` - success/failure

### `ship.buildStation(name, x, y)`

Build a space station at coordinates. Requires `construction_arm` component.

```javascript
ship.buildStation("Alpha Station", 50, 50);
```

**Cost**:
- 50 energy
- 200 iron ore
- 100 crystal
- 50 deuterium

**Returns**: `boolean` - success/failure

## Combat

### `ship.attackTarget(targetId)`

Attack a ship or structure with basic weapons.

```javascript
const enemy = Game.findHostileShips(ship.galaxyId)[0];
ship.attackTarget(enemy.id);
```

**Cost**: 10 energy
**Range**: 2 grids (Chebyshev distance)

**Returns**: `boolean` - success/failure

### `ship.fireMissile(target)`

Fire a missile at the target. Requires `missile_launcher` component.

```javascript
ship.fireMissile(enemyShip);
```

**Properties**:
- High damage to shields (150%)
- Bonus damage to structures (125%)
- Has cooldown period
- Consumes 1 missile from storage

**Returns**: `boolean` - success/failure

### `ship.fireLaser(target)`

Fire a laser at the target. Requires `laser_weapon` component.

```javascript
ship.fireLaser(enemyShip);
```

**Properties**:
- Lower damage to shields (70%)
- No cooldown period
- Energy-based weapon

**Returns**: `boolean` - success/failure

## Support Actions

### `ship.repair(targetId)`

Repair a friendly ship or structure. Requires `repair_drone` component.

```javascript
ship.repair(damagedShip.id);
```

**Cost**: 15 energy
**Healing**: 50 HP

**Returns**: `boolean` - success/failure

### `ship.enableShield()`

Activate ship shields. Requires shield generator component.

```javascript
ship.enableShield();
```

**Returns**: `boolean` - success/failure

### `ship.disableShield()`

Deactivate ship shields.

```javascript
ship.disableShield();
```

**Returns**: `boolean` - success/failure

## Resource Management

### `ship.transfer(target, resource, amount)`

Transfer resources to another ship or structure.

```javascript
ship.transfer(otherShip, 'iron_ore', 100);
ship.transfer(structure, 'energy', 50);
```

**Returns**: `boolean` - success/failure

### `ship.withdraw(structure, resource, amount)`

Withdraw resources from a structure's storage.

```javascript
ship.withdraw(warehouse, 'iron_ore', 200);
```

**Returns**: `boolean` - success/failure

### `ship.drop(resource, amount)`

Drop resources (permanently destroyed).

```javascript
ship.drop('iron_ore', 50);
```

**Returns**: `boolean` - success/failure

### `ship.getStorageUsed()`

Get the currently used storage space.

```javascript
const used = ship.getStorageUsed();
console.log(`Storage: ${used}/${ship.storageCapacity}`);
```

**Returns**: `number`

### `ship.getStorageAvailable()`

Get the available storage space.

```javascript
const available = ship.getStorageAvailable();
if (available >= 100) {
  ship.harvest(planet);
}
```

**Returns**: `number`

## Advanced Features

### `ship.selfDestruct()`

Immediately destroy the ship.

```javascript
if (ship.hp < 10 && enemies.length > 5) {
  ship.selfDestruct();
}
```

**Returns**: `boolean` - always true

:::danger Permanent Destruction
This action is irreversible! The ship and its cargo will be lost forever.
:::

## Component Methods

Additional methods are available based on installed components. See [Components API](./components) for details.

## Examples

### Basic Mining Loop

```javascript
const myShips = Game.getMyShips();

for (const ship of myShips) {
  if (!ship.components.includes('mining_laser')) continue;
  
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const planets = galaxy.getPlanets();
  
  // Find the nearest planet with resources
  let nearest = null;
  let minDist = Infinity;
  
  for (const planet of planets) {
    const dist = ship.pos.getDistance(planet.pos);
    if (dist < minDist && planet.resources.iron_ore > 0) {
      nearest = planet;
      minDist = dist;
    }
  }
  
  if (nearest) {
    if (ship.pos.isNear(nearest.pos)) {
      // Mine if storage has space
      if (ship.getStorageAvailable() >= 10) {
        ship.harvest(nearest, 'iron_ore');
      } else {
        // Find warehouse to unload
        const warehouses = Game.getMyStructures()
          .filter(s => s.type === 'warehouse');
        if (warehouses.length > 0) {
          ship.moveTo(warehouses[0].pos);
        }
      }
    } else {
      ship.moveTo(nearest.pos);
    }
  }
}
```

### Combat Patrol

```javascript
const myShips = Game.getMyShips();

for (const ship of myShips) {
  // Check if ship has weapons
  const hasMissiles = ship.components.includes('missile_launcher');
  const hasLaser = ship.components.includes('laser_weapon');
  
  if (!hasMissiles && !hasLaser) continue;
  
  // Find enemies
  const enemies = Game.findHostileShips(ship.galaxyId);
  
  if (enemies.length > 0) {
    const target = enemies[0];
    const dist = ship.pos.getDistance(target.pos);
    
    // Attack if in range
    if (dist <= 2) {
      if (hasMissiles && ship.getMissileCooldown() === 0) {
        ship.fireMissile(target);
      } else if (hasLaser) {
        ship.fireLaser(target);
      }
    } else {
      // Move closer to target
      ship.moveTo(target.pos);
    }
  }
}
```

