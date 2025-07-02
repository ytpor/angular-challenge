import { Component, inject } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroModule } from './../../zorro.module';
import { BrandingComponent } from './../branding/branding.component';
import { navItems } from './side-menu-data';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';

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
export class SideMenuComponent {
  handsetService = inject(HandsetService);
  collapseService = inject(CollapseService);

  menus = navItems;

  collapseMenu() {
    if (this.handsetService.isHandset()) {
      this.collapseService.collapseTrue();
    }
  }
}
