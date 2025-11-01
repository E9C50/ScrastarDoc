# 配置 API

配置 API 提供对游戏配置和规则的访问。使用它来查询成本、属性、配方和游戏机制。

## 访问配置

```javascript
const config = Game.Config;
```

## 建筑配置

### `config.getStructureCost(structureType)`

获取建筑的建造成本。

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

**返回值**: 包含 `energy`、`resources` 和 `buildTime` 的对象

### `config.getStructureStats(structureType)`

获取建筑统计数据。

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

**返回值**: 包含 `maxHP`、`maxEnergy`、`defense`、`storageCapacity` 的对象

### `config.getStructureConfig(structureType)`

获取完整的建筑配置。

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

**返回值**: 完整的配置对象

## 组件配置

### `config.getComponentCost(componentType)`

获取组件建造成本。

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

**返回值**: 包含资源成本的对象

### `config.getComponentEffect(componentType)`

获取组件效果和加成。

```javascript
const effect = Game.Config.getComponentEffect('warp_drive');
console.log(effect);
/*
{
  name: "曲速引擎",
  description: "启用星际旅行",
  energyBonus: 100,
  enableWarpJump: true,
  energyCostPerTick: 0
}
*/
```

**返回值**: 包含以下内容的对象：
- `name`: 组件名称
- `description`: 描述
- `storageBonus`: 储存增加
- `energyBonus`: 能量容量增加
- `attackBonus`: 攻击力增加
- `defenseBonus`: 防御增加
- `shieldBonus`: 护盾容量增加
- `enableMining`: 启用采矿
- `enableBuilding`: 启用建造
- `enableWarpJump`: 启用星门旅行
- `enableCloaking`: 启用隐形
- `enableRepair`: 启用修复
- `enableMissile`: 启用导弹
- `missileDamage`: 导弹伤害
- `missileRange`: 导弹射程
- `missileCooldown`: 导弹冷却
- `enableLaser`: 启用激光
- `laserDamage`: 激光伤害
- `laserRange`: 激光射程
- `laserEnergyCost`: 激光能量消耗
- `energyCostPerTick`: 被动能量消耗

## 飞船配置

### `config.getShipBuildCost()`

获取飞船建造成本。

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

**返回值**: 包含资源成本的对象

### `config.getShipBuildTime()`

获取飞船建造时间（ticks）。

```javascript
const time = Game.Config.getShipBuildTime();
console.log(`飞船需要 ${time} ticks 建造`);
```

**返回值**: `number`

### `config.getShipRepairAmount()`

获取每次修复恢复的生命值。

```javascript
const amount = Game.Config.getShipRepairAmount();
console.log(`修复恢复 ${amount} HP`);
```

**返回值**: `number`

## 生产配方

### `config.getRecipes(structureType)`

获取建筑的所有生产配方。

```javascript
const recipes = Game.Config.getRecipes('factory');

for (const recipe of recipes) {
  console.log(`产品: ${recipe.product}`);
  console.log(`输入:`, recipe.input);
  console.log(`输出:`, recipe.output);
  console.log(`时间: ${recipe.time} ticks`);
  console.log(`能量: ${recipe.energy}`);
}
```

**返回值**: 配方对象数组

### `config.getRecipeByOutput(structureType, outputResource)`

根据输出资源获取特定配方。

```javascript
const recipe = Game.Config.getRecipeByOutput('factory', 'metal');

if (recipe) {
  console.log('生产金属:');
  console.log('  输入:', recipe.input);
  console.log('  输出:', recipe.output);
  console.log('  时间:', recipe.time);
  console.log('  能量:', recipe.energy);
}
```

**返回值**: 配方对象或 `null`

## 采集配置

### `config.getHarvestRates(structureType)`

获取采矿建筑的采集速率。

```javascript
const rates = Game.Config.getHarvestRates('mining_facility');
console.log('采集速率:', rates);
/*
{
  iron_ore: 5,
  crystal: 3,
  deuterium: 2
}
*/
```

**返回值**: 包含资源类型和速率的对象

### `config.getHarvestEnergyCost()`

获取采集的能量消耗。

```javascript
const cost = Game.Config.getHarvestEnergyCost();
console.log(`采集消耗 ${cost} 能量`);
```

**返回值**: `number`

## 战斗配置

### `config.getTowerConfig()`

获取防御塔配置。

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

**返回值**: 包含塔属性的对象

### `config.getDamageFormula()`

获取伤害计算信息。

```javascript
const formula = Game.Config.getDamageFormula();
console.log(formula.description);
// "伤害 = 攻击力 - 防御力/2，最小为1"

// 计算伤害
const damage = formula.calculate(attack, defense);
```

**返回值**: 包含 `description`、`calculate` 函数和 `example` 的对象

## 空间站配置

### `config.getSpaceStationCost()`

获取空间站建造成本。

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

**返回值**: 包含 `energy` 和 `resources` 的对象

### `config.getSpaceStationStats()`

获取空间站统计数据。

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

**返回值**: 包含空间站属性的对象

## 建筑类型

所有可用的建筑类型：

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

## 组件类型

所有可用的组件类型：

```javascript
const components = [
  // 引擎
  'basic_engine',
  'advanced_engine',
  'warp_drive',
  
  // 资源
  'mining_laser',
  'storage',
  'resource_scanner',
  
  // 建造
  'construction_arm',
  'repair_drone',
  
  // 战斗
  'weapon_system',
  'targeting_system',
  'missile_launcher',
  'laser_weapon',
  
  // 防御
  'shield_generator',
  'armor_plating',
  
  // 实用
  'power_core',
  'sensor_array',
  'cloaking_device'
];
```

## 资源类型

所有可用的资源类型：

```javascript
const resources = [
  'iron_ore',      // 原铁
  'crystal',       // 原水晶
  'deuterium',     // 燃料
  'metal',         // 精炼铁
  'alloy',         // 高级材料
  'energy',        // 能量
  'missile'        // 弹药
];
```

## 示例

### 建造成本计算器

```javascript
// 计算多个建筑的总成本
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

// 使用
const plan = {
  'mining_facility': 3,
  'factory': 2,
  'warehouse': 1
};

const cost = calculateBuildingCosts(plan);
console.log('总成本:', cost);
```

### 生产链分析器

```javascript
// 分析资源的生产链
function analyzeProductionChain(targetResource, targetAmount) {
  const chain = [];
  let currentResource = targetResource;
  let currentAmount = targetAmount;
  
  // 查找生产配方（简化）
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
      
      // 计算输入需求
      for (const [input, inputAmount] of Object.entries(recipe.input)) {
        chain[chain.length - 1].inputNeeded[input] = inputAmount * cyclesNeeded;
      }
      
      break;
    }
  }
  
  return chain;
}

// 使用
const chain = analyzeProductionChain('metal', 100);
console.log('生产链:', chain);
```

### 飞船设计优化器

```javascript
// 在预算内找到最优组件配置
function optimizeShipDesign(budget, role) {
  const designs = [];
  
  // 定义角色优先级
  const priorities = {
    矿工: ['mining_laser', 'storage', 'power_core'],
    战斗机: ['missile_launcher', 'laser_weapon', 'shield_generator', 'power_core'],
    探索者: ['warp_drive', 'sensor_array', 'storage', 'power_core']
  };
  
  const components = priorities[role] || priorities.矿工;
  
  const design = {
    role: role,
    components: ['basic_engine'], // 始终包含
    totalCost: {},
    capabilities: {}
  };
  
  // 在预算内添加组件
  for (const component of components) {
    const cost = Game.Config.getComponentCost(component);
    const effect = Game.Config.getComponentEffect(component);
    
    // 检查是否负担得起
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
      
      // 添加到总成本
      for (const [resource, amount] of Object.entries(cost)) {
        if (!design.totalCost[resource]) {
          design.totalCost[resource] = 0;
        }
        design.totalCost[resource] += amount;
      }
      
      // 跟踪能力
      if (effect.enableMining) design.capabilities.mining = true;
      if (effect.enableBuilding) design.capabilities.building = true;
      if (effect.enableWarpJump) design.capabilities.warpJump = true;
    }
  }
  
  return design;
}

// 使用
const budget = {
  iron_ore: 500,
  crystal: 300,
  deuterium: 100
};

const minerDesign = optimizeShipDesign(budget, '矿工');
console.log('优化的矿工设计:', minerDesign);
```

