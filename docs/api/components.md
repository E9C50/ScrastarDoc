# Components API

Components are upgrades installed on ships that provide additional capabilities, enhance attributes, or enable special actions.

## Component Types

### Engine Components

#### Basic Engine
Standard propulsion system.
- Equipped on all ships by default
- No special bonuses

#### Advanced Engine
- **Energy Bonus**: +50
- Increases ship energy capacity

#### Warp Drive
- **Energy Bonus**: +100
- **Enables Warp Jump**: Allows travel through jumpgates
- Required for interstellar travel

### Resource Components

#### Mining Laser
- **Enables Mining**: Allows resource harvesting
- Each laser increases harvesting rate by 2 units
- Multiple lasers stack

```javascript
// Check mining capability
const lasers = ship.components.filter(c => c === 'mining_laser').length;
console.log(`Mining rate: ${lasers * 2} units per action`);
```

#### Storage Module
- **Storage Bonus**: +500
- Increases ship cargo capacity
- Multiple storage modules stack

#### Resource Scanner
- **Scan Range**: 10 grids
- Provides detailed resource information
- Enables remote planet analysis

### Construction Components

#### Construction Arm
- **Enables Building**: Allows building structures
- Required for building structures and space stations
- No energy cost

#### Repair Drone
- **Enables Repair**: Can repair ships and structures
- Repair amount per action: 50 HP
- Energy cost: 15 per repair

### Combat Components

#### Weapon System
- **Attack Bonus**: +30
- Increases base attack power
- Affects all weapon types

#### Targeting System
- **Attack Bonus**: +20
- Improves weapon accuracy and damage

#### Missile Launcher
- **Enables Missiles**: Allows missile attacks
- Missile damage: 80
- Missile range: 5 grids
- Cooldown: 3 ticks
- Requires missiles in storage

#### Laser Weapon
- **Enables Laser**: Allows laser attacks
- Laser damage: 50
- Laser range: 4 grids
- Energy cost: 25 per shot
- No cooldown

### Defense Components

#### Shield Generator
- **Shield Bonus**: +100
- Provides energy shields
- Shield cost: 5 energy to activate

#### Armor Plating
- **Defense Bonus**: +30
- Increases damage resistance
- Passive defense

### Utility Components

#### Power Core
- **Energy Bonus**: +200
- Significantly increases energy capacity
- Recommended for combat ships

#### Sensor Array
- **Scan Range**: 15 grids
- Long-range detection
- Reveals cloaked ships (future feature)

#### Cloaking Device
- **Enables Cloaking**: Makes ship invisible
- Energy cost: 10 per tick
- Cannot attack while cloaked

## Checking Components

### `ship.components`

Array of installed component types.

```javascript
console.log('Installed components:', ship.components);

// Check for specific component
if (ship.components.includes('mining_laser')) {
  console.log('Ship can mine');
}

// Count components
const laserCount = ship.components.filter(c => c === 'mining_laser').length;
console.log(`Mining lasers: ${laserCount}`);
```

## Component Configuration

Use Config API to query component details:

```javascript
// Get component cost
const cost = Game.Config.getComponentCost('mining_laser');
console.log('Cost:', cost);

// Get component effects
const effect = Game.Config.getComponentEffect('mining_laser');
console.log('Effect:', effect);
/*
{
  name: "Mining Laser",
  description: "Extract resources from planets",
  enableMining: true,
  energyCostPerTick: 0
}
*/
```

## Building Components

Components are built in component factories:

```javascript
// Find component factories
const factories = Game.getMyStructures()
  .filter(s => s.type === 'component_factory' && s.progress === 100);

if (factories.length > 0) {
  const factory = factories[0];
  
  // Start building component
  factory.startWork('mining_laser');
}
```

## Adding Components to Ships

Add components when building ships:

```javascript
// Build ship with specific components
const shipyard = Game.getMyStructures()
  .find(s => s.type === 'shipyard');

if (shipyard) {
  shipyard.buildShip('Miner-1', [
    'basic_engine',
    'mining_laser',
    'mining_laser',  // Multiple lasers
    'storage',
    'power_core'
  ]);
}
```

## Component Strategies

### Miner Ship
Optimized for resource gathering:

```javascript
const minerComponents = [
  'basic_engine',
  'mining_laser',
  'mining_laser',
  'mining_laser',  // 3 lasers = 6 units per harvest
  'storage',
  'storage',       // High cargo capacity
  'power_core'     // Enough energy for operations
];
```

### Combat Ship
Optimized for combat:

```javascript
const fighterComponents = [
  'advanced_engine',
  'missile_launcher',
  'laser_weapon',
  'weapon_system',
  'targeting_system',
  'shield_generator',
  'armor_plating',
  'power_core'
];
```

### Scout Ship
Optimized for exploration:

```javascript
const scoutComponents = [
  'advanced_engine',
  'warp_drive',       // Can use jumpgates
  'sensor_array',     // Long-range scanning
  'storage',          // Carry supplies
  'shield_generator', // Survive threats
  'power_core'
];
```

### Constructor Ship
Optimized for building:

```javascript
const builderComponents = [
  'basic_engine',
  'construction_arm',
  'repair_drone',
  'storage',
  'storage',
  'storage',          // High capacity for materials
  'power_core'
];
```

### Multi-Role Ship
Balanced capabilities:

```javascript
const multiRoleComponents = [
  'advanced_engine',
  'mining_laser',
  'construction_arm',
  'laser_weapon',
  'storage',
  'shield_generator',
  'power_core'
];
```

## Advanced Examples

### Component Analyzer

```javascript
// Analyze ship components
function analyzeShip(ship) {
  const analysis = {
    mining: false,
    combat: false,
    building: false,
    exploration: false,
    laserCount: 0,
    storageBonus: 0,
    energyBonus: 0,
    attackBonus: 0,
    defenseBonus: 0,
    shieldBonus: 0
  };
  
  for (const component of ship.components) {
    const effect = Game.Config.getComponentEffect(component);
    
    // Capabilities
    if (effect.enableMining) analysis.mining = true;
    if (effect.enableMissile || effect.enableLaser) analysis.combat = true;
    if (effect.enableBuilding) analysis.building = true;
    if (effect.enableWarpJump) analysis.exploration = true;
    
    // Count special components
    if (component === 'mining_laser') analysis.laserCount++;
    
    // Sum bonuses
    analysis.storageBonus += effect.storageBonus || 0;
    analysis.energyBonus += effect.energyBonus || 0;
    analysis.attackBonus += effect.attackBonus || 0;
    analysis.defenseBonus += effect.defenseBonus || 0;
    analysis.shieldBonus += effect.shieldBonus || 0;
  }
  
  // Determine role
  analysis.role = 'Utility';
  if (analysis.laserCount >= 2) analysis.role = 'Miner';
  if (analysis.combat && analysis.attackBonus >= 40) analysis.role = 'Fighter';
  if (analysis.building && analysis.storageBonus >= 500) analysis.role = 'Builder';
  if (analysis.exploration) analysis.role = 'Explorer';
  
  return analysis;
}

// Usage
const myShips = Game.getMyShips();
for (const ship of myShips) {
  const analysis = analyzeShip(ship);
  console.log(`${ship.name}: ${analysis.role}`);
  console.log(`  Mining: ${analysis.laserCount} lasers`);
  console.log(`  Storage: +${analysis.storageBonus}`);
  console.log(`  Energy: +${analysis.energyBonus}`);
}
```

### Fleet Composition

```javascript
// Analyze fleet composition
function analyzeFleet() {
  const fleet = Game.getMyShips();
  
  const composition = {
    total: fleet.length,
    miners: 0,
    fighters: 0,
    constructors: 0,
    explorers: 0,
    utility: 0
  };
  
  for (const ship of fleet) {
    const analysis = analyzeShip(ship);
    composition[analysis.role.toLowerCase() + 's']++;
  }
  
  console.log('Fleet composition:');
  console.log(`  Total: ${composition.total}`);
  console.log(`  Miners: ${composition.miners}`);
  console.log(`  Fighters: ${composition.fighters}`);
  console.log(`  Constructors: ${composition.constructors}`);
  console.log(`  Explorers: ${composition.explorers}`);
  console.log(`  Utility: ${composition.utility}`);
  
  return composition;
}

analyzeFleet();
```

## Component Constants

All component types:

```javascript
const COMPONENTS = [
  // Engines
  'basic_engine',
  'advanced_engine',
  'warp_drive',
  
  // Resources
  'mining_laser',
  'storage',
  'resource_scanner',
  
  // Construction
  'construction_arm',
  'repair_drone',
  
  // Combat
  'weapon_system',
  'targeting_system',
  'missile_launcher',
  'laser_weapon',
  
  // Defense
  'shield_generator',
  'armor_plating',
  
  // Utility
  'power_core',
  'sensor_array',
  'cloaking_device'
];
```

