import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZorroModule } from './../../zorro.module';
import { HeaderComponent } from '../../components/header/header.component';
import { SideMenuComponent } from './../../components/side-menu/side-menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CollapseService } from '../../services/collapse/collapse.service';
import { HandsetService } from '../../services/handset/handset.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services/alert/alert.service';

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
    AlertComponent,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent implements OnInit, OnDestroy {
  readonly handsetService = inject(HandsetService);
  readonly collapseService = inject(CollapseService);

  alertData: any;
  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly elementRef: ElementRef,
    readonly alertService: AlertService
  ) {
    this.alertService.alert$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.alertData = data;
        // Dismiss alert
        if (data) {
          setTimeout(() => {
            this.alertData = null;
          }, 5000); // 5000 milliseconds = 5 seconds
        }
      });
  }

  collapseTrue() {
    this.collapseService.collapseTrue();
  }

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
