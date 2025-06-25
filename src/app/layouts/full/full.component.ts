import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ZorroModule } from './../../zorro.module';
import { HeaderComponent } from '../../components/header/header.component';
import { SideMenuComponent } from './../../components/side-menu/side-menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    ZorroModule,
    HeaderComponent,
    SideMenuComponent,
    FooterComponent,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent implements OnInit {
  handsetService = inject(HandsetService);
  collapseService = inject(CollapseService);

  constructor(readonly elementRef: ElementRef) {
  }

  collapseTrue() {
    this.collapseService.collapseTrue();
  }

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
