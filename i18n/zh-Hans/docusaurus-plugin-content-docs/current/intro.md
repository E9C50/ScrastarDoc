# StarGame API 文档

欢迎来到 **StarGame 策略API** 文档！StarGame 是一款基于浏览器的太空策略游戏，你可以通过编写 JavaScript 代码来控制你的舰队。

## 🚀 快速开始

在 StarGame 中，你通过编写 JavaScript 代码来控制飞船、建造建筑、采集资源和征服星系。你的代码在每个游戏 tick 时在沙盒环境中运行。

## 📚 核心概念

### 游戏对象

- **飞船（Ship）** - 用于探索、采矿、战斗和建造的主要单位
- **星球（Planet）** - 拥有可采集资源的自然天体
- **建筑（Structure）** - 在星球上建造的建筑物，用于生产和防御
- **星系（Galaxy）** - 包含星球、星门和空间站的恒星系统
- **空间站（Space Station）** - 玩家建造的轨道平台

### 游戏循环

你的代码在每个游戏 tick 时执行一次（默认：每隔几秒）。在每个 tick 期间：

1. 你的策略代码运行
2. 所有动作被执行
3. 资源被生产
4. 建造进度推进
5. 游戏状态更新

## 🎯 基础示例

```javascript
// 获取所有飞船
const myShips = Game.getMyShips();

// 控制第一艘飞船
if (myShips.length > 0) {
  const ship = myShips[0];
  
  // 检查是否具有采矿能力
  if (ship.components.includes('mining_laser')) {
    // 获取附近星球
    const galaxy = Game.getGalaxy(ship.galaxyId);
    const planets = galaxy.getPlanets();
    
    // 找到最近的星球
    if (planets.length > 0) {
      const planet = planets[0];
      
      // 移动到星球并采集资源
      if (ship.pos.isNear(planet.pos)) {
        ship.harvest(planet, 'iron_ore');
      } else {
        ship.moveTo(planet.pos);
      }
    }
  }
}
```

## 📖 API 参考

浏览详细的 API 文档：

- **[飞船 API](./api/ship)** - 控制你的舰队
- **[星球 API](./api/planet)** - 查询天体
- **[建筑 API](./api/structure)** - 管理你的建筑
- **[星系 API](./api/galaxy)** - 导航宇宙
- **[组件与武器](./api/components)** - 升级你的飞船
- **[配置查询](./api/config)** - 查询游戏规则

## 💡 提示

:::tip 资源管理
采集前始终检查飞船的存储容量。超出的资源会被浪费！
:::

:::info 能量系统
大多数飞船动作需要能量。确保安装能量核心并仔细管理你的能量。
:::

:::warning 战斗
没有武器的飞船无法攻击！安装导弹发射器或激光武器来保护自己。
:::

## 🎮 下一步

准备好开始编码了吗？查看 [飞船 API](./api/ship) 学习如何控制你的舰队！

