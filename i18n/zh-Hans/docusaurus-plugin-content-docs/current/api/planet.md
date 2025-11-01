# 星球 API

星球是包含可采集资源的自然天体。它们是建造建筑的位置。

## 星球属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `name` | `string` | 星球名称 |
| `type` | `string` | 星球类型（决定资源） |
| `size` | `number` | 星球大小 |
| `resources` | `object` | 可用资源及数量 |
| `galaxyId` | `number` | 所属星系 ID |
| `pos` | `Position` | 星球坐标 |
| `structures` | `array` | 在此星球上建造的建筑 |

## 资源类型

星球可以包含各种资源：

- `iron_ore` - 基础建筑材料
- `crystal` - 高级组件
- `deuterium` - 燃料和能源
- `metal` - 精炼铁矿石
- `alloy` - 高级建筑材料

## 方法

### `planet.getStructures()`

获取在此星球上建造的所有建筑（你拥有的）。

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

for (const planet of planets) {
  const structures = planet.getStructures();
  console.log(`${planet.name} 有 ${structures.length} 个建筑`);
}
```

**返回值**: `array` - Structure 对象数组

## 访问星球

通过 Galaxy 对象访问星球：

```javascript
// 获取星系
const galaxy = Game.getGalaxy(galaxyId);

// 获取所有自然星球
const planets = galaxy.getPlanets();

// 遍历星球
for (const planet of planets) {
  console.log(`星球: ${planet.name}`);
  console.log(`类型: ${planet.type}`);
  console.log(`位置: (${planet.pos.x}, ${planet.pos.y})`);
  console.log(`资源:`, planet.resources);
}
```

## 资源枯竭

星球的资源是有限的。采集时，可用量会减少：

```javascript
const planet = planets[0];
console.log(`剩余铁矿石: ${planet.resources.iron_ore}`);

// 采集后
ship.harvest(planet, 'iron_ore');

// 资源减少
console.log(`剩余铁矿石: ${planet.resources.iron_ore}`);
```

:::info 资源再生
目前，星球资源不会再生。请仔细规划你的采矿操作！
:::

## 星球所有权

通过在星球上建造建筑可以占领星球：

```javascript
// 在未占领的星球上建造第一个建筑
ship.build(planet, 'mining_facility');

// 星球现在归你所有
// 其他玩家无法在此建造，直到你放弃它
```

## 查找星球

### 按资源查找

查找具有特定资源的星球：

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

const ironPlanets = planets.filter(p => 
  p.resources.iron_ore && p.resources.iron_ore > 100
);

console.log(`找到 ${ironPlanets.length} 个有铁矿的星球`);
```

### 按距离查找

查找离飞船最近的星球：

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

let nearest = null;
let minDist = Infinity;

for (const planet of planets) {
  const dist = ship.pos.getDistance(planet.pos);
  if (dist < minDist) {
    nearest = planet;
    minDist = dist;
  }
}

if (nearest) {
  console.log(`最近的星球: ${nearest.name} 距离 ${minDist}`);
}
```

### 按类型查找

不同星球类型有不同的资源分布：

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const planets = galaxy.getPlanets();

// 按类型分组
const byType = {};
for (const planet of planets) {
  if (!byType[planet.type]) {
    byType[planet.type] = [];
  }
  byType[planet.type].push(planet);
}

console.log('按类型分类的星球:', Object.keys(byType));
```

## 空间站

空间站是玩家建造的，行为类似星球：

```javascript
// 获取星系中的所有空间站
const stations = galaxy.getSpaceStations();

// 仅你的空间站
const myStations = galaxy.getMyStations();

// 在空间站上建造（与星球相同）
ship.build(station, 'factory');
```

详见 [星系 API](./galaxy)。

## 示例

### 高效采矿策略

```javascript
// 找到最佳采矿星球
function findBestMiningPlanet(ship) {
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const planets = galaxy.getPlanets();
  
  let best = null;
  let bestScore = 0;
  
  for (const planet of planets) {
    // 跳过没有资源的星球
    const ironAmount = planet.resources.iron_ore || 0;
    if (ironAmount === 0) continue;
    
    // 基于资源和距离计算得分
    const distance = ship.pos.getDistance(planet.pos);
    const score = ironAmount / (distance + 1);
    
    if (score > bestScore) {
      best = planet;
      bestScore = score;
    }
  }
  
  return best;
}

// 使用函数
const myShips = Game.getMyShips();
for (const ship of myShips) {
  const planet = findBestMiningPlanet(ship);
  if (planet) {
    ship.moveTo(planet.pos);
  }
}
```

### 勘探所有星球

```javascript
// 创建资源地图
function surveyGalaxy(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const planets = galaxy.getPlanets();
  
  const survey = {
    totalPlanets: planets.length,
    resources: {},
    planetList: []
  };
  
  for (const planet of planets) {
    const planetInfo = {
      name: planet.name,
      type: planet.type,
      pos: { x: planet.pos.x, y: planet.pos.y },
      resources: planet.resources,
      hasStructures: planet.structures.length > 0
    };
    
    survey.planetList.push(planetInfo);
    
    // 汇总资源
    for (const [resource, amount] of Object.entries(planet.resources)) {
      if (!survey.resources[resource]) {
        survey.resources[resource] = 0;
      }
      survey.resources[resource] += amount;
    }
  }
  
  return survey;
}

// 运行勘探
const survey = surveyGalaxy(ship.galaxyId);
console.log('星系勘探:', JSON.stringify(survey, null, 2));
```

