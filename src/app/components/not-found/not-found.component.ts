import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZorroModule } from '../../zorro.module';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterModule,
    ZorroModule,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
