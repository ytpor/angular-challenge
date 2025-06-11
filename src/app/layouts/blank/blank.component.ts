import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ZorroModule } from '../../zorro.module';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ZorroModule,
    FooterComponent,
  ],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent implements OnInit  {
  constructor(readonly elementRef: ElementRef) {}

  ngOnInit(): void {
    // Hide angular version
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}
