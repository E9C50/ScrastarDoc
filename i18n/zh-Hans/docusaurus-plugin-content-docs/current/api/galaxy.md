# 星系 API

星系是包含星球、星门、飞船和建筑的恒星系统。它们是游戏对象的主要容器。

## 获取星系

### `Game.getGalaxy(galaxyId)`

通过 ID 获取星系对象。

```javascript
const galaxy = Game.getGalaxy(12345);
console.log(`星系: ${galaxy.name}`);
```

### `Game.getVisibleGalaxies()`

获取你有存在（飞船或建筑）的所有星系的 ID。

```javascript
const myGalaxies = Game.getVisibleGalaxies();
console.log(`我在 ${myGalaxies.length} 个星系有存在`);

for (const galaxyId of myGalaxies) {
  const galaxy = Game.getGalaxy(galaxyId);
  console.log(`- ${galaxy.name}`);
}
```

**返回值**: `array` of `number` - 星系 ID

## 星系属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `seed` | `number` | 星系种子（与 ID 相同） |
| `name` | `string` | 星系名称 |
| `starType` | `string` | 恒星类型（影响星球分布） |
| `positionX` | `number` | 宇宙中的 X 坐标 |
| `positionY` | `number` | 宇宙中的 Y 坐标 |
| `planetsCount` | `number` | 自然星球数量 |
| `gridSize` | `number` | 内部网格大小 |
| `minCoord` | `number` | 最小坐标 |
| `maxCoord` | `number` | 最大坐标 |

## 星系方法

### 星球

#### `galaxy.getPlanets()`

获取星系中的所有自然星球。

```javascript
const galaxy = Game.getGalaxy(galaxyId);
const planets = galaxy.getPlanets();

console.log(`${galaxy.name} 有 ${planets.length} 个星球`);

for (const planet of planets) {
  console.log(`- ${planet.name} 位于 (${planet.pos.x}, ${planet.pos.y})`);
}
```

**返回值**: `array` of Planet 对象

### 空间站

#### `galaxy.getSpaceStations()`

获取星系中的所有空间站（所有玩家）。

```javascript
const stations = galaxy.getSpaceStations();
console.log(`星系中有 ${stations.length} 个空间站`);
```

**返回值**: `array` of SpaceStation 对象

#### `galaxy.getMyStations()`

仅获取此星系中你的空间站。

```javascript
const myStations = galaxy.getMyStations();
```

**返回值**: `array` of SpaceStation 对象

#### `galaxy.getStationsByOwner(ownerId)`

获取特定玩家拥有的空间站。

```javascript
const enemyStations = galaxy.getStationsByOwner(enemyPlayerId);
```

**返回值**: `array` of SpaceStation 对象

#### `galaxy.findHostileStations()`

获取星系中所有敌方空间站。

```javascript
const hostileStations = galaxy.findHostileStations();
```

**返回值**: `array` of SpaceStation 对象

### 飞船

#### `galaxy.getMyShips()`

获取此星系中你的所有飞船。

```javascript
const myShips = galaxy.getMyShips();
console.log(`我在这里有 ${myShips.length} 艘飞船`);
```

**返回值**: `array` of Ship 对象

#### `galaxy.getAllShips()`

获取星系中的所有飞船（包括敌方）。

```javascript
const allShips = galaxy.getAllShips();
```

**返回值**: `array` of Ship 对象

#### `galaxy.getShipsByOwner(ownerId)`

获取特定玩家拥有的飞船。

```javascript
const enemyShips = galaxy.getShipsByOwner(enemyPlayerId);
```

**返回值**: `array` of Ship 对象

#### `galaxy.findHostileShips()`

获取星系中所有敌方飞船。

```javascript
const enemies = galaxy.findHostileShips();
if (enemies.length > 0) {
  console.log(`警告: 检测到 ${enemies.length} 艘敌方飞船！`);
}
```

**返回值**: `array` of Ship 对象

### 建筑

#### `galaxy.getMyStructures()`

获取此星系中你的所有建筑。

```javascript
const myStructures = galaxy.getMyStructures();
```

**返回值**: `array` of Structure 对象

#### `galaxy.getAllStructures()`

获取星系中的所有建筑（包括敌方）。

```javascript
const allStructures = galaxy.getAllStructures();
```

**返回值**: `array` of Structure 对象

#### `galaxy.getStructuresByOwner(ownerId)`

获取特定玩家拥有的建筑。

```javascript
const enemyStructures = galaxy.getStructuresByOwner(enemyPlayerId);
```

**返回值**: `array` of Structure 对象

#### `galaxy.findHostileStructures()`

获取星系中所有敌方建筑。

```javascript
const enemyBases = galaxy.findHostileStructures();
```

**返回值**: `array` of Structure 对象

### 星门

#### `galaxy.getJumpGates()`

获取星系中的所有星门。

```javascript
const gates = galaxy.getJumpGates();

for (const gate of gates) {
  console.log(`通往星系 ${gate.targetGalaxyId} 的星门`);
  console.log(`位置: (${gate.pos.x}, ${gate.pos.y})`);
}
```

**返回值**: `array` of JumpGate 对象

详见 [星门 API](./jumpgate)。

### 扫描

#### `galaxy.lookAt(x, y)`

获取特定位置的所有对象。

```javascript
const objects = galaxy.lookAt(50, 50);

for (const obj of objects) {
  if (obj.type === 'planet') {
    console.log(`找到星球: ${obj.name}`);
  } else if (obj.type === 'ship') {
    console.log(`找到飞船: ${obj.name}`);
  }
}
```

**返回值**: `array` 该位置的对象

#### `galaxy.scanArea(x, y, radius)`

扫描区域内的对象。

```javascript
const scan = galaxy.scanArea(50, 50, 10);

console.log(`区域内的飞船: ${scan.ships.length}`);
console.log(`区域内的建筑: ${scan.structures.length}`);
console.log(`中心: (${scan.center.x}, ${scan.center.y})`);
console.log(`半径: ${scan.radius}`);
```

**返回值**: 包含以下内容的对象：
- `ships`: 范围内的飞船数组
- `structures`: 范围内的建筑数组
- `center`: 中心位置
- `radius`: 扫描半径

## 星系坐标

星系使用网格坐标系统：

```javascript
const galaxy = Game.getGalaxy(galaxyId);

// 网格尺寸
console.log(`网格大小: ${galaxy.gridSize}x${galaxy.gridSize}`);
console.log(`坐标: ${galaxy.minCoord} 到 ${galaxy.maxCoord}`);

// 示例: 21x21 网格从 -10 到 +10
// 中心在 (0, 0)
```

## 恒星类型

不同的恒星类型有不同的特征：

- `blue_giant` - 大型热恒星，有许多富含金属的星球
- `yellow_star` - 平衡系统，如我们的太阳
- `red_dwarf` - 较冷的恒星，星球较少但资源丰富
- `white_dwarf` - 小型密集系统
- `binary_star` - 双星系统，有独特的星球形成

## 示例

### 星系概览

```javascript
function getGalaxyOverview(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  return {
    name: galaxy.name,
    starType: galaxy.starType,
    coordinates: [galaxy.positionX, galaxy.positionY],
    naturalPlanets: galaxy.getPlanets().length,
    spaceStations: galaxy.getSpaceStations().length,
    myShips: galaxy.getMyShips().length,
    myStructures: galaxy.getMyStructures().length,
    enemyShips: galaxy.findHostileShips().length,
    enemyStructures: galaxy.findHostileStructures().length,
    jumpGates: galaxy.getJumpGates().length
  };
}

const overview = getGalaxyOverview(ship.galaxyId);
console.log(JSON.stringify(overview, null, 2));
```

### 多星系管理

```javascript
// 管理所有你的星系
const myGalaxies = Game.getVisibleGalaxies();

for (const galaxyId of myGalaxies) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  console.log(`\n=== ${galaxy.name} ===`);
  
  // 计算飞船
  const ships = galaxy.getMyShips();
  console.log(`飞船: ${ships.length}`);
  
  // 计算建筑
  const structures = galaxy.getMyStructures();
  const completed = structures.filter(s => s.progress === 100).length;
  console.log(`建筑: ${completed}/${structures.length} 完成`);
  
  // 检查威胁
  const enemies = galaxy.findHostileShips();
  if (enemies.length > 0) {
    console.log(`⚠️  警告: ${enemies.length} 艘敌方飞船！`);
  }
}
```

### 资源地图

```javascript
// 创建星系的资源地图
function mapGalaxyResources(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const planets = galaxy.getPlanets();
  
  const resourceMap = {};
  
  for (const planet of planets) {
    for (const [resource, amount] of Object.entries(planet.resources)) {
      if (!resourceMap[resource]) {
        resourceMap[resource] = {
          total: 0,
          locations: []
        };
      }
      
      resourceMap[resource].total += amount;
      resourceMap[resource].locations.push({
        planet: planet.name,
        amount: amount,
        pos: { x: planet.pos.x, y: planet.pos.y }
      });
    }
  }
  
  // 按数量排序位置
  for (const resource in resourceMap) {
    resourceMap[resource].locations.sort((a, b) => b.amount - a.amount);
  }
  
  return resourceMap;
}

const resMap = mapGalaxyResources(ship.galaxyId);
console.log('铁矿石矿藏:', resMap.iron_ore);
```

