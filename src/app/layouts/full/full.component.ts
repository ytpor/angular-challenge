import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZorroModule } from './../../zorro.module';
import { SideMenuComponent } from './../../components/side-menu/side-menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ZorroModule,
    SideMenuComponent,
    FooterComponent,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent implements OnInit {
  isCollapsed = false;
  isHandset$: Observable<boolean>;

  constructor(readonly elementRef: ElementRef, readonly breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  }

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
