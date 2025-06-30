import { Component } from '@angular/core';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    ZorroModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  constructor() {}
}
