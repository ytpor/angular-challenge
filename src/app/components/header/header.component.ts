import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../services/keycloak/keycloak.service';
import { navItems } from './header-data';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroModule } from './../../zorro.module';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    ZorroModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  keycloakService = inject(KeycloakService);
  router = inject(Router);
  handsetService = inject(HandsetService);
  collapseService = inject(CollapseService);

  menus = navItems;

  toggleMenu() {
    this.collapseService.toggleCollapse();
  }

  public logout(){
    this.keycloakService.logout();
  }
}
