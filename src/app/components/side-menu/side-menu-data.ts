import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    level: 0,
    title: 'Dashboard',
    icon: 'dashboard',
    open: true,
    children: [
      {
        level: 2,
        title: 'Welcome',
        route: '/welcome',
        selected: true,
      },
    ]
  },
  {
    level: 0,
    title: 'Settings',
    icon: 'setting',
    children: [
      {
        level: 2,
        title: 'Category',
        route: '/category',
      },
      {
        level: 2,
        title: 'Item Attribute',
        route: '/item-attribute',
      },
    ]
  }
];