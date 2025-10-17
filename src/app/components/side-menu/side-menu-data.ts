import { NavItem } from './nav-item/nav-item';
import { version } from '../../../../package.json';
import { environment } from '../../../environments/environment';

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
        roles: ['can-view-category'],
      },
      {
        level: 2,
        titleKey: 'SIDE_MENU.ITEM_ATTRIBUTE',
        route: '/item-attribute',
        roles: ['can-view-attribute'],
      },
      {
        level: 2,
        titleKey: 'v ' + version + ' ' + (environment.environment ?? 'undefined'),
        route: '#',
        disabled: true,
      }
    ],
    roles: ['can-view-category', 'can-view-attribute'],
  },
];