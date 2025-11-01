# StarGame API Documentation

Welcome to the **StarGame Strategy API** documentation! StarGame is a browser-based space strategy game where you control your fleet through JavaScript code.

## 🚀 Quick Start

In StarGame, you write JavaScript code to control your ships, build structures, mine resources, and conquer galaxies. Your code runs in a sandboxed environment every game tick.

## 📚 Core Concepts

### Game Objects

- **Ship** - Your main unit for exploration, mining, combat, and construction
- **Planet** - Natural celestial bodies with resources to harvest
- **Structure** - Buildings you construct on planets for production and defense
- **Galaxy** - Star systems containing planets, jumpgates, and space stations
- **Space Station** - Player-built orbital platforms

### Game Loop

Your code executes once per game tick (default: every few seconds). During each tick:

1. Your strategy code runs
2. All actions are executed
3. Resources are produced
4. Construction progresses
5. Game state updates

## 🎯 Basic Example

```javascript
// Get all your ships
const myShips = Game.getMyShips();

// Control the first ship
if (myShips.length > 0) {
  const ship = myShips[0];
  
  // Check if we have mining capability
  if (ship.components.includes('mining_laser')) {
    // Get nearby planets
    const galaxy = Game.getGalaxy(ship.galaxyId);
    const planets = galaxy.getPlanets();
    
    // Find the closest planet
    if (planets.length > 0) {
      const planet = planets[0];
      
      // Move to planet and harvest resources
      if (ship.pos.isNear(planet.pos)) {
        ship.harvest(planet, 'iron_ore');
      } else {
        ship.moveTo(planet.pos);
      }
    }
  }
}
```

## 📖 API Reference

Explore the detailed API documentation:

- **[Ship API](./api/ship)** - Control your fleet
- **[Planet API](./api/planet)** - Query celestial bodies
- **[Structure API](./api/structure)** - Manage your buildings
- **[Galaxy API](./api/galaxy)** - Navigate the universe
- **[Components & Weapons](./api/components)** - Upgrade your ships
- **[Configuration](./api/config)** - Query game rules

## 💡 Tips

:::tip Resource Management
Always check your ship's storage capacity before harvesting. Excess resources will be wasted!
:::

:::info Energy System
Most ship actions require energy. Make sure to install power cores and manage your energy carefully.
:::

:::warning Combat
Ships without weapons can't attack! Install missile launchers or laser weapons to defend yourself.
:::

## 🎮 Next Steps

Ready to start coding? Check out the [Ship API](./api/ship) to learn how to control your fleet!
