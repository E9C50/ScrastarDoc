import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // API Documentation Sidebar
  apiSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Core API',
      collapsed: false,
      items: [
        'api/ship',
        'api/planet',
        'api/structure',
        'api/galaxy',
        'api/position',
        'api/jumpgate',
      ],
    },
    {
      type: 'category',
      label: 'Components & Weapons',
      collapsed: false,
      items: [
        'api/components',
        'api/weapons',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsed: false,
      items: [
        'api/config',
      ],
    },
    {
      type: 'category',
      label: 'Constants & Resources',
      collapsed: false,
      items: [
        'api/constants',
      ],
    },
  ],
};

export default sidebars;
