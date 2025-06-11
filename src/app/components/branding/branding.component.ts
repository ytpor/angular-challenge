import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [
    RouterModule,
    ZorroModule,
  ],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss'
})
export class BrandingComponent {
  @Input() defaultClass = 'default';
}
