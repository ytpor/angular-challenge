import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollapseService {
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  collapseFalse() {
    this.isCollapsed.set(false);
  }

  collapseTrue() {
    this.isCollapsed.set(true);
  }
}
