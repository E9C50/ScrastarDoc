# 武器 API

飞船可以装备各种武器系统进行战斗。武器需要特定组件且有不同的特性。

## 武器类型

### 基础攻击

#### `ship.attackTarget(targetId)`

使用飞船基础攻击力的基本武器攻击。

```javascript
ship.attackTarget(enemy.id);
```

**要求**: 无（始终可用）
**消耗**: 10 能量
**射程**: 2 格
**伤害**: 基于飞船的攻击属性

### 导弹

#### `ship.fireMissile(target)`

向目标发射制导导弹。

```javascript
const enemies = Game.findHostileShips(ship.galaxyId);
if (enemies.length > 0) {
  ship.fireMissile(enemies[0]);
}
```

**要求**:
- `missile_launcher` 组件
- 仓库中的导弹

**属性**:
- 基础伤害: 80
- 射程: 5 格
- 冷却时间: 3 ticks
- 消耗: 仓库中的 1 枚导弹

**特性**:
- 对护盾 150% 伤害
- 对建筑 125% 伤害  
- 无视目标 75% 的防御
- 有冷却期

#### `ship.getMissileCount()`

获取剩余导弹数。

```javascript
const missiles = ship.getMissileCount();
console.log(`导弹: ${missiles}`);
```

**返回值**: `number`

#### `ship.getMissileCooldown()`

获取剩余冷却时间。

```javascript
const cooldown = ship.getMissileCooldown();
if (cooldown === 0) {
  ship.fireMissile(target);
} else {
  console.log(`导弹 ${cooldown} ticks 后就绪`);
}
```

**返回值**: `number` - 剩余 ticks

### 激光

#### `ship.fireLaser(target)`

向目标发射能量激光。

```javascript
if (ship.canFireLaser()) {
  ship.fireLaser(enemy);
}
```

**要求**:
- `laser_weapon` 组件
- 足够的能量

**属性**:
- 基础伤害: 50
- 射程: 4 格
- 能量消耗: 25
- 无冷却时间

**特殊效果**:
- 对护盾 70% 伤害
- 对船体 100% 伤害
- 正常受防御影响

#### `ship.canFireLaser()`

检查激光是否可以发射。

```javascript
if (ship.canFireLaser() && ship.pos.isNear(enemy.pos, 4)) {
  ship.fireLaser(enemy);
}
```

**返回值**: `boolean`

## 武器对比

| 武器 | 伤害 | 射程 | 冷却 | 消耗 | 对护盾 | 对建筑 |
|------|------|------|------|------|--------|--------|
| 基础攻击 | 可变 | 2 | 无 | 10 能量 | 100% | 100% |
| 导弹 | 80 | 5 | 3 ticks | 1 导弹 | 150% | 125% |
| 激光 | 50 | 4 | 无 | 25 能量 | 70% | 100% |

## 伤害计算

伤害公式：
```javascript
伤害 = 攻击力 - 目标防御力/2;
if (伤害 < 1) 伤害 = 1; // 最小伤害
```

示例：
```javascript
// 60 攻击力的飞船对 40 防御力的目标
伤害 = 60 - 40/2 = 60 - 20 = 40 伤害
```

### 导弹伤害
```javascript
// 导弹无视 75% 的防御
有效防御 = 目标防御力 / 4;
伤害 = 80 - 有效防御;

// 对护盾: 伤害 * 1.5
// 对建筑: 伤害 * 1.25
```

### 激光伤害
```javascript
// 激光受完整防御影响
伤害 = 50 - 目标防御力 / 2;

// 对护盾: 伤害 * 0.7
```

## 战斗策略

### 打了就跑

```javascript
// 使用导弹然后撤退
function hitAndRun(ship, targets) {
  if (ship.getMissileCooldown() === 0 && ship.getMissileCount() > 0) {
    // 发射导弹
    const target = targets[0];
    if (ship.pos.getDistance(target.pos) <= 5) {
      ship.fireMissile(target);
      
      // 撤退
      const dx = ship.pos.x - target.pos.x;
      const dy = ship.pos.y - target.pos.y;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        ship.move(dx > 0 ? 'e' : 'w');
      } else {
        ship.move(dy > 0 ? 'n' : 's');
      }
    }
  }
}
```

### 风筝战术

```javascript
// 保持距离并使用激光
function kiteEnemy(ship, enemy) {
  const dist = ship.pos.getDistance(enemy.pos);
  
  if (dist <= 3) {
    // 太近，后退
    const dx = ship.pos.x - enemy.pos.x;
    const dy = ship.pos.y - enemy.pos.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      ship.move(dx > 0 ? 'e' : 'w');
    } else {
      ship.move(dy > 0 ? 'n' : 's');
    }
  } else if (dist === 4) {
    // 完美射程，发射激光
    if (ship.canFireLaser()) {
      ship.fireLaser(enemy);
    }
  } else {
    // 太远，靠近
    ship.moveTo(enemy.pos);
  }
}
```

### 集火

```javascript
// 集中火力在最弱目标上
function focusFire(ships, enemies) {
  if (enemies.length === 0) return;
  
  // 找到最弱的敌人
  const target = enemies.reduce((weakest, enemy) => {
    const currentHP = weakest.hp + weakest.shield;
    const enemyHP = enemy.hp + enemy.shield;
    return enemyHP < currentHP ? enemy : weakest;
  });
  
  // 所有飞船攻击同一目标
  for (const ship of ships) {
    const dist = ship.pos.getDistance(target.pos);
    
    // 使用最佳可用武器
    if (dist <= 5 && ship.getMissileCooldown() === 0) {
      ship.fireMissile(target);
    } else if (dist <= 4 && ship.canFireLaser()) {
      ship.fireLaser(target);
    } else if (dist <= 2) {
      ship.attackTarget(target.id);
    } else {
      ship.moveTo(target.pos);
    }
  }
}
```

### 护盾管理

```javascript
// 智能护盾使用
function manageShields(ship, enemies) {
  const nearbyEnemies = enemies.filter(e => 
    ship.pos.getDistance(e.pos) <= 3
  );
  
  if (nearbyEnemies.length > 0) {
    // 危险区 - 启用护盾
    if (ship.shield < ship.maxShield) {
      ship.enableShield();
    }
  } else {
    // 安全 - 关闭护盾以节省能量
    if (ship.shield > 0) {
      ship.disableShield();
    }
  }
}
```

### 弹药管理

```javascript
// 管理导弹弹药
function manageAmmo(ship) {
  const missiles = ship.getMissileCount();
  
  if (missiles < 5) {
    // 导弹不足，找仓库
    const warehouses = Game.getMyStructures()
      .filter(s => s.type === 'warehouse' && 
                   s.galaxyId === ship.galaxyId);
    
    for (const warehouse of warehouses) {
      const available = warehouse.storage.missile || 0;
      if (available >= 10) {
        if (ship.pos.isNear(warehouse.pos)) {
          ship.withdraw(warehouse, 'missile', 10);
          console.log('补充导弹');
          return true;
        } else {
          ship.moveTo(warehouse.pos);
          return true;
        }
      }
    }
  }
  
  return false;
}
```

## 高级战斗

### 多武器轮换

```javascript
// 优化使用所有可用武器
function combatRotation(ship, target) {
  const dist = ship.pos.getDistance(target.pos);
  
  // 优先级: 导弹（如果就绪）> 激光 > 基础攻击
  
  // 1. 尝试导弹（最远射程，最高伤害）
  if (dist <= 5 && 
      ship.components.includes('missile_launcher') &&
      ship.getMissileCooldown() === 0 &&
      ship.getMissileCount() > 0) {
    return ship.fireMissile(target);
  }
  
  // 2. 尝试激光（中等射程，无冷却）
  if (dist <= 4 && 
      ship.components.includes('laser_weapon') &&
      ship.canFireLaser()) {
    return ship.fireLaser(target);
  }
  
  // 3. 基础攻击（近距离，始终可用）
  if (dist <= 2) {
    return ship.attackTarget(target.id);
  }
  
  // 4. 移动到射程内
  ship.moveTo(target.pos);
  return false;
}
```

### 目标优先级

```javascript
// 选择最佳目标
function selectTarget(ship, enemies) {
  if (enemies.length === 0) return null;
  
  const priorities = enemies.map(enemy => {
    let score = 0;
    
    // 偏好低 HP 目标（容易击杀）
    score += 100 / (enemy.hp + 1);
    
    // 偏好更近的目标
    const dist = ship.pos.getDistance(enemy.pos);
    score += 50 / (dist + 1);
    
    // 降低有护盾目标的优先级
    score -= enemy.shield * 0.1;
    
    // 优先攻击有武器的飞船
    if (enemy.components && 
        (enemy.components.includes('laser_weapon') ||
         enemy.components.includes('missile_launcher'))) {
      score += 20;
    }
    
    return { enemy, score };
  });
  
  priorities.sort((a, b) => b.score - a.score);
  return priorities[0].enemy;
}
```

### 舰队战斗

```javascript
// 协调舰队战斗
function fleetCombat(galaxyId) {
  const myShips = Game.getMyShips()
    .filter(s => s.galaxyId === galaxyId);
  
  const enemies = Game.findHostileShips(galaxyId);
  
  if (enemies.length === 0) return;
  
  // 按角色分离飞船
  const fighters = myShips.filter(s => 
    s.components.includes('laser_weapon') ||
    s.components.includes('missile_launcher')
  );
  
  const supports = myShips.filter(s =>
    s.components.includes('repair_drone')
  );
  
  // 战斗机攻击
  const target = selectTarget(fighters[0], enemies);
  if (target) {
    for (const fighter of fighters) {
      combatRotation(fighter, target);
    }
  }
  
  // 支援修复受损飞船
  for (const support of supports) {
    const damaged = fighters.find(s => s.hp < s.maxHP * 0.7);
    if (damaged) {
      if (support.pos.isNear(damaged.pos)) {
        support.repair(damaged.id);
      } else {
        support.moveTo(damaged.pos);
      }
    }
  }
}
```

## 武器配置

从 Config API 查询武器属性：

```javascript
// 获取导弹发射器属性
const missile = Game.Config.getComponentEffect('missile_launcher');
console.log('导弹伤害:', missile.missileDamage);
console.log('导弹射程:', missile.missileRange);
console.log('导弹冷却:', missile.missileCooldown);

// 获取激光武器属性  
const laser = Game.Config.getComponentEffect('laser_weapon');
console.log('激光伤害:', laser.laserDamage);
console.log('激光射程:', laser.laserRange);
console.log('激光能量消耗:', laser.laserEnergyCost);
```

## 战斗常量

```javascript
const COMBAT_CONSTANTS = {
  基础攻击射程: 2,
  基础攻击消耗: 10,
  导弹射程: 5,
  导弹伤害: 80,
  导弹冷却: 3,
  激光射程: 4,
  激光伤害: 50,
  激光消耗: 25
};
```

