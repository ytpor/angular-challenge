import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  constructor() {}
}
