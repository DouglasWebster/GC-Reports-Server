import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
    imports: [NxWelcomeComponent, RouterModule],
    selector: 'gc-rep-fe-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BPGC Competition Reports';
}
