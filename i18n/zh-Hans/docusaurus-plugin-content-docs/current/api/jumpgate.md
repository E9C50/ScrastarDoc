# 星门 API

星门是连接星系的自然虫洞。它们允许飞船立即在恒星系统之间旅行。

## 星门属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | `number` | 唯一标识符 |
| `name` | `string` | 星门名称 |
| `galaxyId` | `number` | 当前星系 ID |
| `targetGalaxyId` | `number` | 目标星系 ID |
| `pos` | `Position` | 星门位置 |

## 访问星门

通过 Galaxy 对象访问星门：

```javascript
const galaxy = Game.getGalaxy(ship.galaxyId);
const gates = galaxy.getJumpGates();

for (const gate of gates) {
  console.log(`通往星系 ${gate.targetGalaxyId} 的星门`);
  console.log(`位置: (${gate.pos.x}, ${gate.pos.y})`);
}
```

## 使用星门

### `ship.useJumpGate(jumpgate)`

通过星门前往另一个星系。

```javascript
// 查找当前星系中的星门
const galaxy = Game.getGalaxy(ship.galaxyId);
const gates = galaxy.getJumpGates();

if (gates.length > 0) {
  const gate = gates[0];
  
  // 移动到星门
  if (ship.pos.isNear(gate.pos)) {
    // 使用星门
    ship.useJumpGate(gate);
    console.log(`跳跃到星系 ${gate.targetGalaxyId}`);
  } else {
    ship.moveTo(gate.pos);
  }
}
```

**要求**:
- 飞船必须与星门相邻（距离 `<=` 1）
- 需要 `warp_drive` 组件
- 根据组件效率消耗能量

**返回值**: `boolean` - 成功/失败

:::info 需要曲速引擎
飞船需要 `warp_drive` 组件才能使用星门。没有它，飞船无法在星系之间旅行。
:::

## 星门网络

星系通过星门网络连接：

```javascript
// 映射所有连接的星系
function mapGalaxyNetwork(startGalaxyId, maxDepth = 3) {
  const network = {
    galaxies: new Set([startGalaxyId]),
    connections: [],
    explored: new Set()
  };
  
  function explore(galaxyId, depth) {
    if (depth > maxDepth || network.explored.has(galaxyId)) {
      return;
    }
    
    network.explored.add(galaxyId);
    
    try {
      const galaxy = Game.getGalaxy(galaxyId);
      const gates = galaxy.getJumpGates();
      
      for (const gate of gates) {
        network.galaxies.add(gate.targetGalaxyId);
        network.connections.push({
          from: galaxyId,
          to: gate.targetGalaxyId,
          pos: { x: gate.pos.x, y: gate.pos.y }
        });
        
        explore(gate.targetGalaxyId, depth + 1);
      }
    } catch (e) {
      // 星系无法访问
    }
  }
  
  explore(startGalaxyId, 0);
  
  return {
    galaxyCount: network.galaxies.size,
    connectionCount: network.connections.length,
    galaxies: Array.from(network.galaxies),
    connections: network.connections
  };
}

// 使用
const network = mapGalaxyNetwork(ship.galaxyId, 2);
console.log(`连接到 ${network.galaxyCount} 个星系`);
console.log(`总连接数: ${network.connectionCount}`);
```

## 查找路径

### `Game.findPathBetweenGalaxies(fromGalaxyId, toGalaxyId)`

通过星门查找两个星系之间的路径。

```javascript
const path = Game.findPathBetweenGalaxies(
  ship.galaxyId,
  targetGalaxyId
);

if (path) {
  console.log(`找到路径: ${path.length} 次跳跃`);
  for (let i = 0; i < path.length; i++) {
    console.log(`${i + 1}. 星系 ${path[i]}`);
  }
} else {
  console.log('未找到路径');
}
```

**返回值**: 星系 ID 数组，如果不存在路径则为 `null`

## 示例

### 自动探索

```javascript
// 通过星门探索
function exploreNewGalaxies(ship) {
  const galaxy = Game.getGalaxy(ship.galaxyId);
  const gates = galaxy.getJumpGates();
  
  // 过滤掉已访问过的星系的星门
  const unvisited = gates.filter(gate => {
    const visited = Game.getVisibleGalaxies();
    return !visited.includes(gate.targetGalaxyId);
  });
  
  if (unvisited.length > 0) {
    const gate = unvisited[0];
    
    if (ship.pos.isNear(gate.pos)) {
      ship.useJumpGate(gate);
      console.log(`探索星系 ${gate.targetGalaxyId}`);
    } else {
      ship.moveTo(gate.pos);
    }
    
    return true;
  }
  
  return false;
}

// 运行探索飞船
const explorers = Game.getMyShips()
  .filter(s => s.components.includes('warp_drive'));

for (const ship of explorers) {
  exploreNewGalaxies(ship);
}
```

### 贸易路线规划

```javascript
// 通过多个星系规划贸易路线
function planTradeRoute(startGalaxyId, galaxyIds) {
  const route = {
    start: startGalaxyId,
    stops: [],
    totalJumps: 0,
    feasible: true
  };
  
  let currentGalaxy = startGalaxyId;
  
  for (const targetGalaxy of galaxyIds) {
    const path = Game.findPathBetweenGalaxies(currentGalaxy, targetGalaxy);
    
    if (!path) {
      route.feasible = false;
      console.log(`无法从 ${currentGalaxy} 到达星系 ${targetGalaxy}`);
      break;
    }
    
    route.stops.push({
      galaxy: targetGalaxy,
      path: path,
      jumps: path.length - 1
    });
    
    route.totalJumps += path.length - 1;
    currentGalaxy = targetGalaxy;
  }
  
  return route;
}

// 使用
const tradeRoute = planTradeRoute(ship.galaxyId, [
  12345,  // 采矿星系
  12346,  // 加工星系
  12347   // 市场星系
]);

if (tradeRoute.feasible) {
  console.log(`贸易路线: 总共 ${tradeRoute.totalJumps} 次跳跃`);
}
```

### 舰队协调

```javascript
// 通过星门移动整个舰队
function moveFleetThroughGate(ships, targetGalaxyId) {
  // 查找已在目标星系的飞船
  const scouts = ships.filter(s => s.galaxyId === targetGalaxyId);
  
  if (scouts.length > 0) {
    console.log('舰队已在目标星系有存在');
  }
  
  // 移动剩余飞船
  for (const ship of ships) {
    if (ship.galaxyId === targetGalaxyId) {
      continue; // 已经在那里
    }
    
    // 找到到目标星系的路径
    const path = Game.findPathBetweenGalaxies(
      ship.galaxyId,
      targetGalaxyId
    );
    
    if (!path || path.length < 2) {
      console.log(`飞船 ${ship.name}: 没有到目标的路径`);
      continue;
    }
    
    // 获取路径中的下一个星系
    const nextGalaxyId = path[1];
    
    // 找到通往下一个星系的星门
    const galaxy = Game.getGalaxy(ship.galaxyId);
    const gate = galaxy.getJumpGates()
      .find(g => g.targetGalaxyId === nextGalaxyId);
    
    if (!gate) {
      console.log(`飞船 ${ship.name}: 未找到星门`);
      continue;
    }
    
    // 移动并使用星门
    if (ship.pos.isNear(gate.pos)) {
      if (ship.useJumpGate(gate)) {
        console.log(`飞船 ${ship.name}: 跳跃到星系 ${nextGalaxyId}`);
      }
    } else {
      ship.moveTo(gate.pos);
      console.log(`飞船 ${ship.name}: 移动到星门`);
    }
  }
}

// 将舰队移动到目标
const myFleet = Game.getMyShips()
  .filter(s => s.components.includes('warp_drive'));

moveFleetThroughGate(myFleet, 12345);
```

### 星门防御

```javascript
// 防御你领土中的星门
function defendJumpgates(galaxyId) {
  const galaxy = Game.getGalaxy(galaxyId);
  const gates = galaxy.getJumpGates();
  const defenders = galaxy.getMyShips()
    .filter(s => s.components.some(c => 
      c === 'laser_weapon' || c === 'missile_launcher'
    ));
  
  for (const gate of gates) {
    // 检查星门附近的敌人
    const enemies = galaxy.findHostileShips()
      .filter(e => gate.pos.isNear(e.pos, 5));
    
    if (enemies.length > 0) {
      console.log(`⚠️  星门附近有 ${enemies.length} 个敌人！`);
      
      // 分配防御者
      const nearest = defenders
        .sort((a, b) => {
          const distA = a.pos.getDistance(gate.pos);
          const distB = b.pos.getDistance(gate.pos);
          return distA - distB;
        })[0];
      
      if (nearest) {
        const target = enemies[0];
        const dist = nearest.pos.getDistance(target.pos);
        
        if (dist <= 2) {
          nearest.attackTarget(target.id);
        } else {
          nearest.moveTo(gate.pos);
        }
      }
    }
  }
}

defendJumpgates(ship.galaxyId);
```

