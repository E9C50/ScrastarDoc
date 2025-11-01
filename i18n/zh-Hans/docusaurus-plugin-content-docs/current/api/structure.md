# 建筑 API

建筑是你在星球和空间站上建造的建筑物。它们生产资源、存储物资、建造飞船并防御你的领土。

## 获取建筑

### `Game.getMyStructures()`

返回你在所有星系中的所有建筑。

```javascript
const myStructures = Game.getMyStructures();
console.log(`总建筑数: ${myStructures.length}`);
```

### `Game.getAllStructures(galaxyId)`

返回指定星系中的所有建筑（包括敌方的）。

```javascript
const allStructures = Game.getAllStructures(ship.galaxyId);
```

### `Game.findHostileStructures(galaxyId)`

仅返回星系中的敌方建筑。

```javascript
const enemyBases = Game.findHostileStructures(ship.galaxyId);
```

## 建筑属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | `number` | 唯一建筑标识符 |
| `name` | `string` | 建筑名称 |
| `type` | `string` | 建筑类型 |
| `hp` | `number` | 当前生命值 |
| `maxHP` | `number` | 最大生命值 |
| `energy` | `number` | 当前能量 |
| `maxEnergy` | `number` | 最大能量容量 |
| `defense` | `number` | 防御等级 |
| `storage` | `object` | 资源仓库 |
| `storageCapacity` | `number` | 最大存储空间 |
| `level` | `number` | 建筑等级（可升级建筑） |
| `progress` | `number` | 建造进度（0-100） |
| `working` | `object` | 当前生产状态 |
| `ownerId` | `number` | 所有者玩家 ID |
| `galaxyId` | `number` | 星系 ID |
| `planetId` | `string` | 星球/空间站标识符 |
| `pos` | `Position` | 建筑位置 |

## 建造状态

### 建造中（`progress < 100`）

当建筑正在建造时：

```javascript
for (const structure of Game.getMyStructures()) {
  if (structure.progress < 100) {
    console.log(`${structure.name}: ${structure.progress}% 完成`);
    console.log('所需资源:', structure.requiredResources);
    console.log('剩余资源:', structure.remainingResources);
    console.log('建造时间:', structure.buildTime, 'ticks');
  }
}
```

**特殊属性**:
- `requiredResources` - 总共需要的资源
- `remainingResources` - 仍需要的资源
- `buildTime` - 总建造时间（ticks）

### 运营中（`progress === 100`）

完全建成的建筑可以生产资源并提供服务。

## 建筑类型

### 生产设施

#### 采矿设施
自动从星球提取资源。

```javascript
// 开始采矿作业
miningFacility.startWork('iron_ore');

// 检查生产
console.log('正在工作:', miningFacility.working);
```

#### 工厂
从原材料生产精炼材料。

```javascript
// 从铁矿石生产金属
factory.startWork('metal');
```

#### 组件工厂
制造飞船组件。

```javascript
// 建造采矿激光
componentFactory.startWork('mining_laser');
```

#### 能源站
为其他建筑生成能量。

```javascript
// 能源站自动工作
console.log('能量生产:', energyPlant.working);
```

### 存储

#### 仓库
存储大量资源。

```javascript
// 检查存储
console.log('已存储:', warehouse.storage);
console.log('容量:', warehouse.storageCapacity);

// 提取资源
ship.withdraw(warehouse, 'iron_ore', 100);
```

#### 储存设施
基础资源存储。

### 军事

#### 防御塔
自动攻击范围内的敌方飞船。

```javascript
// 防御塔自动工作
// 它们攻击范围内最近的敌人
```

**属性**:
- 攻击力: 60
- 射程: 3 格
- 能量消耗: 每次攻击 20

#### 护盾发生器
保护同一星球上的建筑。

```javascript
// 护盾发生器自动工作
// 它们为附近的友方建筑提供护盾
```

### 特殊

#### 船坞
建造新飞船。

```javascript
// 开始建造飞船
shipyard.buildShip('探索者-1', ['mining_laser', 'storage']);
```

#### 贸易站
与其他玩家交易资源（未来功能）。

#### 实验室
研究新技术（未来功能）。

## 建筑方法

### `structure.getLocation()`

获取此建筑所在的星球或空间站。

```javascript
const location = structure.getLocation();
console.log(`建筑位于: ${location.name}`);
console.log(`位置: (${location.pos.x}, ${location.pos.y})`);
```

**返回值**: Planet 或 SpaceStation 对象

### 生产方法

这些方法在生产建筑上可用：

#### `structure.startWork(product)`

开始生产产品（如果建筑支持）。

```javascript
// 检查可用配方
const recipes = Game.Config.getRecipes(structure.type);

// 开始生产
if (structure.type === 'factory') {
  structure.startWork('metal');
}
```

**参数**:
- `product`: 要生产的资源或物品

**返回值**: `boolean` - 成功/失败

:::info 生产要求
建筑需要：
- 仓库中有足够的输入资源
- 可用能量
- 该建筑类型的正确配方
:::

### 船坞方法

#### `shipyard.buildShip(name, components)`

建造带有指定组件的新飞船。

```javascript
shipyard.buildShip('矿工-1', [
  'mining_laser',
  'mining_laser',
  'storage',
  'basic_engine'
]);
```

**参数**:
- `name`: 飞船名称
- `components`: 组件类型数组

**返回值**: `boolean` - 成功/失败

## 建造建筑

带有 `construction_arm` 的飞船可以建造建筑：

```javascript
// 开始建造
ship.build(planet, 'mining_facility');

// 向建筑工地供应资源
const sites = Game.getMyStructures()
  .filter(s => s.progress < 100);

for (const site of sites) {
  if (ship.pos.isNear(site.pos)) {
    ship.supplyConstruction(site);
  }
}
```

## 建筑成本

使用 Config API 查询建造成本：

```javascript
const cost = Game.Config.getStructureCost('mining_facility');
console.log('建造成本:', cost);
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

详见 [配置 API](./config)。

## 示例

### 自动生产管理器

```javascript
// 管理所有生产设施
function manageProduction() {
  const factories = Game.getMyStructures()
    .filter(s => s.type === 'factory' && s.progress === 100);
  
  for (const factory of factories) {
    // 检查是否在工作
    if (!factory.working || !factory.working.product) {
      // 检查可用资源
      const ironOre = factory.storage.iron_ore || 0;
      const crystal = factory.storage.crystal || 0;
      
      // 根据可用资源开始生产
      if (ironOre >= 10) {
        factory.startWork('metal');
      } else if (crystal >= 10) {
        factory.startWork('alloy');
      }
    }
  }
}

// 每个 tick 运行
manageProduction();
```

### 建造队列

```javascript
// 供应所有建筑工地
function supplyConstruction() {
  const sites = Game.getMyStructures()
    .filter(s => s.progress < 100);
  
  const myShips = Game.getMyShips()
    .filter(s => s.components.includes('construction_arm'));
  
  for (const site of sites) {
    // 找到最近的有资源的飞船
    let bestShip = null;
    let minDist = Infinity;
    
    for (const ship of myShips) {
      const dist = ship.pos.getDistance(site.pos);
      const hasResources = Object.keys(site.remainingResources)
        .some(r => ship.storage[r] > 0);
      
      if (hasResources && dist < minDist) {
        bestShip = ship;
        minDist = dist;
      }
    }
    
    if (bestShip) {
      if (bestShip.pos.isNear(site.pos)) {
        bestShip.supplyConstruction(site);
      } else {
        bestShip.moveTo(site.pos);
      }
    }
  }
}

supplyConstruction();
```

### 防御网络

```javascript
// 获取所有防御塔及其覆盖范围
function getDefenseNetwork(galaxyId) {
  const towers = Game.getMyStructures()
    .filter(s => s.type === 'defense_tower' && s.galaxyId === galaxyId);
  
  const network = {
    towers: towers.length,
    coverage: []
  };
  
  for (const tower of towers) {
    network.coverage.push({
      pos: { x: tower.pos.x, y: tower.pos.y },
      range: 3,
      attack: 60
    });
  }
  
  return network;
}

const defense = getDefenseNetwork(ship.galaxyId);
console.log('防御网络:', defense);
```

