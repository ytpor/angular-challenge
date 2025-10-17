import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroModule } from './../../zorro.module';
import { BrandingComponent } from './../branding/branding.component';
import { navItems } from './side-menu-data';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';
import { RoleService } from '../../services/role/role.service';
import { NavItem } from './nav-item/nav-item';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    RouterModule,
    TranslateModule,
    ZorroModule,
    BrandingComponent,
  ],
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent implements OnInit {
  handsetService = inject(HandsetService);
  collapseService = inject(CollapseService);
  roleService = inject(RoleService);

  allMenus = navItems;
  filteredMenus: NavItem[] = [];

  ngOnInit() {
    this.filterMenusByRole();
  }

  // Filter menus based on user roles
  filterMenusByRole() {
    this.filteredMenus = this.allMenus
      .map(menu => this.filterMenuItems(menu))
      .filter(menu => this.shouldShowMenu(menu));
  }

  // Recursively filter menu items and their children
  private filterMenuItems(menu: NavItem): NavItem {
    // If menu has children, filter them first
    if (menu.children) {
      const filteredChildren = menu.children
        .map(child => this.filterMenuItems(child))
        .filter(child => this.shouldShowMenu(child));

      // Return menu with filtered children
      return {
        ...menu,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }

    return menu;
  }

  // Check if a menu item should be shown based on roles
  private shouldShowMenu(menu: NavItem): boolean {
    // If no roles are specified, show to everyone
    if (!menu.roles || menu.roles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    return this.roleService.canAccess(menu.roles);
  }

  collapseMenu() {
    if (this.handsetService.isHandset()) {
      this.collapseService.collapseTrue();
    }
  }
}
