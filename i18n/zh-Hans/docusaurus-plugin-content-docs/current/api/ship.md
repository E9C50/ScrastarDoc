# 飞船 API

飞船是 StarGame 中的主要单位。它们可以移动、采集资源、建造建筑、战斗等等。

## 获取飞船

### `Game.getMyShips()`

返回你所有飞船的数组。

```javascript
const myShips = Game.getMyShips();
console.log(`我有 ${myShips.length} 艘飞船`);
```

### `Game.getAllShips(galaxyId)`

返回指定星系中的所有飞船（包括敌方飞船）。

```javascript
const allShips = Game.getAllShips(ship.galaxyId);
```

### `Game.findHostileShips(galaxyId)`

仅返回星系中的敌方飞船。

```javascript
const enemies = Game.findHostileShips(ship.galaxyId);
```

## 飞船属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | `number` | 唯一飞船标识符 |
| `name` | `string` | 飞船名称 |
| `hp` | `number` | 当前生命值 |
| `maxHP` | `number` | 最大生命值 |
| `energy` | `number` | 当前能量 |
| `maxEnergy` | `number` | 最大能量容量 |
| `shield` | `number` | 当前护盾强度 |
| `maxShield` | `number` | 最大护盾容量 |
| `attack` | `number` | 攻击力 |
| `defense` | `number` | 防御等级 |
| `radiance` | `number` | 当前辐能（行动点数） |
| `maxRadiance` | `number` | 最大辐能 |
| `storage` | `object` | 资源仓库 |
| `storageCapacity` | `number` | 最大存储空间 |
| `components` | `array` | 已安装组件 |
| `galaxyId` | `number` | 当前星系 ID |
| `pos` | `Position` | 飞船位置（见 [位置 API](./position)） |

## 移动

### `ship.move(direction)`

朝一个方向移动一格。消耗 1 能量。

**方向**: `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"`, `"sw"`

```javascript
ship.move("n");  // 向北移动
ship.move("ne"); // 向东北移动
```

**返回值**: `boolean` - 成功/失败

### `ship.moveTo(target)`

向目标位置或对象移动。每移动一格消耗 1 能量。

```javascript
// 移动到坐标
ship.moveTo(10, 20);

// 移动到位置对象
ship.moveTo(planet.pos);

// 移动到另一个对象
ship.moveTo(targetShip.pos);
```

**返回值**: `boolean` - 成功/失败

## 资源采集

### `ship.harvest(target, [resourceType])`

从星球采集资源。需要 `mining_laser` 组件。

```javascript
// 采集第一个可用资源
ship.harvest(planet);

// 采集特定资源
ship.harvest(planet, 'iron_ore');
```

**参数**:
- `target`: 星球对象
- `resourceType` (可选): 要采集的资源

**返回值**: `boolean` - 成功/失败

**消耗**: 5 能量

:::tip 采矿效率
每个 `mining_laser` 组件增加 2 单位的采集速率。
:::

## 建造

### `ship.build(target, structureType)`

开始建造建筑。需要 `construction_arm` 组件。

```javascript
ship.build(planet, 'mining_facility');
```

**参数**:
- `target`: 星球或空间站对象
- `structureType`: 要建造的建筑类型

**返回值**: `boolean` - 成功/失败

### `ship.supplyConstruction(constructionSite, [resources])`

向建筑工地运送资源。

```javascript
// 运送所有需要的资源
ship.supplyConstruction(site);

// 运送特定资源
ship.supplyConstruction(site, {
  iron_ore: 50,
  crystal: 20
});
```

**返回值**: `boolean` - 成功/失败

### `ship.buildStation(name, x, y)`

在坐标处建造空间站。需要 `construction_arm` 组件。

```javascript
ship.buildStation("阿尔法空间站", 50, 50);
```

**消耗**:
- 50 能量
- 200 铁矿石
- 100 水晶
- 50 氘

**返回值**: `boolean` - 成功/失败

## 战斗

### `ship.attackTarget(targetId)`

使用基础武器攻击飞船或建筑。

```javascript
const enemy = Game.findHostileShips(ship.galaxyId)[0];
ship.attackTarget(enemy.id);
```

**消耗**: 10 能量
**射程**: 2 格（切比雪夫距离）

**返回值**: `boolean` - 成功/失败

### `ship.fireMissile(target)`

向目标发射导弹。需要 `missile_launcher` 组件。

```javascript
ship.fireMissile(enemyShip);
```

**特性**:
- 对护盾高伤害（150%）
- 对建筑额外伤害（125%）
- 有冷却时间
- 消耗仓库中的 1 枚导弹

**返回值**: `boolean` - 成功/失败

### `ship.fireLaser(target)`

向目标发射激光。需要 `laser_weapon` 组件。

```javascript
ship.fireLaser(enemyShip);
```

**特性**:
- 对护盾较低伤害（70%）
- 无冷却时间
- 基于能量的武器

**返回值**: `boolean` - 成功/失败

## 支援动作

### `ship.repair(targetId)`

修复友方飞船或建筑。需要 `repair_drone` 组件。

```javascript
ship.repair(damagedShip.id);
```

**消耗**: 15 能量
**治疗**: 50 HP

**返回值**: `boolean` - 成功/失败

### `ship.enableShield()`

激活飞船护盾。需要护盾发生器组件。

```javascript
ship.enableShield();
```

**返回值**: `boolean` - 成功/失败

### `ship.disableShield()`

关闭飞船护盾。

```javascript
ship.disableShield();
```

**返回值**: `boolean` - 成功/失败

## 资源管理

### `ship.transfer(target, resource, amount)`

向另一艘飞船或建筑传输资源。

```javascript
ship.transfer(otherShip, 'iron_ore', 100);
ship.transfer(structure, 'energy', 50);
```

**返回值**: `boolean` - 成功/失败

### `ship.withdraw(structure, resource, amount)`

从建筑的仓库中提取资源。

```javascript
ship.withdraw(warehouse, 'iron_ore', 200);
```

**返回值**: `boolean` - 成功/失败

### `ship.drop(resource, amount)`

丢弃资源（永久销毁）。

```javascript
ship.drop('iron_ore', 50);
```

**返回值**: `boolean` - 成功/失败

### `ship.getStorageUsed()`

获取当前已使用的存储空间。

```javascript
const used = ship.getStorageUsed();
console.log(`存储: ${used}/${ship.storageCapacity}`);
```

**返回值**: `number`

### `ship.getStorageAvailable()`

获取可用的存储空间。

```javascript
const available = ship.getStorageAvailable();
if (available >= 100) {
  ship.harvest(planet);
}
```

**返回值**: `number`

## 高级功能

### `ship.selfDestruct()`

立即摧毁飞船。

```javascript
if (ship.hp < 10 && enemies.length > 5) {
  ship.selfDestruct();
}
```

**返回值**: `boolean` - 始终为 true

:::danger 永久销毁
此操作不可逆！飞船及其货物将永远丢失。
:::

## 组件方法

根据安装的组件，还有其他方法可用。详见 [组件 API](./components)。

## 示例

### 基础采矿循环

```javascript
const myShips = Game.getMyShips();

for (const ship of myShips) {
  if (!ship.components.includes('mining_laser')) continue;
  
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const planets = galaxy.getPlanets();
  
  // 找到最近的有资源的星球
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
      // 如果仓库有空间则采矿
      if (ship.getStorageAvailable() >= 10) {
        ship.harvest(nearest, 'iron_ore');
      } else {
        // 找仓库卸货
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

### 战斗巡逻

```javascript
const myShips = Game.getMyShips();

for (const ship of myShips) {
  // 检查飞船是否有武器
  const hasMissiles = ship.components.includes('missile_launcher');
  const hasLaser = ship.components.includes('laser_weapon');
  
  if (!hasMissiles && !hasLaser) continue;
  
  // 寻找敌人
  const enemies = Game.findHostileShips(ship.galaxyId);
  
  if (enemies.length > 0) {
    const target = enemies[0];
    const dist = ship.pos.getDistance(target.pos);
    
    // 如果在射程内则攻击
    if (dist <= 2) {
      if (hasMissiles && ship.getMissileCooldown() === 0) {
        ship.fireMissile(target);
      } else if (hasLaser) {
        ship.fireLaser(target);
      }
    } else {
      // 靠近目标
      ship.moveTo(target.pos);
    }
  }
}
```

