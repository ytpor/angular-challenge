import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IdleService } from './services/idle/idle.service';
import { SwUpdate } from '@angular/service-worker';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TranslateModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Angular Challenge';
  updateAvailable = false;

  constructor(
    readonly elementRef: ElementRef,
    readonly idleService: IdleService,
    readonly swUpdate: SwUpdate
  ) {}

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
    this.idleService.reset();

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable = true;
          // You can also add a console log or more complex notification logic here.
          console.log('A new version of the app is available!');
        }
      });
    }
  }
  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
