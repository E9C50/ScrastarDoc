# Weapons API

Ships can be equipped with various weapon systems for combat. Weapons require specific components and have different characteristics.

## Weapon Types

### Basic Attack

#### `ship.attackTarget(targetId)`

Basic weapon attack using the ship's base attack power.

```javascript
ship.attackTarget(enemy.id);
```

**Requirements**: None (always available)
**Cost**: 10 energy
**Range**: 2 grids
**Damage**: Based on ship's attack attribute

### Missiles

#### `ship.fireMissile(target)`

Fire a guided missile at a target.

```javascript
const enemies = Game.findHostileShips(ship.galaxyId);
if (enemies.length > 0) {
  ship.fireMissile(enemies[0]);
}
```

**Requirements**:
- `missile_launcher` component
- Missiles in storage

**Properties**:
- Base damage: 80
- Range: 5 grids
- Cooldown: 3 ticks
- Cost: 1 missile from storage

**Special Effects**:
- 150% damage to shields
- 125% damage to structures
- Ignores 75% of target's defense
- Has cooldown period

#### `ship.getMissileCount()`

Get remaining missile count.

```javascript
const missiles = ship.getMissileCount();
console.log(`Missiles: ${missiles}`);
```

**Returns**: `number`

#### `ship.getMissileCooldown()`

Get remaining cooldown time.

```javascript
const cooldown = ship.getMissileCooldown();
if (cooldown === 0) {
  ship.fireMissile(target);
} else {
  console.log(`Missile ready in ${cooldown} ticks`);
}
```

**Returns**: `number` - remaining ticks

### Laser

#### `ship.fireLaser(target)`

Fire an energy laser at a target.

```javascript
if (ship.canFireLaser()) {
  ship.fireLaser(enemy);
}
```

**Requirements**:
- `laser_weapon` component
- Sufficient energy

**Properties**:
- Base damage: 50
- Range: 4 grids
- Energy cost: 25
- No cooldown

**Special Effects**:
- 70% damage to shields
- 100% damage to hull
- Normal defense applies

#### `ship.canFireLaser()`

Check if laser can be fired.

```javascript
if (ship.canFireLaser() && ship.pos.isNear(enemy.pos, 4)) {
  ship.fireLaser(enemy);
}
```

**Returns**: `boolean`

## Weapon Comparison

| Weapon | Damage | Range | Cooldown | Cost | vs Shields | vs Structures |
|------|------|------|------|------|--------|--------|
| Basic Attack | Variable | 2 | None | 10 energy | 100% | 100% |
| Missile | 80 | 5 | 3 ticks | 1 missile | 150% | 125% |
| Laser | 50 | 4 | None | 25 energy | 70% | 100% |

## Damage Calculation

Damage formula:
```javascript
damage = attackPower - targetDefense/2;
if (damage < 1) damage = 1; // Minimum damage
```

Example:
```javascript
// Ship with 60 attack vs target with 40 defense
damage = 60 - 40/2 = 60 - 20 = 40 damage
```

### Missile Damage
```javascript
// Missiles ignore 75% of defense
effectiveDefense = targetDefense / 4;
damage = 80 - effectiveDefense;

// vs Shields: damage * 1.5
// vs Structures: damage * 1.25
```

### Laser Damage
```javascript
// Lasers affected by full defense
damage = 50 - targetDefense / 2;

// vs Shields: damage * 0.7
```

## Combat Strategies

### Hit and Run

```javascript
// Use missiles then retreat
function hitAndRun(ship, targets) {
  if (ship.getMissileCooldown() === 0 && ship.getMissileCount() > 0) {
    // Fire missile
    const target = targets[0];
    if (ship.pos.getDistance(target.pos) <= 5) {
      ship.fireMissile(target);
      
      // Retreat
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

### Kiting

```javascript
// Maintain distance and use laser
function kiteEnemy(ship, enemy) {
  const dist = ship.pos.getDistance(enemy.pos);
  
  if (dist <= 3) {
    // Too close, retreat
    const dx = ship.pos.x - enemy.pos.x;
    const dy = ship.pos.y - enemy.pos.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      ship.move(dx > 0 ? 'e' : 'w');
    } else {
      ship.move(dy > 0 ? 'n' : 's');
    }
  } else if (dist === 4) {
    // Perfect range, fire laser
    if (ship.canFireLaser()) {
      ship.fireLaser(enemy);
    }
  } else {
    // Too far, approach
    ship.moveTo(enemy.pos);
  }
}
```

### Focus Fire

```javascript
// Concentrate fire on weakest target
function focusFire(ships, enemies) {
  if (enemies.length === 0) return;
  
  // Find weakest enemy
  const target = enemies.reduce((weakest, enemy) => {
    const currentHP = weakest.hp + weakest.shield;
    const enemyHP = enemy.hp + enemy.shield;
    return enemyHP < currentHP ? enemy : weakest;
  });
  
  // All ships attack same target
  for (const ship of ships) {
    const dist = ship.pos.getDistance(target.pos);
    
    // Use best available weapon
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

### Shield Management

```javascript
// Smart shield usage
function manageShields(ship, enemies) {
  const nearbyEnemies = enemies.filter(e => 
    ship.pos.getDistance(e.pos) <= 3
  );
  
  if (nearbyEnemies.length > 0) {
    // Danger zone - enable shields
    if (ship.shield < ship.maxShield) {
      ship.enableShield();
    }
  } else {
    // Safe - disable shields to save energy
    if (ship.shield > 0) {
      ship.disableShield();
    }
  }
}
```

### Ammo Management

```javascript
// Manage missile ammunition
function manageAmmo(ship) {
  const missiles = ship.getMissileCount();
  
  if (missiles < 5) {
    // Low on missiles, find warehouse
    const warehouses = Game.getMyStructures()
      .filter(s => s.type === 'warehouse' && 
                   s.galaxyId === ship.galaxyId);
    
    for (const warehouse of warehouses) {
      const available = warehouse.storage.missile || 0;
      if (available >= 10) {
        if (ship.pos.isNear(warehouse.pos)) {
          ship.withdraw(warehouse, 'missile', 10);
          console.log('Restocked missiles');
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

## Advanced Combat

### Multi-Weapon Rotation

```javascript
// Optimize use of all available weapons
function combatRotation(ship, target) {
  const dist = ship.pos.getDistance(target.pos);
  
  // Priority: Missile (if ready) > Laser > Basic Attack
  
  // 1. Try missile (longest range, highest damage)
  if (dist <= 5 && 
      ship.components.includes('missile_launcher') &&
      ship.getMissileCooldown() === 0 &&
      ship.getMissileCount() > 0) {
    return ship.fireMissile(target);
  }
  
  // 2. Try laser (medium range, no cooldown)
  if (dist <= 4 && 
      ship.components.includes('laser_weapon') &&
      ship.canFireLaser()) {
    return ship.fireLaser(target);
  }
  
  // 3. Basic attack (close range, always available)
  if (dist <= 2) {
    return ship.attackTarget(target.id);
  }
  
  // 4. Move into range
  ship.moveTo(target.pos);
  return false;
}
```

### Target Priority

```javascript
// Select best target
function selectTarget(ship, enemies) {
  if (enemies.length === 0) return null;
  
  const priorities = enemies.map(enemy => {
    let score = 0;
    
    // Prefer low HP targets (easy kills)
    score += 100 / (enemy.hp + 1);
    
    // Prefer closer targets
    const dist = ship.pos.getDistance(enemy.pos);
    score += 50 / (dist + 1);
    
    // Deprioritize shielded targets
    score -= enemy.shield * 0.1;
    
    // Prioritize ships with weapons
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

### Fleet Combat

```javascript
// Coordinate fleet combat
function fleetCombat(galaxyId) {
  const myShips = Game.getMyShips()
    .filter(s => s.galaxyId === galaxyId);
  
  const enemies = Game.findHostileShips(galaxyId);
  
  if (enemies.length === 0) return;
  
  // Separate ships by role
  const fighters = myShips.filter(s => 
    s.components.includes('laser_weapon') ||
    s.components.includes('missile_launcher')
  );
  
  const supports = myShips.filter(s =>
    s.components.includes('repair_drone')
  );
  
  // Fighters attack
  const target = selectTarget(fighters[0], enemies);
  if (target) {
    for (const fighter of fighters) {
      combatRotation(fighter, target);
    }
  }
  
  // Supports repair damaged ships
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

## Weapon Configuration

Query weapon attributes from Config API:

```javascript
// Get missile launcher attributes
const missile = Game.Config.getComponentEffect('missile_launcher');
console.log('Missile damage:', missile.missileDamage);
console.log('Missile range:', missile.missileRange);
console.log('Missile cooldown:', missile.missileCooldown);

// Get laser weapon attributes
const laser = Game.Config.getComponentEffect('laser_weapon');
console.log('Laser damage:', laser.laserDamage);
console.log('Laser range:', laser.laserRange);
console.log('Laser energy cost:', laser.laserEnergyCost);
```

## Combat Constants

```javascript
const COMBAT_CONSTANTS = {
  BASIC_ATTACK_RANGE: 2,
  BASIC_ATTACK_COST: 10,
  MISSILE_RANGE: 5,
  MISSILE_DAMAGE: 80,
  MISSILE_COOLDOWN: 3,
  LASER_RANGE: 4,
  LASER_DAMAGE: 50,
  LASER_COST: 25
};
```

