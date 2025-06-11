import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZorroModule } from './../../zorro.module';
import { BrandingComponent } from './../branding/branding.component';
import { navItems } from './side-menu-data';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterModule,
    ZorroModule,
    BrandingComponent,
  ],
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent {
  @Input() isCollapsed = false;

  mode = false;
  dark = false;
  menus = navItems;
}
