import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'gc-rep-fe-print-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './print-layout.component.html',
  styleUrl: './print-layout.component.css',
})
export class PrintLayoutComponent {}
