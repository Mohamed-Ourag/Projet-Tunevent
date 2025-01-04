import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string | null = '';
  userRole: string | null = '';
  showDropdown: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to user state from AuthService
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.userName = user.name;
          this.userRole = user.role;
        }
      },
      error: (err) => console.error('Failed to fetch user info:', err),
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onLogout(): void {
    this.authService.logout();
    this.userName = null;
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userNameElement = document.querySelector('.user-name');

    if (dropdownMenu && userNameElement) {
      if (!dropdownMenu.contains(target) && !userNameElement.contains(target)) {
        this.showDropdown = false;
      }
    }
  }
}
