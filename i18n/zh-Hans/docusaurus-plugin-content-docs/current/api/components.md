# 组件 API

组件是安装在飞船上的升级装置，提供额外能力、增强属性或启用特殊动作。

## 组件类型

### 引擎组件

#### 基础引擎
标准推进系统。
- 所有飞船默认安装
- 无特殊加成

#### 高级引擎
- **能量加成**: +50
- 增加飞船的能量容量

#### 曲速引擎
- **能量加成**: +100
- **启用曲速跳跃**: 允许通过星门旅行
- 星际旅行必需

### 资源组件

#### 采矿激光
- **启用采矿**: 允许资源采集
- 每个激光增加 2 单位的采集速率
- 多个激光可叠加

```javascript
// 检查采矿能力
const lasers = ship.components.filter(c => c === 'mining_laser').length;
console.log(`采矿速率: 每次行动 ${lasers * 2} 单位`);
```

#### 储存舱
- **储存加成**: +500
- 增加飞船货舱容量
- 多个储存舱可叠加

#### 资源扫描仪
- **扫描范围**: 10 格
- 提供详细的资源信息
- 启用远程星球分析

### 建造组件

#### 建造臂
- **启用建造**: 允许建造建筑
- 建造建筑和空间站所需
- 无能量消耗

#### 维修无人机
- **启用维修**: 可修复飞船和建筑
- 每次行动修复量: 50 HP
- 能量消耗: 每次修复 15

### 战斗组件

#### 武器系统
- **攻击加成**: +30
- 增加基础攻击力
- 影响所有武器类型

#### 瞄准系统
- **攻击加成**: +20
- 提高武器精度和伤害

#### 导弹发射器
- **启用导弹**: 允许导弹攻击
- 导弹伤害: 80
- 导弹射程: 5 格
- 冷却时间: 3 ticks
- 需要仓库中的导弹

#### 激光武器
- **启用激光**: 允许激光攻击
- 激光伤害: 50
- 激光射程: 4 格
- 能量消耗: 每次射击 25
- 无冷却时间

### 防御组件

#### 护盾发生器
- **护盾加成**: +100
- 提供能量护盾
- 护盾消耗: 激活需要 5 能量

#### 装甲板
- **防御加成**: +30
- 增加伤害抗性
- 被动防御

### 实用组件

#### 能量核心
- **能量加成**: +200
- 显著增加能量容量
- 推荐用于战斗飞船

#### 传感器阵列
- **扫描范围**: 15 格
- 远距离检测
- 揭示隐形飞船（未来功能）

#### 隐形装置
- **启用隐形**: 使飞船不可见
- 能量消耗: 每 tick 10
- 隐形时无法攻击

## 检查组件

### `ship.components`

已安装组件类型的数组。

```javascript
console.log('已安装的组件:', ship.components);

// 检查特定组件
if (ship.components.includes('mining_laser')) {
  console.log('飞船可以采矿');
}

// 计算组件数量
const laserCount = ship.components.filter(c => c === 'mining_laser').length;
console.log(`采矿激光: ${laserCount}`);
```

## 组件配置

使用 Config API 查询组件详情：

```javascript
// 获取组件成本
const cost = Game.Config.getComponentCost('mining_laser');
console.log('成本:', cost);

// 获取组件效果
const effect = Game.Config.getComponentEffect('mining_laser');
console.log('效果:', effect);
/*
{
  name: "采矿激光",
  description: "从星球提取资源",
  enableMining: true,
  energyCostPerTick: 0
}
*/
```

## 建造组件

组件在组件工厂中建造：

```javascript
// 查找组件工厂
const factories = Game.getMyStructures()
  .filter(s => s.type === 'component_factory' && s.progress === 100);

if (factories.length > 0) {
  const factory = factories[0];
  
  // 开始建造组件
  factory.startWork('mining_laser');
}
```

## 为飞船添加组件

建造飞船时添加组件：

```javascript
// 建造带有特定组件的飞船
const shipyard = Game.getMyStructures()
  .find(s => s.type === 'shipyard');

if (shipyard) {
  shipyard.buildShip('矿工-1', [
    'basic_engine',
    'mining_laser',
    'mining_laser',  // 多个激光
    'storage',
    'power_core'
  ]);
}
```

## 组件策略

### 矿工飞船
针对资源采集优化：

```javascript
const minerComponents = [
  'basic_engine',
  'mining_laser',
  'mining_laser',
  'mining_laser',  // 3 个激光 = 每次采集 6 单位
  'storage',
  'storage',       // 高货舱容量
  'power_core'     // 足够的能量进行操作
];
```

### 战斗飞船
针对战斗优化：

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

### 侦察飞船
针对探索优化：

```javascript
const scoutComponents = [
  'advanced_engine',
  'warp_drive',       // 可使用星门
  'sensor_array',     // 远程扫描
  'storage',          // 携带补给
  'shield_generator', // 生存威胁
  'power_core'
];
```

### 建造飞船
针对建造优化：

```javascript
const builderComponents = [
  'basic_engine',
  'construction_arm',
  'repair_drone',
  'storage',
  'storage',
  'storage',          // 高容量存储材料
  'power_core'
];
```

### 多功能飞船
平衡能力：

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

## 高级示例

### 组件分析器

```javascript
// 分析飞船组件
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
    
    // 能力
    if (effect.enableMining) analysis.mining = true;
    if (effect.enableMissile || effect.enableLaser) analysis.combat = true;
    if (effect.enableBuilding) analysis.building = true;
    if (effect.enableWarpJump) analysis.exploration = true;
    
    // 计算特殊组件
    if (component === 'mining_laser') analysis.laserCount++;
    
    // 汇总加成
    analysis.storageBonus += effect.storageBonus || 0;
    analysis.energyBonus += effect.energyBonus || 0;
    analysis.attackBonus += effect.attackBonus || 0;
    analysis.defenseBonus += effect.defenseBonus || 0;
    analysis.shieldBonus += effect.shieldBonus || 0;
  }
  
  // 确定角色
  analysis.role = '实用';
  if (analysis.laserCount >= 2) analysis.role = '矿工';
  if (analysis.combat && analysis.attackBonus >= 40) analysis.role = '战斗机';
  if (analysis.building && analysis.storageBonus >= 500) analysis.role = '建造者';
  if (analysis.exploration) analysis.role = '探索者';
  
  return analysis;
}

// 使用
const myShips = Game.getMyShips();
for (const ship of myShips) {
  const analysis = analyzeShip(ship);
  console.log(`${ship.name}: ${analysis.role}`);
  console.log(`  采矿: ${analysis.laserCount} 个激光`);
  console.log(`  储存: +${analysis.storageBonus}`);
  console.log(`  能量: +${analysis.energyBonus}`);
}
```

### 舰队组成

```javascript
// 分析舰队组成
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
    composition[analysis.role + 's']++;
  }
  
  console.log('舰队组成:');
  console.log(`  总计: ${composition.total}`);
  console.log(`  矿工: ${composition.miners}`);
  console.log(`  战斗机: ${composition.fighters}`);
  console.log(`  建造者: ${composition.constructors}`);
  console.log(`  探索者: ${composition.explorers}`);
  console.log(`  实用: ${composition.utility}`);
  
  return composition;
}

analyzeFleet();
```

### 推荐组件配置

```javascript
// 获取角色的推荐组件
function getRecommendedLoadout(role) {
  const loadouts = {
    矿工: [
      'basic_engine',
      'mining_laser',
      'mining_laser',
      'mining_laser',
      'storage',
      'storage',
      'power_core'
    ],
    
    战斗机: [
      'advanced_engine',
      'missile_launcher',
      'laser_weapon',
      'weapon_system',
      'targeting_system',
      'shield_generator',
      'armor_plating',
      'power_core'
    ],
    
    建造者: [
      'basic_engine',
      'construction_arm',
      'repair_drone',
      'storage',
      'storage',
      'storage',
      'power_core'
    ],
    
    探索者: [
      'advanced_engine',
      'warp_drive',
      'sensor_array',
      'storage',
      'shield_generator',
      'laser_weapon',
      'power_core'
    ],
    
    运输: [
      'advanced_engine',
      'storage',
      'storage',
      'storage',
      'storage',
      'shield_generator',
      'armor_plating',
      'power_core'
    ]
  };
  
  return loadouts[role] || loadouts.矿工;
}

// 使用
const loadout = getRecommendedLoadout('战斗机');
console.log('战斗机配置:', loadout);
```

## 组件常量

所有组件类型：

```javascript
const COMPONENTS = [
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

