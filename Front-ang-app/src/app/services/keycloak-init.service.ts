import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class KeycloakInitService {
  constructor(private keycloakService: KeycloakService) {}

  initKeycloak(): Promise<boolean> {
    return this.keycloakService.init({
      config: {
        url: 'http://localhost:8180/auth',
        realm: 'Tunevent',
        clientId: 'frontend-client',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false, // Disable if unnecessary
      },
      enableBearerInterceptor: true, // Enable Bearer token for HTTP requests
    });
  }
}
