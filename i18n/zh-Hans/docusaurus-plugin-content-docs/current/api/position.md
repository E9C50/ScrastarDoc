# 位置 API

位置对象表示星系中的坐标。它们附加在飞船、星球、建筑和其他游戏对象上。

## 位置属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `x` | `number` | X 坐标 |
| `y` | `number` | Y 坐标 |
| `galaxyId` | `number` | 星系 ID |

## 位置方法

### `pos.getDistance(otherPos)`

计算两个位置之间的切比雪夫距离（国际象棋王距离）。

```javascript
const dist = ship.pos.getDistance(planet.pos);
console.log(`距离: ${dist} 格`);
```

**返回值**: `number` - 网格单位的距离

:::info 切比雪夫距离
也称为"国际象棋王距离"，它是坐标绝对差值的最大值：
```
距离 = max(|x1 - x2|, |y1 - y2|)
```
这意味着对角线移动与正交移动的距离相同。
:::

### `pos.isNear(otherPos, [range])`

检查另一个位置是否在范围内。

```javascript
// 检查是否相邻（距离 `<=` 1）
if (ship.pos.isNear(planet.pos)) {
  ship.harvest(planet);
}

// 检查自定义范围
if (ship.pos.isNear(enemy.pos, 3)) {
  ship.attackTarget(enemy.id);
}
```

**参数**:
- `otherPos`: 要检查的位置
- `range` (可选): 最大距离（默认: 1）

**返回值**: `boolean`

### `pos.inSameGalaxy(otherPos)`

检查两个位置是否在同一星系。

```javascript
if (ship.pos.inSameGalaxy(planet.pos)) {
  console.log('飞船和星球在同一星系');
}
```

**返回值**: `boolean`

## 访问位置

所有主要游戏对象都有位置：

```javascript
// 飞船
const shipPos = ship.pos;
console.log(`飞船位于 (${shipPos.x}, ${shipPos.y})`);

// 星球
const planetPos = planet.pos;

// 建筑  
const structurePos = structure.pos;

// 星门
const gatePos = jumpgate.pos;

// 空间站
const stationPos = spaceStation.pos;
```

## 位置计算

### 查找最近对象

```javascript
function findNearest(fromPos, objects) {
  let nearest = null;
  let minDist = Infinity;
  
  for (const obj of objects) {
    const dist = fromPos.getDistance(obj.pos);
    if (dist < minDist) {
      nearest = obj;
      minDist = dist;
    }
  }
  
  return { object: nearest, distance: minDist };
}

// 使用
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();
const result = findNearest(ship.pos, planets);

console.log(`最近的星球: ${result.object.name}`);
console.log(`距离: ${result.distance}`);
```

### 按距离排序

```javascript
// 按距离飞船的距离对星球排序
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

const sorted = planets.sort((a, b) => {
  const distA = ship.pos.getDistance(a.pos);
  const distB = ship.pos.getDistance(b.pos);
  return distA - distB;
});

console.log('按距离排序的星球:');
for (const planet of sorted.slice(0, 5)) {
  const dist = ship.pos.getDistance(planet.pos);
  console.log(`${planet.name}: ${dist} 格`);
}
```

### 位置筛选

```javascript
// 查找范围内的所有对象
function getObjectsInRange(centerPos, objects, range) {
  return objects.filter(obj => 
    centerPos.isNear(obj.pos, range)
  );
}

// 使用
const nearbyPlanets = getObjectsInRange(
  ship.pos,
  galaxy.getPlanets(),
  5
);

console.log(`5 格内有 ${nearbyPlanets.length} 个星球`);
```

## 移动计算

### 直线路径距离

```javascript
// 计算路径的总距离
function calculatePathLength(positions) {
  let totalDistance = 0;
  
  for (let i = 1; i < positions.length; i++) {
    totalDistance += positions[i-1].getDistance(positions[i]);
  }
  
  return totalDistance;
}

// 使用: 查找最短路径
const waypoints = [ship.pos, planet1.pos, planet2.pos, base.pos];
const distance = calculatePathLength(waypoints);
console.log(`总路径长度: ${distance} 格`);
```

### 估算旅行时间

```javascript
// 估算到达目的地的 ticks
function estimateTravelTime(fromPos, toPos, shipEnergyPerTick) {
  const distance = fromPos.getDistance(toPos);
  // 飞船每次行动移动 1 格，消耗 1 能量
  // 假设飞船每个 tick 行动一次
  return distance;
}

const ticks = estimateTravelTime(ship.pos, planet.pos, 10);
console.log(`预计到达时间: ${ticks} ticks`);
```

## 坐标操作

### 手动位置检查

```javascript
// 检查位置在星系中是否有效
const galaxy = Game.getGalaxy(galaxyId);

function isValidPosition(x, y, galaxy) {
  return x >= galaxy.minCoord && x <= galaxy.maxCoord &&
         y >= galaxy.minCoord && y <= galaxy.maxCoord;
}

if (isValidPosition(50, 50, galaxy)) {
  console.log('位置 (50, 50) 有效');
}
```

### 位置比较

```javascript
// 检查两个位置是否相同
function samePosition(pos1, pos2) {
  return pos1.x === pos2.x && 
         pos1.y === pos2.y && 
         pos1.galaxyId === pos2.galaxyId;
}

if (samePosition(ship.pos, planet.pos)) {
  console.log('飞船在星球位置');
}
```

## 高级示例

### 区域扫描器

```javascript
// 扫描位置周围的区域
function scanArea(centerPos, radius, galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  const scan = {
    center: { x: centerPos.x, y: centerPos.y },
    radius: radius,
    planets: [],
    ships: [],
    structures: [],
    jumpgates: []
  };
  
  // 扫描星球
  for (const planet of galaxy.getPlanets()) {
    if (centerPos.isNear(planet.pos, radius)) {
      scan.planets.push({
        name: planet.name,
        pos: { x: planet.pos.x, y: planet.pos.y },
        distance: centerPos.getDistance(planet.pos),
        resources: planet.resources
      });
    }
  }
  
  // 扫描飞船
  for (const ship of galaxy.getAllShips()) {
    if (centerPos.isNear(ship.pos, radius)) {
      scan.ships.push({
        id: ship.id,
        name: ship.name,
        ownerId: ship.ownerId,
        pos: { x: ship.pos.x, y: ship.pos.y },
        distance: centerPos.getDistance(ship.pos)
      });
    }
  }
  
  // 扫描建筑
  for (const structure of galaxy.getAllStructures()) {
    if (centerPos.isNear(structure.pos, radius)) {
      scan.structures.push({
        id: structure.id,
        type: structure.type,
        ownerId: structure.ownerId,
        pos: { x: structure.pos.x, y: structure.pos.y },
        distance: centerPos.getDistance(structure.pos)
      });
    }
  }
  
  // 扫描星门
  for (const gate of galaxy.getJumpGates()) {
    if (centerPos.isNear(gate.pos, radius)) {
      scan.jumpgates.push({
        targetGalaxyId: gate.targetGalaxyId,
        pos: { x: gate.pos.x, y: gate.pos.y },
        distance: centerPos.getDistance(gate.pos)
      });
    }
  }
  
  return scan;
}

// 使用
const scan = scanArea(ship.pos, 10, ship.galaxyId);
console.log('扫描结果:', JSON.stringify(scan, null, 2));
```

### 战略位置分析

```javascript
// 分析位置的战略价值
function analyzePosition(pos, galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  
  const analysis = {
    position: { x: pos.x, y: pos.y },
    nearbyResources: 0,
    nearbyPlanets: 0,
    enemyPresence: false,
    nearJumpgate: false,
    strategic_value: 0
  };
  
  // 检查附近的星球和资源
  const planets = galaxy.getPlanets();
  for (const planet of planets) {
    const dist = pos.getDistance(planet.pos);
    if (dist <= 5) {
      analysis.nearbyPlanets++;
      const totalRes = Object.values(planet.resources)
        .reduce((sum, amt) => sum + amt, 0);
      analysis.nearbyResources += totalRes / (dist + 1);
    }
  }
  
  // 检查敌方存在
  const enemies = galaxy.findHostileShips();
  for (const enemy of enemies) {
    if (pos.isNear(enemy.pos, 10)) {
      analysis.enemyPresence = true;
      break;
    }
  }
  
  // 检查星门接近度
  const gates = galaxy.getJumpGates();
  for (const gate of gates) {
    if (pos.isNear(gate.pos, 3)) {
      analysis.nearJumpgate = true;
      break;
    }
  }
  
  // 计算战略价值
  analysis.strategic_value = 
    analysis.nearbyResources * 2 +
    analysis.nearbyPlanets * 10 +
    (analysis.nearJumpgate ? 50 : 0) -
    (analysis.enemyPresence ? 100 : 0);
  
  return analysis;
}

// 找到最佳扩展位置
const galaxy = Game.getGalaxy(ship.galaxyId);
let bestPos = null;
let bestValue = -Infinity;

for (let x = galaxy.minCoord; x <= galaxy.maxCoord; x += 5) {
  for (let y = galaxy.minCoord; y <= galaxy.maxCoord; y += 5) {
    const testPos = { x, y, galaxyId: ship.galaxyId };
    const analysis = analyzePosition(testPos, ship.galaxyId);
    
    if (analysis.strategic_value > bestValue) {
      bestValue = analysis.strategic_value;
      bestPos = testPos;
    }
  }
}

console.log(`最佳扩展位置: (${bestPos.x}, ${bestPos.y})`);
console.log(`战略价值: ${bestValue}`);
```

