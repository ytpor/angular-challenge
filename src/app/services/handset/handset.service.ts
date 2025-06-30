import { Injectable, signal, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CollapseService } from '../collapse/collapse.service';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandsetService implements OnDestroy {
  readonly isHandset = signal(false);
  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly breakpointObserver: BreakpointObserver,
    readonly collapseService: CollapseService
  ) {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandset.set(result.matches)
        if (result.matches) {
          collapseService.collapseTrue();
        } else {
          collapseService.collapseFalse();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
