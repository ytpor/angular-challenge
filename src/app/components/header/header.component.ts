import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { navItems } from './header-data';
import { ZorroModule } from './../../zorro.module';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ZorroModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  handsetService = inject(HandsetService);
  collapseService = inject(CollapseService);

  menus = navItems;

  toggleMenu() {
    this.collapseService.toggleCollapse();
  }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
