import { NavItem } from './nav-item/nav-item';
import { version } from '../../../../package.json';

export const navItems: NavItem[] = [
  {
    level: 0,
    titleKey: 'SIDE_MENU.DASHBOARD',
    icon: 'dashboard',
    open: true,
    children: [
      {
        level: 2,
        titleKey: 'SIDE_MENU.WELCOME',
        route: '/welcome',
        selected: true,
      },
    ]
  },
  {
    level: 0,
    titleKey: 'SIDE_MENU.SETTINGS',
    icon: 'setting',
    children: [
      {
        level: 2,
        titleKey: 'SIDE_MENU.CATEGORY',
        route: '/category',
      },
      {
        level: 2,
        titleKey: 'SIDE_MENU.ITEM_ATTRIBUTE',
        route: '/item-attribute',
      },
      {
        level: 2,
        titleKey: 'v ' + version,
        route: '#',
        disabled: true,
      }
    ]
  },
];