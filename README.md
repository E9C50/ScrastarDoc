# 📚 Scrastar API Documentation

<div align="center">

![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9-00C4CC?logo=docusaurus)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![Languages](https://img.shields.io/badge/Languages-English%20%7C%20简体中文-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Official API documentation for Scrastar - A programming strategy space game**

[🌐 View Documentation](https://doc.scrastar.com) · [🎮 Play Game](https://www.scrastar.com)

[English](README.md) | [简体中文](README_ZH.md)

</div>

---

## 🎮 About Scrastar

**Scrastar (星际帝国)** is an open-source programming-based space strategy game inspired by Screeps. Players write JavaScript code to control their interstellar fleet, automate resource gathering, construct buildings, produce ships, and engage in strategic warfare.

### Core Features
- 🚀 **Code-Driven Gameplay** - Control your fleet through JavaScript
- 🌌 **Procedural Universe** - Dynamically generated galaxies and planets
- ⚙️ **Modular Components** - Customize ships with various components
- 💻 **Sandbox Environment** - Safe code execution with VM2
- 📊 **Real-time Strategy** - WebSocket-based game state synchronization

---

## 📖 About This Documentation

This repository contains the official API documentation for Scrastar, built with [Docusaurus](https://docusaurus.io/). The documentation provides comprehensive guides for:

- **Ship API** - Control movement, mining, construction, and combat
- **Structure API** - Manage buildings and production facilities
- **Galaxy & Navigation** - Explore star systems and use jumpgates
- **Component System** - Customize ships with weapons, engines, and utilities
- **Configuration Query** - Access game rules and recipes
- **Constants** - Complete reference of all game constants

### 🌍 Current Language Support

- ✅ **English** (Primary) - Complete documentation
- ✅ **简体中文 (Simplified Chinese)** - Complete documentation
- 🌟 **Want to add your language?** - See [Contributing](#-contributing-translations) below!

---

## 🌟 Contributing Translations

We welcome and encourage contributions for international translations! Help make Scrastar accessible to players worldwide by translating the documentation into your language.

### 📝 How to Contribute a New Language

1. **Fork this repository**
   ```bash
   git clone https://github.com/your-username/StarGame.git
   cd StarGame/docs
   ```

2. **Create translation directory**
   ```bash
   # Example for Japanese (ja)
   mkdir -p i18n/ja/docusaurus-plugin-content-docs/current
   ```

3. **Copy documentation files**
   ```bash
   # Copy all markdown files to translate
   cp -r docs/* i18n/ja/docusaurus-plugin-content-docs/current/
   ```

4. **Translate the content**
   - Translate all `.md` files in the new directory
   - Keep code examples and API names in English
   - Maintain the same file structure

5. **Add language configuration**
   
   Edit `docusaurus.config.ts`:
   ```typescript
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'zh-Hans', 'ja'], // Add your locale
     localeConfigs: {
       ja: {
         label: '日本語',
         direction: 'ltr',
         htmlLang: 'ja-JP',
       },
     },
   },
   ```

6. **Create sidebar translations**
   
   Create `i18n/ja/docusaurus-plugin-content-docs/current/sidebars.json`:
   ```json
   {
     "Core API": {
       "message": "コアAPI",
       "description": "Category label for core API"
     }
   }
   ```

7. **Test your translation**
   ```bash
   npm install
   npm run start -- --locale ja
   ```

8. **Submit a Pull Request**
   - Create a PR with your translation
   - Include a brief description of the translated language
   - We'll review and merge it!

### 🎯 Translation Guidelines

- ✅ **Do translate**: Documentation text, descriptions, explanations
- ❌ **Don't translate**: Code examples, API function names, property names
- ✅ **Keep consistent**: Use the same terminology throughout
- ✅ **Verify accuracy**: Ensure technical terms are correctly translated
- ✅ **Test locally**: Run the documentation site to check formatting

### 🌐 Priority Languages

We're especially looking for translations in:
- 🇯🇵 Japanese (日本語)
- 🇰🇷 Korean (한국어)
- 🇩🇪 German (Deutsch)
- 🇫🇷 French (Français)
- 🇪🇸 Spanish (Español)
- 🇷🇺 Russian (Русский)
- 🇧🇷 Portuguese (Português)

**Any language is welcome!** Your contribution helps grow our international community.

---

## 🚀 Local Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm start
```

This command starts a local development server at `http://localhost:3000/` and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory that can be served using any static contents hosting service.

### Build All Languages

```bash
npm run build
```

Docusaurus will automatically build all configured languages.

---

## 🛠️ Tech Stack

- **[Docusaurus 3.9](https://docusaurus.io/)** - Static site generator
- **React 19** - UI framework
- **TypeScript** - Type safety
- **MDX** - Markdown with JSX support
- **Prism** - Syntax highlighting

---

## 📂 Project Structure

```
docs/
├── docs/                        # English documentation (default)
│   ├── intro.md
│   └── api/
│       ├── ship.md
│       ├── planet.md
│       └── ...
├── i18n/                        # Translations
│   └── zh-Hans/                # Simplified Chinese
│       └── docusaurus-plugin-content-docs/
│           └── current/
│               ├── intro.md
│               └── api/
├── src/                         # Custom components
│   ├── css/
│   │   └── custom.css          # Sci-fi theme styling
│   └── pages/
├── static/                      # Static assets
│   └── img/
├── docusaurus.config.ts         # Configuration
├── sidebars.ts                 # Sidebar structure
└── package.json
```

---

## 🎨 Theming

The documentation uses a custom sci-fi space theme matching the game's visual style:

- 🌌 Deep space background with animated stars
- ⚡ Energy cyan accent color (`#00e6e6`)
- 💠 Space blue primary color (`#4a9eff`)
- ✨ Glowing effects on interactive elements
- 🎭 Dark mode optimized (default)

---

## 📄 License

This documentation is part of the Scrastar project and is licensed under the MIT License.

---

## 🤝 Community

- 💬 **Discord**: Join our community (coming soon)
- 🐛 **Issues**: [Report bugs](../../issues)
- 💡 **Discussions**: [Share ideas](../../discussions)

---

## 🙏 Acknowledgments

- Inspired by [Screeps](https://screeps.com/) documentation
- Built with [Docusaurus](https://docusaurus.io/)
- Icon design by the Scrastar community

---

<div align="center">

**Made with ❤️ by the Scrastar Community**

⭐ Star this repo if you find it helpful! ⭐

[🌐 Documentation](https://doc.scrastar.com) · [🎮 Play Now](https://www.scrastar.com) · [📚 Main Repo](../)

</div>
