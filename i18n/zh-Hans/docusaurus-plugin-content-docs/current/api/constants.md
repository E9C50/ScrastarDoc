# 常量与资源

此页面列出所有游戏常量、资源类型、建筑类型和组件类型。

## 资源类型

### 基础资源

```javascript
// 来自星球的原材料
const RAW_RESOURCES = {
  IRON_ORE: 'iron_ore',
  CRYSTAL: 'crystal',
  DEUTERIUM: 'deuterium'
};
```

| 资源 | 描述 | 来源 |
|------|------|------|
| `iron_ore` | 原铁矿石 | 星球、小行星 |
| `crystal` | 能量水晶 | 星球 |
| `deuterium` | 重氢燃料 | 星球、气态巨行星 |

### 精炼资源

```javascript
// 加工材料
const REFINED_RESOURCES = {
  METAL: 'metal',
  ALLOY: 'alloy'
};
```

| 资源 | 描述 | 生产 |
|------|------|------|
| `metal` | 精炼铁 | 工厂: 10 铁矿石 → 5 金属 |
| `alloy` | 高级合金 | 工厂: 5 水晶 + 5 金属 → 3 合金 |

### 特殊资源

```javascript
// 特殊物品
const SPECIAL_RESOURCES = {
  ENERGY: 'energy',
  MISSILE: 'missile'
};
```

| 资源 | 描述 | 生产 |
|------|------|------|
| `energy` | 能量 | 能源站、能量核心 |
| `missile` | 弹药 | 组件工厂 |

## 建筑类型

### 生产建筑

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

| 建筑 | 用途 | 生产 |
|------|------|------|
| `mining_facility` | 通用采矿 | 任何星球资源 |
| `iron_extractor` | 铁矿采集 | 仅铁矿石 |
| `crystal_harvester` | 水晶采集 | 仅水晶 |
| `deuterium_collector` | 氘收集 | 仅氘 |
| `factory` | 精炼 | 金属、合金等 |
| `component_factory` | 组件 | 飞船组件 |
| `energy_plant` | 发电 | 能量 |

### 存储建筑

```javascript
const STORAGE_STRUCTURES = {
  STORAGE: 'storage',
  WAREHOUSE: 'warehouse'
};
```

| 建筑 | 容量 | 描述 |
|------|------|------|
| `storage` | 2000 | 基础存储 |
| `warehouse` | 5000 | 大型仓库 |

### 军事建筑

```javascript
const MILITARY_STRUCTURES = {
  DEFENSE_TOWER: 'defense_tower',
  SHIELD_GENERATOR: 'shield_generator',
  SHIPYARD: 'shipyard'
};
```

| 建筑 | 用途 | 属性 |
|------|------|------|
| `defense_tower` | 自动防御 | 攻击: 60, 射程: 3 |
| `shield_generator` | 区域护盾 | 保护附近建筑 |
| `shipyard` | 飞船建造 | 建造飞船 |

### 特殊建筑

```javascript
const SPECIAL_STRUCTURES = {
  TRADE_TERMINAL: 'trade_terminal',
  LAB: 'lab'
};
```

| 建筑 | 用途 | 状态 |
|------|------|------|
| `trade_terminal` | 交易 | 未来功能 |
| `lab` | 研究 | 未来功能 |

## 组件类型

### 引擎组件

```javascript
const ENGINES = {
  BASIC_ENGINE: 'basic_engine',
  ADVANCED_ENGINE: 'advanced_engine',
  WARP_DRIVE: 'warp_drive'
};
```

| 组件 | 能量加成 | 特殊 |
|------|----------|------|
| `basic_engine` | 0 | 标准 |
| `advanced_engine` | +50 | 改进 |
| `warp_drive` | +100 | 星门旅行 |

### 资源组件

```javascript
const RESOURCE_COMPONENTS = {
  MINING_LASER: 'mining_laser',
  STORAGE: 'storage',
  RESOURCE_SCANNER: 'resource_scanner'
};
```

| 组件 | 加成 | 效果 |
|------|------|------|
| `mining_laser` | - | 每个 +2 采集速率 |
| `storage` | +500 容量 | 货舱空间 |
| `resource_scanner` | - | 远程扫描 |

### 建造组件

```javascript
const CONSTRUCTION_COMPONENTS = {
  CONSTRUCTION_ARM: 'construction_arm',
  REPAIR_DRONE: 'repair_drone'
};
```

| 组件 | 效果 |
|------|------|
| `construction_arm` | 建造建筑 |
| `repair_drone` | 修复飞船/建筑 |

### 战斗组件

```javascript
const COMBAT_COMPONENTS = {
  WEAPON_SYSTEM: 'weapon_system',
  TARGETING_SYSTEM: 'targeting_system',
  MISSILE_LAUNCHER: 'missile_launcher',
  LASER_WEAPON: 'laser_weapon'
};
```

| 组件 | 攻击加成 | 特殊 |
|------|----------|------|
| `weapon_system` | +30 | 通用战斗 |
| `targeting_system` | +20 | 精度 |
| `missile_launcher` | - | 导弹攻击 |
| `laser_weapon` | - | 激光攻击 |

### 防御组件

```javascript
const DEFENSE_COMPONENTS = {
  SHIELD_GENERATOR: 'shield_generator',
  ARMOR_PLATING: 'armor_plating'
};
```

| 组件 | 加成 | 效果 |
|------|------|------|
| `shield_generator` | +100 护盾 | 能量护盾 |
| `armor_plating` | +30 防御 | 伤害减免 |

### 实用组件

```javascript
const UTILITY_COMPONENTS = {
  POWER_CORE: 'power_core',
  SENSOR_ARRAY: 'sensor_array',
  CLOAKING_DEVICE: 'cloaking_device'
};
```

| 组件 | 加成 | 效果 |
|------|------|------|
| `power_core` | +200 能量 | 大容量 |
| `sensor_array` | - | 远程检测 |
| `cloaking_device` | - | 隐形 |

## 游戏机制常量

### 移动

```javascript
const MOVEMENT = {
  COST_PER_GRID: 1,        // 每格能量消耗
  DISTANCE_METRIC: 'chebyshev'  // 国际象棋王距离
};
```

### 战斗

```javascript
const COMBAT = {
  BASIC_ATTACK_RANGE: 2,
  BASIC_ATTACK_COST: 10,
  BASIC_ATTACK_DAMAGE: 'variable',  // 基于飞船攻击属性
  
  MISSILE_RANGE: 5,
  MISSILE_DAMAGE: 80,
  MISSILE_COOLDOWN: 3,
  MISSILE_SHIELD_MULTIPLIER: 1.5,
  MISSILE_STRUCTURE_MULTIPLIER: 1.25,
  
  LASER_RANGE: 4,
  LASER_DAMAGE: 50,
  LASER_COST: 25,
  LASER_SHIELD_MULTIPLIER: 0.7,
  
  DAMAGE_FORMULA: '攻击力 - 防御力/2，最小为1'
};
```

### 采集

```javascript
const HARVESTING = {
  COST: 5,                    // 能量消耗
  BASE_AMOUNT: 2,             // 基础采集量
  MINING_LASER_BONUS: 2,      // 每个激光
  REQUIRES_COMPONENT: 'mining_laser'
};
```

### 建造

```javascript
const CONSTRUCTION = {
  MIN_DISTANCE: 1,            // 必须相邻
  REQUIRES_COMPONENT: 'construction_arm',
  PROGRESS_PER_TICK: 'variable'  // 基于供应的资源
};
```

### 飞船建造

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

### 空间站

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

## 距离度量

### 切比雪夫距离

也称为国际象棋王距离或 L∞ 度量。

```javascript
function chebyshevDistance(x1, y1, x2, y2) {
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

// 示例:
// 从 (0, 0) 到 (3, 4) = max(3, 4) = 4
// 对角线移动算作 1
```

**用于**:
- 飞船移动
- 武器射程
- 行动范围检查

## 星系大小

```javascript
const GALAXY_SIZES = {
  SMALL: { size: 11, range: [-5, 5] },
  MEDIUM: { size: 21, range: [-10, 10] },
  LARGE: { size: 31, range: [-15, 15] }
};
```

## 恒星类型

```javascript
const STAR_TYPES = [
  'blue_giant',
  'yellow_star',
  'red_dwarf',
  'white_dwarf',
  'binary_star'
];
```

每种恒星类型影响星球分布和资源。

## 星球类型

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

每种类型有不同的资源分布。

## 示例

### 资源检查

```javascript
// 检查飞船是否有足够的资源
function hasResources(ship, required) {
  for (const [resource, amount] of Object.entries(required)) {
    const available = ship.storage[resource] || 0;
    if (available < amount) {
      return false;
    }
  }
  return true;
}

// 使用
const shipCost = {
  iron_ore: 200,
  crystal: 100,
  deuterium: 50
};

if (hasResources(ship, shipCost)) {
  // 可以建造飞船
}
```

### 组件检查器

```javascript
// 检查飞船能力
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

// 使用
const caps = getCapabilities(ship);
if (caps.canMine) {
  ship.harvest(planet);
}
```

### 建筑类型过滤器

```javascript
// 获取特定类型的所有建筑
function getStructuresByTypes(types) {
  const structures = Game.getMyStructures();
  return structures.filter(s => types.includes(s.type));
}

// 使用
const production = getStructuresByTypes([
  'mining_facility',
  'factory',
  'component_factory',
  'energy_plant'
]);

console.log(`生产建筑: ${production.length}`);
```

