import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IdleService } from './services/idle/idle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Angular Challenge';

  constructor(readonly elementRef: ElementRef, readonly idleService: IdleService) {}

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
    this.idleService.reset();
  }
}
