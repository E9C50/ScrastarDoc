# Config API

The Config API provides access to game configuration and rules. Use it to query costs, stats, recipes, and game mechanics.

## Accessing Config

```javascript
const config = Game.Config;
```

## Structure Configuration

### `config.getStructureCost(structureType)`

Get the build cost of a structure.

```javascript
const cost = Game.Config.getStructureCost('mining_facility');
console.log(cost);
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

**Returns**: Object containing `energy`, `resources`, and `buildTime`

### `config.getStructureStats(structureType)`

Get structure statistics.

```javascript
const stats = Game.Config.getStructureStats('warehouse');
console.log(stats);
/*
{
  maxHP: 500,
  maxEnergy: 100,
  defense: 20,
  storageCapacity: 5000
}
*/
```

**Returns**: Object containing `maxHP`, `maxEnergy`, `defense`, `storageCapacity`

### `config.getStructureConfig(structureType)`

Get complete structure configuration.

```javascript
const config = Game.Config.getStructureConfig('factory');
console.log(config);
/*
{
  type: 'factory',
  buildCost: { energy: 30, resources: {...} },
  stats: { maxHP: 400, ... },
  buildTime: 15,
  upgradeable: true,
  upgradeCostBase: {...},
  capacityPerLevel: 100
}
*/
```

**Returns**: Complete configuration object

## Component Configuration

### `config.getComponentCost(componentType)`

Get component build cost.

```javascript
const cost = Game.Config.getComponentCost('mining_laser');
console.log(cost);
/*
{
  iron_ore: 50,
  crystal: 20
}
*/
```

**Returns**: Object containing resource costs

### `config.getComponentEffect(componentType)`

Get component effects and bonuses.

```javascript
const effect = Game.Config.getComponentEffect('warp_drive');
console.log(effect);
/*
{
  name: "Warp Drive",
  description: "Enables interstellar travel",
  energyBonus: 100,
  enableWarpJump: true,
  energyCostPerTick: 0
}
*/
```

**Returns**: Object containing:
- `name`: Component name
- `description`: Description
- `storageBonus`: Storage increase
- `energyBonus`: Energy capacity increase
- `attackBonus`: Attack power increase
- `defenseBonus`: Defense increase
- `shieldBonus`: Shield capacity increase
- `enableMining`: Enables mining
- `enableBuilding`: Enables building
- `enableWarpJump`: Enables jumpgate travel
- `enableCloaking`: Enables cloaking
- `enableRepair`: Enables repair
- `enableMissile`: Enables missiles
- `missileDamage`: Missile damage
- `missileRange`: Missile range
- `missileCooldown`: Missile cooldown
- `enableLaser`: Enables laser
- `laserDamage`: Laser damage
- `laserRange`: Laser range
- `laserEnergyCost`: Laser energy cost
- `energyCostPerTick`: Passive energy consumption

## Ship Configuration

### `config.getShipBuildCost()`

Get ship build cost.

```javascript
const cost = Game.Config.getShipBuildCost();
console.log(cost);
/*
{
  iron_ore: 200,
  crystal: 100,
  deuterium: 50
}
*/
```

**Returns**: Object containing resource costs

### `config.getShipBuildTime()`

Get ship build time (ticks).

```javascript
const time = Game.Config.getShipBuildTime();
console.log(`Ship takes ${time} ticks to build`);
```

**Returns**: `number`

### `config.getShipRepairAmount()`

Get HP restored per repair action.

```javascript
const amount = Game.Config.getShipRepairAmount();
console.log(`Repair restores ${amount} HP`);
```

**Returns**: `number`

## Production Recipes

### `config.getRecipes(structureType)`

Get all production recipes for a structure.

```javascript
const recipes = Game.Config.getRecipes('factory');

for (const recipe of recipes) {
  console.log(`Product: ${recipe.product}`);
  console.log(`Input:`, recipe.input);
  console.log(`Output:`, recipe.output);
  console.log(`Time: ${recipe.time} ticks`);
  console.log(`Energy: ${recipe.energy}`);
}
```

**Returns**: Array of recipe objects

### `config.getRecipeByOutput(structureType, outputResource)`

Get specific recipe by output resource.

```javascript
const recipe = Game.Config.getRecipeByOutput('factory', 'metal');

if (recipe) {
  console.log('Producing metal:');
  console.log('  Input:', recipe.input);
  console.log('  Output:', recipe.output);
  console.log('  Time:', recipe.time);
  console.log('  Energy:', recipe.energy);
}
```

**Returns**: Recipe object or `null`

## Harvesting Configuration

### `config.getHarvestRates(structureType)`

Get harvest rates for mining structures.

```javascript
const rates = Game.Config.getHarvestRates('mining_facility');
console.log('Harvest rates:', rates);
/*
{
  iron_ore: 5,
  crystal: 3,
  deuterium: 2
}
*/
```

**Returns**: Object containing resource types and rates

### `config.getHarvestEnergyCost()`

Get energy cost for harvesting.

```javascript
const cost = Game.Config.getHarvestEnergyCost();
console.log(`Harvesting costs ${cost} energy`);
```

**Returns**: `number`

## Combat Configuration

### `config.getTowerConfig()`

Get defense tower configuration.

```javascript
const tower = Game.Config.getTowerConfig();
console.log(tower);
/*
{
  attackPower: 60,
  attackRange: 3,
  attackEnergyCost: 20,
  healAmount: 30,
  healEnergyCost: 15,
  repairAmount: 50,
  repairEnergyCost: 20
}
*/
```

**Returns**: Object containing tower properties

### `config.getDamageFormula()`

Get damage calculation information.

```javascript
const formula = Game.Config.getDamageFormula();
console.log(formula.description);
// "Damage = Attack Power - Defense/2, minimum 1"

// Calculate damage
const damage = formula.calculate(attack, defense);
```

**Returns**: Object containing `description`, `calculate` function, and `example`

## Space Station Configuration

### `config.getSpaceStationCost()`

Get space station build cost.

```javascript
const cost = Game.Config.getSpaceStationCost();
console.log(cost);
/*
{
  energy: 50,
  resources: {
    iron_ore: 200,
    crystal: 100,
    deuterium: 50
  }
}
*/
```

**Returns**: Object containing `energy` and `resources`

### `config.getSpaceStationStats()`

Get space station statistics.

```javascript
const stats = Game.Config.getSpaceStationStats();
console.log(stats);
/*
{
  maxHP: 1000,
  maxEnergy: 500,
  defense: 50,
  storageCapacity: 10000
}
*/
```

**Returns**: Object containing space station properties

## Structure Types

All available structure types:

```javascript
const structures = [
  'mining_facility',
  'iron_extractor',
  'crystal_harvester',
  'deuterium_collector',
  'factory',
  'component_factory',
  'storage',
  'warehouse',
  'shipyard',
  'defense_tower',
  'shield_generator',
  'trade_terminal',
  'energy_plant',
  'lab'
];
```

## Component Types

All available component types:

```javascript
const components = [
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

## Resource Types

All available resource types:

```javascript
const resources = [
  'iron_ore',      // Raw iron
  'crystal',       // Raw crystal
  'deuterium',     // Fuel
  'metal',         // Refined iron
  'alloy',         // Advanced material
  'energy',        // Energy
  'missile'        // Ammunition
];
```

## Examples

### Build Cost Calculator

```javascript
// Calculate total cost for multiple structures
function calculateBuildingCosts(structures) {
  const totalCost = {
    energy: 0,
    resources: {}
  };
  
  for (const [structureType, count] of Object.entries(structures)) {
    const cost = Game.Config.getStructureCost(structureType);
    
    totalCost.energy += cost.energy * count;
    
    for (const [resource, amount] of Object.entries(cost.resources)) {
      if (!totalCost.resources[resource]) {
        totalCost.resources[resource] = 0;
      }
      totalCost.resources[resource] += amount * count;
    }
  }
  
  return totalCost;
}

// Usage
const plan = {
  'mining_facility': 3,
  'factory': 2,
  'warehouse': 1
};

const cost = calculateBuildingCosts(plan);
console.log('Total cost:', cost);
```

### Production Chain Analyzer

```javascript
// Analyze production chain for a resource
function analyzeProductionChain(targetResource, targetAmount) {
  const chain = [];
  let currentResource = targetResource;
  let currentAmount = targetAmount;
  
  // Find production recipe (simplified)
  const factoryRecipes = Game.Config.getRecipes('factory');
  
  for (const recipe of factoryRecipes) {
    if (recipe.output[currentResource]) {
      const productionPerCycle = recipe.output[currentResource];
      const cyclesNeeded = Math.ceil(currentAmount / productionPerCycle);
      
      chain.push({
        structure: 'factory',
        product: currentResource,
        cycles: cyclesNeeded,
        time: recipe.time * cyclesNeeded,
        energy: recipe.energy * cyclesNeeded,
        inputNeeded: {}
      });
      
      // Calculate input requirements
      for (const [input, inputAmount] of Object.entries(recipe.input)) {
        chain[chain.length - 1].inputNeeded[input] = inputAmount * cyclesNeeded;
      }
      
      break;
    }
  }
  
  return chain;
}

// Usage
const chain = analyzeProductionChain('metal', 100);
console.log('Production chain:', chain);
```

### Ship Design Optimizer

```javascript
// Find optimal component configuration within budget
function optimizeShipDesign(budget, role) {
  const designs = [];
  
  // Define role priorities
  const priorities = {
    Miner: ['mining_laser', 'storage', 'power_core'],
    Fighter: ['missile_launcher', 'laser_weapon', 'shield_generator', 'power_core'],
    Explorer: ['warp_drive', 'sensor_array', 'storage', 'power_core']
  };
  
  const components = priorities[role] || priorities.Miner;
  
  const design = {
    role: role,
    components: ['basic_engine'], // Always include
    totalCost: {},
    capabilities: {}
  };
  
  // Add components within budget
  for (const component of components) {
    const cost = Game.Config.getComponentCost(component);
    const effect = Game.Config.getComponentEffect(component);
    
    // Check affordability
    let affordable = true;
    for (const [resource, amount] of Object.entries(cost)) {
      const current = design.totalCost[resource] || 0;
      const budgetAmount = budget[resource] || 0;
      if (current + amount > budgetAmount) {
        affordable = false;
        break;
      }
    }
    
    if (affordable) {
      design.components.push(component);
      
      // Add to total cost
      for (const [resource, amount] of Object.entries(cost)) {
        if (!design.totalCost[resource]) {
          design.totalCost[resource] = 0;
        }
        design.totalCost[resource] += amount;
      }
      
      // Track capabilities
      if (effect.enableMining) design.capabilities.mining = true;
      if (effect.enableBuilding) design.capabilities.building = true;
      if (effect.enableWarpJump) design.capabilities.warpJump = true;
    }
  }
  
  return design;
}

// Usage
const budget = {
  iron_ore: 500,
  crystal: 300,
  deuterium: 100
};

const minerDesign = optimizeShipDesign(budget, 'Miner');
console.log('Optimized miner design:', minerDesign);
```

