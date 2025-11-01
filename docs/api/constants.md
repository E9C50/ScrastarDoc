# Constants & Resources

This page lists all game constants, resource types, structure types, and component types.

## Resource Types

### Basic Resources

```javascript
// Raw materials from planets
const RAW_RESOURCES = {
  IRON_ORE: 'iron_ore',
  CRYSTAL: 'crystal',
  DEUTERIUM: 'deuterium'
};
```

| Resource | Description | Source |
|------|------|------|
| `iron_ore` | Raw iron ore | Planets, asteroids |
| `crystal` | Energy crystals | Planets |
| `deuterium` | Heavy hydrogen fuel | Planets, gas giants |

### Refined Resources

```javascript
// Processed materials
const REFINED_RESOURCES = {
  METAL: 'metal',
  ALLOY: 'alloy'
};
```

| Resource | Description | Production |
|------|------|------|
| `metal` | Refined iron | Factory: 10 iron_ore → 5 metal |
| `alloy` | Advanced alloy | Factory: 5 crystal + 5 metal → 3 alloy |

### Special Resources

```javascript
// Special items
const SPECIAL_RESOURCES = {
  ENERGY: 'energy',
  MISSILE: 'missile'
};
```

| Resource | Description | Production |
|------|------|------|
| `energy` | Energy | Energy plants, power cores |
| `missile` | Ammunition | Component factories |

## Structure Types

### Production Structures

```javascript
const PRODUCTION_STRUCTURES = {
  MINING_FACILITY: 'mining_facility',
  IRON_EXTRACTOR: 'iron_extractor',
  CRYSTAL_HARVESTER: 'crystal_harvester',
  DEUTERIUM_COLLECTOR: 'deuterium_collector',
  FACTORY: 'factory',
  COMPONENT_FACTORY: 'component_factory',
  ENERGY_PLANT: 'energy_plant'
};
```

| Structure | Purpose | Production |
|------|------|------|
| `mining_facility` | General mining | Any planet resource |
| `iron_extractor` | Iron extraction | Iron ore only |
| `crystal_harvester` | Crystal harvesting | Crystal only |
| `deuterium_collector` | Deuterium collection | Deuterium only |
| `factory` | Refining | Metal, alloy, etc |
| `component_factory` | Components | Ship components |
| `energy_plant` | Power generation | Energy |

### Storage Structures

```javascript
const STORAGE_STRUCTURES = {
  STORAGE: 'storage',
  WAREHOUSE: 'warehouse'
};
```

| Structure | Capacity | Description |
|------|------|------|
| `storage` | 2000 | Basic storage |
| `warehouse` | 5000 | Large warehouse |

### Military Structures

```javascript
const MILITARY_STRUCTURES = {
  DEFENSE_TOWER: 'defense_tower',
  SHIELD_GENERATOR: 'shield_generator',
  SHIPYARD: 'shipyard'
};
```

| Structure | Purpose | Properties |
|------|------|------|
| `defense_tower` | Automated defense | Attack: 60, Range: 3 |
| `shield_generator` | Area shielding | Protects nearby structures |
| `shipyard` | Ship construction | Builds ships |

### Special Structures

```javascript
const SPECIAL_STRUCTURES = {
  TRADE_TERMINAL: 'trade_terminal',
  LAB: 'lab'
};
```

| Structure | Purpose | Status |
|------|------|------|
| `trade_terminal` | Trading | Future feature |
| `lab` | Research | Future feature |

## Component Types

### Engine Components

```javascript
const ENGINES = {
  BASIC_ENGINE: 'basic_engine',
  ADVANCED_ENGINE: 'advanced_engine',
  WARP_DRIVE: 'warp_drive'
};
```

| Component | Energy Bonus | Special |
|------|----------|------|
| `basic_engine` | 0 | Standard |
| `advanced_engine` | +50 | Improved |
| `warp_drive` | +100 | Jumpgate travel |

### Resource Components

```javascript
const RESOURCE_COMPONENTS = {
  MINING_LASER: 'mining_laser',
  STORAGE: 'storage',
  RESOURCE_SCANNER: 'resource_scanner'
};
```

| Component | Bonus | Effect |
|------|------|------|
| `mining_laser` | - | +2 harvest rate each |
| `storage` | +500 capacity | Cargo space |
| `resource_scanner` | - | Remote scanning |

### Construction Components

```javascript
const CONSTRUCTION_COMPONENTS = {
  CONSTRUCTION_ARM: 'construction_arm',
  REPAIR_DRONE: 'repair_drone'
};
```

| Component | Effect |
|------|------|
| `construction_arm` | Build structures |
| `repair_drone` | Repair ships/structures |

### Combat Components

```javascript
const COMBAT_COMPONENTS = {
  WEAPON_SYSTEM: 'weapon_system',
  TARGETING_SYSTEM: 'targeting_system',
  MISSILE_LAUNCHER: 'missile_launcher',
  LASER_WEAPON: 'laser_weapon'
};
```

| Component | Attack Bonus | Special |
|------|----------|------|
| `weapon_system` | +30 | General combat |
| `targeting_system` | +20 | Accuracy |
| `missile_launcher` | - | Missile attack |
| `laser_weapon` | - | Laser attack |

### Defense Components

```javascript
const DEFENSE_COMPONENTS = {
  SHIELD_GENERATOR: 'shield_generator',
  ARMOR_PLATING: 'armor_plating'
};
```

| Component | Bonus | Effect |
|------|------|------|
| `shield_generator` | +100 shield | Energy shields |
| `armor_plating` | +30 defense | Damage mitigation |

### Utility Components

```javascript
const UTILITY_COMPONENTS = {
  POWER_CORE: 'power_core',
  SENSOR_ARRAY: 'sensor_array',
  CLOAKING_DEVICE: 'cloaking_device'
};
```

| Component | Bonus | Effect |
|------|------|------|
| `power_core` | +200 energy | High capacity |
| `sensor_array` | - | Long-range detection |
| `cloaking_device` | - | Invisibility |

## Game Mechanics Constants

### Movement

```javascript
const MOVEMENT = {
  COST_PER_GRID: 1,        // Energy cost per grid
  DISTANCE_METRIC: 'chebyshev'  // Chess king distance
};
```

### Combat

```javascript
const COMBAT = {
  BASIC_ATTACK_RANGE: 2,
  BASIC_ATTACK_COST: 10,
  BASIC_ATTACK_DAMAGE: 'variable',  // Based on ship attack attribute
  
  MISSILE_RANGE: 5,
  MISSILE_DAMAGE: 80,
  MISSILE_COOLDOWN: 3,
  MISSILE_SHIELD_MULTIPLIER: 1.5,
  MISSILE_STRUCTURE_MULTIPLIER: 1.25,
  
  LASER_RANGE: 4,
  LASER_DAMAGE: 50,
  LASER_COST: 25,
  LASER_SHIELD_MULTIPLIER: 0.7,
  
  DAMAGE_FORMULA: 'Attack Power - Defense/2, minimum 1'
};
```

### Harvesting

```javascript
const HARVESTING = {
  COST: 5,                    // Energy cost
  BASE_AMOUNT: 2,             // Base harvest amount
  MINING_LASER_BONUS: 2,      // Per laser
  REQUIRES_COMPONENT: 'mining_laser'
};
```

### Construction

```javascript
const CONSTRUCTION = {
  MIN_DISTANCE: 1,            // Must be adjacent
  REQUIRES_COMPONENT: 'construction_arm',
  PROGRESS_PER_TICK: 'variable'  // Based on supplied resources
};
```

### Ship Building

```javascript
const SHIP_BUILDING = {
  BASE_COST: {
    iron_ore: 200,
    crystal: 100,
    deuterium: 50
  },
  BUILD_TIME: 20,             // Ticks
  MAX_COMPONENTS: 8
};
```

### Space Station

```javascript
const SPACE_STATION = {
  COST: {
    energy: 50,
    iron_ore: 200,
    crystal: 100,
    deuterium: 50
  },
  STATS: {
    maxHP: 1000,
    maxEnergy: 500,
    defense: 50,
    storageCapacity: 10000
  }
};
```

## Distance Metric

### Chebyshev Distance

Also known as chess king distance or L∞ metric.

```javascript
function chebyshevDistance(x1, y1, x2, y2) {
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

// Example:
// From (0, 0) to (3, 4) = max(3, 4) = 4
// Diagonal moves count as 1
```

**Used for**:
- Ship movement
- Weapon range
- Action range checks

## Galaxy Sizes

```javascript
const GALAXY_SIZES = {
  SMALL: { size: 11, range: [-5, 5] },
  MEDIUM: { size: 21, range: [-10, 10] },
  LARGE: { size: 31, range: [-15, 15] }
};
```

## Star Types

```javascript
const STAR_TYPES = [
  'blue_giant',
  'yellow_star',
  'red_dwarf',
  'white_dwarf',
  'binary_star'
];
```

Each star type affects planet distribution and resources.

## Planet Types

```javascript
const PLANET_TYPES = [
  'rocky',
  'gas_giant',
  'ice',
  'volcanic',
  'ocean',
  'desert',
  'forest'
];
```

Each type has different resource distributions.

## Examples

### Resource Checker

```javascript
// Check if ship has enough resources
function hasResources(ship, required) {
  for (const [resource, amount] of Object.entries(required)) {
    const available = ship.storage[resource] || 0;
    if (available < amount) {
      return false;
    }
  }
  return true;
}

// Usage
const shipCost = {
  iron_ore: 200,
  crystal: 100,
  deuterium: 50
};

if (hasResources(ship, shipCost)) {
  // Can build ship
}
```

### Component Checker

```javascript
// Check ship capabilities
function getCapabilities(ship) {
  const capabilities = {
    canMine: false,
    canBuild: false,
    canWarp: false,
    canFight: false,
    canRepair: false
  };
  
  for (const component of ship.components) {
    if (component === 'mining_laser') capabilities.canMine = true;
    if (component === 'construction_arm') capabilities.canBuild = true;
    if (component === 'warp_drive') capabilities.canWarp = true;
    if (component === 'repair_drone') capabilities.canRepair = true;
    if (component === 'missile_launcher' || component === 'laser_weapon') {
      capabilities.canFight = true;
    }
  }
  
  return capabilities;
}

// Usage
const caps = getCapabilities(ship);
if (caps.canMine) {
  ship.harvest(planet);
}
```

### Structure Type Filter

```javascript
// Get all structures of specific types
function getStructuresByTypes(types) {
  const structures = Game.getMyStructures();
  return structures.filter(s => types.includes(s.type));
}

// Usage
const production = getStructuresByTypes([
  'mining_facility',
  'factory',
  'component_factory',
  'energy_plant'
]);

console.log(`Production structures: ${production.length}`);
```

