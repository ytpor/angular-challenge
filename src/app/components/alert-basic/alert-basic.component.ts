import { Component, Input } from '@angular/core';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-alert-basic',
  standalone: true,
  imports: [
    ZorroModule,
  ],
  templateUrl: './alert-basic.component.html',
  styleUrl: './alert-basic.component.scss'
})
export class AlertBasicComponent {
  @Input() type: 'error' | 'info' | 'success' | 'warning' = 'error';
  @Input() message: string | null = null;
  @Input() details: string[] = [];
}
