import { Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CollapseService } from '../collapse/collapse.service';

@Injectable({
  providedIn: 'root'
})
export class HandsetService {
  isHandset = signal(false);

  constructor(readonly breakpointObserver: BreakpointObserver, readonly collapseService: CollapseService) {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .subscribe(result => {
        this.isHandset.set(result.matches)
        if (result.matches) {
          collapseService.collapseTrue();
        }
        if (!result.matches) {
          collapseService.collapseFalse();
        }
      });
  }
}
