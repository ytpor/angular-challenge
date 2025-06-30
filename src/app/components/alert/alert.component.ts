import { Component, Input } from '@angular/core';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    ZorroModule,
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: 'error' | 'info' | 'success' | 'warning' = 'error';
  @Input() message: string | null = null;
  @Input() details: string[] = [];
}
