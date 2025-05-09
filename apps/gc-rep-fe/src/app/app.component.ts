import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@lib/client/data-acess';
import { initFlowbite } from 'flowbite';

interface NavBarInfo {
  routerLink: string;
  text: string;
}

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'gc-rep-fe-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  title = 'BPGC Competition Reports';
  navBarInfos: NavBarInfo[] = [
    { routerLink: '/home', text: 'Home' },
    { routerLink: '/results', text: 'Results' },
    { routerLink: '/review', text: 'Reviews' },
    { routerLink: '/import-comp', text: 'Import' },
    { routerLink: '/about', text: 'About' },
    { routerLink: '/login', text: 'Login' },
  ];

  user$ = this.authService.userData$;

  ngOnInit(): void {
    initFlowbite();
    const themeToggleDarkIcon = document.getElementById(
      'theme-toggle-dark-icon'
    );
    const themeToggleLightIcon = document.getElementById(
      'theme-toggle-light-icon'
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      themeToggleLightIcon?.classList.remove('hidden');
    } else {
      themeToggleDarkIcon?.classList.remove('hidden');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn?.addEventListener('click', function () {
      // toggle icons inside button
      themeToggleDarkIcon?.classList.toggle('hidden');
      themeToggleLightIcon?.classList.toggle('hidden');

      // if set via local storage previously
      if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        }

        // if NOT set via local storage previously
      } else {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
        }
      }
    });

    if (this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.authService.logoutUser();
    this.router.navigate(['/login']);
  }
}
