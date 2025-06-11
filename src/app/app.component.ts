import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Angular Challenge';

  constructor(readonly elementRef: ElementRef) {}

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
